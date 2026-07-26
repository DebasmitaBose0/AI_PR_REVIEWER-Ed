import prisma from '@/lib/db';
import { inngest } from '../client';
import { getPullRequestDiff, postReviewComment, postReviewWithInlineComments } from '@/module/github/lib/github';
import { retrieveContext } from '@/module/ai/lib/rag';
import { generateText } from 'ai';
import { getAIModel } from '@/module/ai/lib/provider';
import { sendSlackNotification } from '@/module/webhook/lib/slack';

export const generateReview = inngest.createFunction(
  { id: 'generate-review', retries: 3 },
  { event: 'pr.review.requested' },
  async ({ event, step }) => {
    try {
      const { owner, repo, prNumber, userId } = event.data;

      const { diff, title, description, token, commit_id } = await step.run('fetch-pr-data', async () => {
        const account = await prisma.account.findFirst({
          where: {
            userId: userId,
            providerId: 'github',
          },
        });
        if (!account?.accessToken) {
          throw new Error(
            'No GitHub access token found for user. Please reconnect your GitHub account.',
          );
        }
        if (account.accessTokenExpiresAt && new Date(account.accessTokenExpiresAt) < new Date()) {
          throw new Error('GitHub access token has expired. Please re-authenticate.');
        }
        const data = await getPullRequestDiff(account.accessToken, owner, repo, prNumber);
        return { ...data, token: account.accessToken };
      });

      const context = await step.run('retrive-context', async () => {
        const query = `${title}\n${description}`;
        return await retrieveContext(query, `${owner}/${repo}`);
      });

      const aiResult = await step.run('generate-ai-review', async () => {
        const prompt = `You are an expert code reviewer. Analyze the following pull request and provide a detailed, constructive code review.

            PR Title: ${title}
            PR Description: ${description || 'No description provided'}

            Context from Codebase:
            ${context.join('\n\n')}

            Code Changes:
            \`\`\`diff
            ${diff}
            \`\`\`

            Please provide:
            1. **Walkthrough**: A file-by-file explanation of the   changes.
            2. **Sequence Diagram**: A Mermaid JS sequence diagram  visualizing the flow of the changes (if applicable). Use     \`\`\`mermaid ... \`\`\` block. 
            **STRICT MERMAID RULES**:
            - Start with \`sequenceDiagram\`.
            - **MUST** explicitly declare all participants at the top using \`participant Alias as Name\`.
            - **DO NOT** use special characters like parentheses \`()    \`, slashes \`/\`, dots \`.\`, brackets \`[]\`, or braces \`{}\` in participant names or message labels. Use only alphanumeric characters and spaces.
        - Example of a GOOD label: \`Process Payment Request\`
        - Example of a BAD label: \`processPayment(data)\`
        - Keep the diagram focused on the core logic changes.
        - If a diagram is not helpful for these changes, omit this section entirely.
            3. **Summary**: Brief overview.
            4. **Strengths**: What's done well.
            5. **Issues**: Bugs, security concerns, code smells.
            6. **Suggestions**: Specific code improvements.
            7. **Poem**: A short, creative poem summarizing the changes at the very end.
            8. **Quality Score**: A score out of 100 for the PR's code quality. Format it exactly as \`SCORE: X\` (where X is the number) on a new line at the very end of your response.

            IMPORTANT: INLINE COMMENTS
            At the very end of your response, output a structured JSON array of inline comments enclosed in \`\`\`json blocks.
            Each object in the array MUST have:
            - "path": the relative path of the file being commented on (e.g., "src/main.ts")
            - "line": the line number in the modified file that the comment applies to (MUST be an integer)
            - "body": your specific code suggestion or comment
            Example:
            \`\`\`json
            [
              { "path": "src/utils.ts", "line": 42, "body": "Consider using a constant for this magic number." }
            ]
            \`\`\`
            If there are no inline comments, output an empty array \`[]\`.

            Format the rest of your response in markdown.`;
        const text = await generateText({
          model: getAIModel(),
          prompt,
        });
        
        const rawOutput = text.output;
        let score: number | null = null;
        const scoreMatch = rawOutput.match(/SCORE:\s*(\d+)/i);
        if (scoreMatch) {
          score = parseInt(scoreMatch[1], 10);
        }

        let inlineComments: { path: string; line: number; body: string }[] = [];
        let reviewBody = rawOutput;

        // Try to extract the JSON block
        const jsonMatch = rawOutput.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            const parsed = JSON.parse(jsonMatch[1]);
            if (Array.isArray(parsed)) {
              inlineComments = parsed.filter(c => c.path && typeof c.line === 'number' && c.body);
            }
            // Remove the JSON block from the main review body
            reviewBody = rawOutput.replace(/```json\s*([\s\S]*?)\s*```/, '').trim();
          } catch (e) {
            console.error('Failed to parse inline comments JSON', e);
          }
        }

        return { review: reviewBody, score, inlineComments };
      });
      await step.run('post-comment', async () => {
        if (aiResult.inlineComments.length > 0) {
          await postReviewWithInlineComments(token, owner, repo, prNumber, commit_id, aiResult.review, aiResult.inlineComments);
        } else {
          await postReviewComment(token, owner, repo, prNumber, aiResult.review);
        }
      });
      const repository = await step.run('save-review', async () => {
        const repository = await prisma.repository.findFirst({
          where: {
            owner,
            name: repo,
          },
        });
        if (repository) {
          await prisma.review.create({
            data: {
              repositoryId: repository.id,
              prNumber,
              prTitle: title,
              prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
              review: aiResult.review,
              status: 'completed',
              qualityScore: aiResult.score,
            },
          });
        }
        return repository;
      });
      await step.run('notify-slack', async () => {
        if (repository?.slackWebhookUrl) {
          await sendSlackNotification(repository.slackWebhookUrl, {
            text: `✅ *AI PR Review Completed*\n*Repository*: ${owner}/${repo}\n*PR*: <https://github.com/${owner}/${repo}/pull/${prNumber}|#${prNumber} - ${title}>`,
          });
        }
      });
      console.log('[INNGEST] Review completed successfully for:', owner, repo, prNumber);
      return {
        success: true,
      };
    } catch (error) {
      console.error('[INNGEST] Error in generateReview function:', error);
      throw error;
    }
  },
);

## Description
Closes #160

This PR resolves Issue #160 by introducing a `qualityScore` to PR reviews. 

### Changes Made:
- **Database/Model**: Added `qualityScore` field to the `Review` model.
- **AI Prompt**: Updated the AI prompt in `inngest/functions/review.ts` to explicitly request a quality score out of 100 based on the PR's code quality.
- **Processing Logic**: Added regex extraction logic to parse the `qualityScore` from the AI's generated response.
- **Dashboard UI**: Displayed the `qualityScore` in the `recent-activity-card.tsx` component on the dashboard to provide better visibility into PR quality.

## Type of change
- [x] New feature (non-breaking change which adds functionality)

## Checklist:
- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have made corresponding changes to the documentation

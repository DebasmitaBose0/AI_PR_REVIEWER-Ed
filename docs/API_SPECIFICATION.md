# AI PR Reviewer — REST & Webhook API Specification

This document provides a technical specification of the public and internal REST/Webhook endpoints in AI PR Reviewer.

## 1. Webhook Endpoints

### `POST /api/inngest`
- **Description**: Listens for Inngest background event triggers (`pr.review.requested`).
- **Headers**:
  - `x-inngest-signature`: HMAC signature validation
- **Payload**:
  ```json
  {
    "name": "pr.review.requested",
    "data": {
      "owner": "octocat",
      "repo": "Hello-World",
      "prNumber": 42,
      "userId": "user_cuid_123"
    }
  }
  ```

### `POST /api/webhooks/github`
- **Description**: Receives GitHub Pull Request webhooks (`pull_request.opened`, `pull_request.synchronize`).
- **Headers**:
  - `x-hub-signature-256`: SHA256 HMAC verification header using `GITHUB_WEBHOOK_SECRET`.

---

## 2. Server Actions & Services

### Review Analytics (`module/review/actions/analytics.ts`)
- `getReviewAnalyticsAction(repositoryId?: string)`: Computes aggregate scores, time-series distributions, and completed vs pending counts.

### Repository Health (`module/repository/actions/health.ts`)
- `checkRepositoryHealthAction(repositoryId: string)`: Verifies GitHub webhook status, last delivery timestamp, and response code.

# UniTrade + Agent37 Cloud integration

This patch adds a floating **UniTrade AI** chat assistant to the existing static website and a Vercel serverless API route that calls your Agent37-hosted agent.

## What's included
- `agent37-widget.js` and `agent37-widget.css`: responsive floating chat UI with suggested prompts.
- `api/agent37-chat.js`: server-side proxy to `POST https://<instance>.agent37.app/v1/responses`.
- Updated `index.html`: loads the widget assets.
- `.env.example`: documents the server-only environment variables.

## Required one-time setup

1. In Agent37 Cloud, create or select a running **Hermes agent** instance (the `agent37-hermes` template supports `/v1/responses`). Ensure the instance is healthy and model access is configured. Creating/running instances consumes wallet balance.
2. In Agent37 dashboard, create an API key from the Cloud API Keys page. Keep it secret.
3. In your Vercel project, open **Settings → Environment Variables** and add:
   - `AGENT37_API_KEY` = your Agent37 workspace API key
   - `AGENT37_INSTANCE_ID` = the instance ID shown in Agent37 (the short ID, not the API key)
   - Instead of the ID, you may set `AGENT37_INSTANCE_URL` to the instance's HTTPS origin.
4. Redeploy the Vercel project so the serverless function receives the new variables.
5. Open your live UniTrade site and click **UniTrade AI** at the bottom-right. Try “Explain UniTrade's main features.”

## Important security notes
- The API key is read only by the serverless function and is never included in browser JavaScript.
- Do not commit a real `.env` file or paste the API key into chat.
- This is a shared assistant instance for the website. If you need private memory and isolated sessions for each signed-in student, provision per-user instances and add authenticated server-side ownership checks before production.
- The agent cannot read live UniTrade listings or Firebase records through this integration. It answers from its agent configuration and the message context; it is instructed not to invent current listings.
- Test before promoting to production. If the assistant shows a configuration message, environment variables are missing or the project has not been redeployed. If it reports readiness/authentication issues, check the instance ID, API key, instance health, and model credentials/budget in Agent37.

## API contract
Browser: `POST /api/agent37-chat` with `{ "message": "...", "session_id": "..." }`.
Vercel function: forwards to the configured Agent37 instance `/v1/responses`, using `X-Agent37-Key` server-side, and returns `{ "reply": "...", "session_id": "..." }`.

## Reference
- Agent37 quickstart and API example: https://www.agent37.com/docs/llms-full.txt
- Cloud dashboard: https://www.agent37.com/dashboard/cloud

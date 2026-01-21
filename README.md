# SSx – Enterprise Agent Design & Control Plane (Demo v2)

Self-contained Next.js demo showcasing:
- **AURA**: Agent Spec Wizard (structured spec + autonomy + approvals + readiness)
- **AIF**: Agent Registry (dashboard of all agents)
- **Operations**: Workflow Monitor
- **Governance**: Audit & Kill Switch

Includes 5 ready-made demos: Salesforce, Workday, ServiceNow, AWS, n8n.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy to Vercel
1) Push this folder to GitHub
2) Import in Vercel as a Next.js project
3) Deploy → share the URL

## Exec demo (7 minutes)
1) Home → **Try a demo scenario**
2) Spec Wizard → skim controls → **Run readiness gate**
3) **Register agent**
4) Registry → show status + pause/kill
5) Monitor → **Trigger demo run**
6) Audit → show new event

## Notes
- Demo uses **LocalStorage** (no backend, no secrets).
- Use **Reset demo data** on Home to restore seeded state.

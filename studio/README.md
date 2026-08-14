# ACM Hotels — Sanity Studio

Schema and admin UI for the ACM Hotels site's content (Sanity project
`skdlufghe66k2twbxmy2l1ii`, dataset `production` — see
`/docs/infrastructure.md`).

## Local development

```bash
npm install
npm run dev
```

## Deploying the hosted Studio (one-time / after schema changes)

Studio auth is interactive (browser OAuth), so this step can't be scripted —
run it yourself once per machine:

```bash
npx sanity login
npm run deploy
```

This publishes the Studio to `https://acm-hotels.sanity.studio` (or prompts
for a hostname on first deploy). Admins use that URL to edit content — see
`docs/agents/domain.md` for who "Admin" refers to.

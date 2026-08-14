# Infrastructure

Deploy-time IDs and where credentials live for ACM Hotels. Actual secret values
live only in GitHub Actions secrets (`gh secret list` on this repo) — never in
this file or in git. Provisioned by `scripts/provision-acm-hotels-deploy.sh`
(issue #3).

## Sanity

- Project ID: `skdlufghe66k2twbxmy2l1ii`
- Dataset: `production`

## Deploy server (Beget)

- Host: `155.212.140.174`
- Deploy user: `deploy` (shared with tic-tac-toe-online's own deploy user on
  this box; NOPASSWD sudo) — `/opt/acm-hotels` created and owned by it
- SSH deploy key: dedicated `acm_hotels_deploy` ed25519 pair (fingerprint
  `SHA256:MHbEo/wrK1ts8bwdFaRLealmk3lnptIXoewtz+M8poY`), not shared with
  tic-tac-toe-online's own key. Private half stored as the `DEPLOY_SSH_KEY`
  GitHub Actions secret; public half appended to `deploy`'s
  `authorized_keys` on the server (alongside tic-tac-toe-online's).
- Domain: `partners.acm-hotels.ru` — DNS A record → `155.212.140.174` (done).
  Routed by the shared edge-proxy (Fuberg/edge-proxy) to this project's
  container; TLS cert already issued (confirmed via `caddy reload`, verified
  502 from the app before any container was deployed — proxy path is live).

## GHCR (container registry)

- Push access: `default_workflow_permissions` on the repo is `read`, but the
  workflow declares `permissions: packages: write` at the job level, which
  overrides it — confirmed working (`build-and-push` has succeeded).
- Pull access: `ghcr.io/fuberg/acm-hotels-landing` is set **public** (Package
  settings → Danger Zone → Change visibility), same as tic-tac-toe-online's
  package — the deploy server's unauthenticated `docker compose pull` works.
  Confirmed: full `Deploy` workflow (build-and-push → deploy → verify) green
  end-to-end, `https://partners.acm-hotels.ru` returns 200.

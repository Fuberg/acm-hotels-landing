# Infrastructure

Deploy-time IDs and where credentials live for ACM Hotels. Actual secret values
live only in GitHub Actions secrets (`gh secret list` on this repo) — never in
this file or in git. Provisioned by `scripts/provision-acm-hotels-deploy.sh`
(issue #3).

## Sanity

- Project ID: _not yet provisioned_
- Dataset: _not yet provisioned_

## Deploy server (Beget)

- Host: _not yet provisioned_
- Deploy user: _not yet provisioned_
- SSH deploy key: _not yet provisioned_
- Domain: `partners.acm-hotels.ru` — DNS A record _not yet provisioned_; routed
  by the shared edge-proxy (Fuberg/edge-proxy) to this project's container

## GHCR (container registry)

- Push access: _not yet confirmed_
- Pull access: the deploy server's `docker compose pull` (issue #5's workflow)
  runs without a registry login, so the `ghcr.io/fuberg/acm-hotels-landing`
  package must be set **public** after its first push (package page → Package
  settings → Danger Zone → Change visibility), the same way tic-tac-toe-online's
  package was handled — otherwise the pull on the server fails with an auth
  error.

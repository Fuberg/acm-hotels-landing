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

## GHCR (container registry)

- Push access: _not yet confirmed_

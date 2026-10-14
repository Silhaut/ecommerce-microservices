# Contributing

This is a solo learning project, but it follows the same workflow a real team would use —
that discipline is part of the point. Every change follows the same path:
**one issue → one branch → one PR → squash merge.**

## Local setup

```sh
pnpm install          # also installs the git hooks (husky)
cp .env.example .env
docker compose up -d  # postgres, redis, rabbitmq — see README for ports
```

## Branch naming

```
<type>/<issue-number>-<short-slug>
```

Examples: `feat/23-saga-orchestrator`, `fix/45-cart-ttl-bug`, `docs/5-contributing-and-templates`.

`<type>` matches the issue's `type:*` label (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`).

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint on every
commit (`.husky/commit-msg`) and on every PR title (CI):

```
<type>(<scope>): <description> (#<issue-number>)
```

`<scope>` must be one of the service areas declared in `commitlint.config.js`'s `scope-enum`
(`auth`, `catalog`, `order`, `infra`, `shared`, …) — matching the issue's `area:*` label.

## Pull requests

- One PR closes exactly one issue. The PR body must contain `Closes #<issue-number>` so the
  issue and its milestone progress bar update automatically on merge.
- Mirror the issue's labels and milestone onto the PR.
- **Squash merge only** — the repo is configured to not allow merge commits or rebase merges,
  so `main` stays a linear, one-commit-per-issue history. The squash commit title becomes the
  PR title, so write PR titles in the same Conventional Commits format as a commit message.
- CI (`nx affected` on lint/test/build/typecheck/e2e, plus the PR-title commitlint check) must
  pass before merging — this is enforced by branch protection on `main`.

## Labels

- `type:*` — kind of change (feature, bug, chore, docs, refactor, test)
- `area:*` — which service/package it touches
- `pattern:*` — which architectural pattern it demonstrates (saga, outbox, event-driven, resilience, cqrs)
- `priority:*` — P0/P1/P2

## Architecture decisions

Non-obvious architectural choices (why a pattern was picked, what the alternative was) go in
`docs/adr/` as a short ADR, referenced from the issue that introduced the decision.

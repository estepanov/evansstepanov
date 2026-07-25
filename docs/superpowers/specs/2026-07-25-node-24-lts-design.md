# Node 24 LTS Build Runtime Design

## Goal

Standardize local development and Cloudflare Pages builds on Node.js 24 LTS so
the dependency installation satisfies Storybook's transitive
`oxc-parser@0.127.0` engine requirement.

## Runtime configuration

- Pin Node.js `24.18.0` in `.nvmrc`. Cloudflare Pages reads this file when it
  selects the Node.js version for Git and pull-request preview builds.
- Declare `"node": ">=24 <25"` in the root `package.json` `engines` field so
  package managers reject unsupported Node.js majors.
- Regenerate the root package metadata in `package-lock.json` so it mirrors the
  `package.json` engine declaration.
- Do not change application code or dependency versions.

## Validation

1. Confirm Node `22.3.0` does not satisfy the repository's new engine range.
2. Confirm Node `24.18.0` satisfies the repository and `oxc-parser` engine
   ranges.
3. Run a clean dependency installation under Node `24.18.0`.
4. Run the repository checks and production build under Node `24.18.0`.

The production build may still require the existing Notion environment
variables; this change does not alter that integration.

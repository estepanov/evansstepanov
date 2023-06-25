# My personal domain

A very simple personal landing page, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Data sourced from Notion

Before you can build/run the project you will Notion integration, check [their API docs](https://developers.notion.com/docs/getting-started).

1. Set up a private integration from https://www.notion.so/my-integrations
2. Copy Notion's "internal integration secret" and paste it into `.env` file as `NOTION_TOKEN`
3. Grant the integration access to a Notion database, this is done via `Connections` > `Add a connection`

### The Main Links DB

These are the instructions for creating a DB that will show up on the landing page

1. In Notion create a new database
2. We need a `Name` and `URL` field
3. Grab the [database id](https://developers.notion.com/docs/working-with-databases) and save it to `.env` as `LANDING_LINKS_NOTION_DB_ID`

## Developing

Once you've cloned this projecte installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of this app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Sample `.env.local`

```bash
NOTION_TOKEN=
LANDING_LINKS_NOTION_DB_ID=
```

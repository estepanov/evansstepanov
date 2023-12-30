
export interface Tech {
    name: string,
    description?: string,
    url?: string,
    image?: string
}

export const tech: Tech[] = [
    {
        name: 'NodeJS',
        description: 'Node.js® is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
        url: 'https://nodejs.org/en/',
    },
    {
        name: 'TypeScript',
        description: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
        url: 'https://www.typescriptlang.org/',
    },
    {
        name: 'React',
        description: 'React is a JavaScript library for building user interfaces.',
        url: 'https://reactjs.org/',
    },
    {
        name: 'Svelte',
        description: 'Cybernetically enhanced web apps',
        url: 'https://svelte.dev/',
    },
    {
        name: 'NextJS',
        description: 'Next.js is a React framework for building fullstack react applications.',
        url: 'https://nextjs.org/',
    },
    {
        name: 'SvelteKit',
        description: 'Fullstack Svelte framework',
        url: 'https://kit.svelte.dev/',
    },
    {
        name: 'GraphQL',
        description: 'GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.',
        url: 'https://graphql.org/',
    },
    {
        name: 'tRPC',
        description: 'Typescript RPC - A TypeScript framework for building end-to-end type-safe APIs with TypeScript and Node.js',
        url: 'https://trpc.io/',   
    },
    {
        name: 'Express',
        description: 'Fast, unopinionated, minimalist web framework for Node.js',
        url: 'https://expressjs.com/',        
    },
    {
        name: 'Prisma',
        description: 'Next-generation Node.js and TypeScript ORM for PostgreSQL, MySQL, MariaDB, SQL Server, and SQLite',
        url: 'https://www.prisma.io/',
    },
    {
        name: 'Drizzle',
        description: 'ORML for PostgreSQL, MySQL, MariaDB, SQL Server, and SQLite',
    },
    {
        name: 'PostgreSQL',
        description: 'The world\'s most advanced open source database',
        url: 'https://www.postgresql.org/',
    },
    {
        name: 'SQLite',
        description: 'SQLite is a small, fast, self-contained, high-reliability, full-featured, SQL database engine.',
        url: 'https://www.sqlite.org/',
    },
    {
        name: 'DynamoDB',
        description: 'Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale.',
        url: 'https://aws.amazon.com/dynamodb/',
    },
    {
        name: 'MongoDB',
        description: 'A popular NoSQL database for modern apps',
        url: 'https://www.mongodb.com/',
    },
    {
        name: 'Redis',
        description: 'Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache, and message broker.',
        url: 'https://redis.io/',
    },
    {
        name: 'TurboRepo',
        description: 'A simple and fast monorepo manager',
    },
    {
        name: 'Docker',
        description: 'Docker is an open platform for developing, shipping, and running applications.',
        url: 'https://www.docker.com/',
    },
    {
        name: 'AWS CDK',
        description: 'The AWS Cloud Development Kit is a framework for defining cloud infrastructure in code',
        url: 'https://aws.amazon.com/cdk/',
    },
    {
        name: 'Cypress',
        description: 'Fast, easy and reliable testing for anything that runs in a browser.',
        url: 'https://www.cypress.io/',
    },
    {
        name: 'Playwright',
        description: 'Playwright is a Node library to automate Chromium, Firefox and WebKit with a single API.',
        url: 'https://playwright.dev/',
    },
    {
        name:'Jest',
        description: 'Jest is a delightful JavaScript Testing Framework with a focus on simplicity.',
        url: 'https://jestjs.io/',
    },
    {
        name: 'React Testing Library',
        description: 'Simple and complete React DOM testing utilities that encourage good testing practices.',
        url: 'https://testing-library.com/docs/react-testing-library/intro/',
    },
    {
        name: 'TailwindCSS',
        description: 'A utility-first CSS framework for rapidly building custom designs.',
        url: 'https://tailwindcss.com/',
    },
    {
        name: 'Styled Components',
        description: 'Visual primitives for the component age.',
        url: 'https://styled-components.com/',
    },
    {
        name: 'Emotion',
        description: 'The Next Generation of CSS-in-JS',
        url: 'https://emotion.sh/',
    },
]
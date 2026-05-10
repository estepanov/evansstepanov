import { JavaIcon } from '@hugeicons/core-free-icons';
import DropwizardIcon from '../components/icons/DropwizardIcon.svelte';
import PlaywrightIcon from '../components/icons/PlaywrightIcon.svelte';
import AwsIcon from '../components/icons/AwsIcon.svelte';
import {
	SiReact,
	SiTypescript,
	SiNextdotjs,
	SiReactquery,
	SiTrpc,
	SiHono,
	SiDrizzle,
	SiNodedotjs,
	SiBun,
	SiStyledcomponents,
	SiTailwindcss,
	SiChakraui,
	SiExpress,
	SiPostgresql,
	SiSvelte,
	SiSqlite,
	SiAmazondynamodb,
	SiMongodb,
	SiPrisma,
	SiMongoose,
	SiDocker,
	SiGithubactions,
	SiCypress,
	SiJest,
	SiVitest,
	SiMockserviceworker,
	SiBuddy,
	SiGraphql,
	SiTurborepo,
	SiRedis,
	SiTestinglibrary
} from '@icons-pack/svelte-simple-icons';

export type TechIcon =
	| { kind: 'simple'; component: any }
	| { kind: 'hugeicons'; icon: any };

const simple = (component: any): TechIcon => ({ kind: 'simple', component });
const huge = (icon: any): TechIcon => ({ kind: 'hugeicons', icon });

export const techIconMap: Record<string, TechIcon> = {
	Java: huge(JavaIcon),
	Dropwizard: simple(DropwizardIcon),
	Playwright: simple(PlaywrightIcon),
	'React Testing Library': simple(SiTestinglibrary),
	'Testing Library': simple(SiTestinglibrary),
	'AWS CDK': simple(AwsIcon),
	AWS: simple(AwsIcon),
	TailwindCSS: simple(SiTailwindcss),
	Redis: simple(SiRedis),
	React: simple(SiReact),
	TypeScript: simple(SiTypescript),
	NextJS: simple(SiNextdotjs),
	'Next.js': simple(SiNextdotjs),
	'React Query': simple(SiReactquery),
	tRPC: simple(SiTrpc),
	Hono: simple(SiHono),
	'Drizzle ORM': simple(SiDrizzle),
	Drizzle: simple(SiDrizzle),
	NodeJS: simple(SiNodedotjs),
	'Node.js': simple(SiNodedotjs),
	Bun: simple(SiBun),
	GraphQL: simple(SiGraphql),
	TurboRepo: simple(SiTurborepo),
	'Styled-Components': simple(SiStyledcomponents),
	'Chakra UI': simple(SiChakraui),
	Express: simple(SiExpress),
	PostgreSQL: simple(SiPostgresql),
	Svelte: simple(SiSvelte),
	SvelteKit: simple(SiSvelte),
	SQLite: simple(SiSqlite),
	DynamoDB: simple(SiAmazondynamodb),
	MongoDB: simple(SiMongodb),
	'Prisma ORM': simple(SiPrisma),
	Prisma: simple(SiPrisma),
	'Mongoose ORM': simple(SiMongoose),
	Mongoose: simple(SiMongoose),
	Docker: simple(SiDocker),
	'GitHub Actions': simple(SiGithubactions),
	Cypress: simple(SiCypress),
	Jest: simple(SiJest),
	Vitest: simple(SiVitest),
	'Mock Service Worker': simple(SiMockserviceworker),
	Buddy: simple(SiBuddy)
};

export function getTechIcon(techName: string): TechIcon | null {
	return techIconMap[techName] ?? null;
}

<script lang="ts">
	import {
		SiGithub,
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
		SiAmazonwebservices
	} from '@icons-pack/svelte-simple-icons';
	import Playwright from './icons/Playwright.svelte';

	export let tag = '';
	export let size = 20;

	let icon: any = null;
	switch (tag) {
		case 'React':
			icon = SiReact;
			break;
		case 'TypeScript':
			icon = SiTypescript;
			break;
		case 'NextJS':
			icon = SiNextdotjs;
			break;
		case 'React Query':
			icon = SiReactquery;
			break;
		case 'tRPC':
			icon = SiTrpc;
			break;
		case 'Hono':
			icon = SiHono;
			break;
		case 'Drizzle':
			icon = SiDrizzle;
			break;
		case 'TailwindCSS':
			icon = SiTailwindcss;
			break;
		case 'ChakraUI':
			icon = SiChakraui;
			break;
		case 'Express':
			icon = SiExpress;
			break;
		case 'PostgreSQL':
			icon = SiPostgresql;
			break;
		case 'Svelte':
			icon = SiSvelte;
			break;
		case 'SQLite':
			icon = SiSqlite;
			break;
		case 'DynamoDB':
			icon = SiAmazondynamodb;
			break;
		case 'MongoDB':
			icon = SiMongodb;
			break;
		case 'Prisma':
			icon = SiPrisma;
			break;
		case 'NodeJS':
			icon = SiNodedotjs;
			break;
		case 'Chakra UI':
			icon = SiChakraui;
			break;
		case 'Mongoose':
			icon = SiMongoose;
			break;
		case 'Docker':
			icon = SiDocker;
			break;
		case 'GitHub Actions':
			icon = SiGithubactions;
			break;
		case 'Cypress':
			icon = SiCypress;
			break;
		case 'Jest':
			icon = SiJest;
			break;
		case 'Vitest':
			icon = SiVitest;
			break;
		case 'Buddy':
			icon = SiBuddy;
			break;
		case 'AWS':
			icon = SiAmazonwebservices;
			break;
		case 'Mock Service Worker':
			icon = SiMockserviceworker;
			break;
		case 'Bun':
			icon = SiBun;
			break;
		case 'Styled Components':
			icon = SiStyledcomponents;
			break;
		case 'Playwright':
			icon = 'playwright';
			break;
		default:
			icon = null;
			break;
	}
</script>

{#if icon === 'playwright'}
	<Playwright />
{:else if icon}
	<svelte:component this={icon} {size} />
{/if}

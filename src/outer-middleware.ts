import { defineMiddleware } from 'astro:middleware';
import { emdashTrailingSlashLocation } from './util/emdash-trailing-slash';

/**
 * Runs as EmDash `middleware.outer` (Astro `order: "pre"`, before the EmDash
 * stack). An early 308 skips runtime/auth so POST/passkey bodies are not read
 * on the unsashed URL; the client retries the slashed path.
 */
export const onRequest = defineMiddleware((context, next) => {
	const location = emdashTrailingSlashLocation(context.url);
	if (location) {
		return context.redirect(location, 308);
	}
	return next();
});

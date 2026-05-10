import { browser } from '$app/environment';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function readInitialMode(): ThemeMode {
	if (!browser) return 'system';
	const root = document.documentElement;
	const fromAttr = root.dataset.themeMode as ThemeMode | undefined;
	if (fromAttr === 'light' || fromAttr === 'dark' || fromAttr === 'system') return fromAttr;
	return 'system';
}

function systemPrefersDark(): boolean {
	return browser && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolve(mode: ThemeMode): ResolvedTheme {
	if (mode === 'system') return systemPrefersDark() ? 'dark' : 'light';
	return mode;
}

function apply(resolved: ResolvedTheme, mode: ThemeMode) {
	if (!browser) return;
	const root = document.documentElement;
	root.classList.toggle('dark', resolved === 'dark');
	root.style.colorScheme = resolved;
	root.dataset.themeMode = mode;
}

class ThemeController {
	mode = $state<ThemeMode>(readInitialMode());
	systemDark = $state<boolean>(systemPrefersDark());

	resolved = $derived<ResolvedTheme>(
		this.mode === 'system' ? (this.systemDark ? 'dark' : 'light') : this.mode
	);

	constructor() {
		if (!browser) return;
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		mq.addEventListener('change', (e) => {
			this.systemDark = e.matches;
			if (this.mode === 'system') apply(e.matches ? 'dark' : 'light', 'system');
		});
	}

	set(next: ThemeMode) {
		this.mode = next;
		const resolved = resolve(next);
		const run = () => {
			apply(resolved, next);
			if (next === 'system') {
				try {
					localStorage.removeItem(STORAGE_KEY);
				} catch {}
			} else {
				try {
					localStorage.setItem(STORAGE_KEY, next);
				} catch {}
			}
		};

		const doc = browser ? (document as Document & { startViewTransition?: (cb: () => void) => void }) : null;
		const reduced =
			browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (doc?.startViewTransition && !reduced) {
			doc.startViewTransition(run);
		} else {
			run();
		}
	}

	cycle() {
		const order: ThemeMode[] = ['light', 'dark', 'system'];
		const next = order[(order.indexOf(this.mode) + 1) % order.length];
		this.set(next);
	}
}

export const theme = new ThemeController();

<script lang="ts">
	export let href: string;
	export let className: string = '';
	export let target: string | undefined = undefined;
	export let rel: string | undefined = undefined;
</script>

<a
	{href}
	{target}
	{rel}
	class="w-full ease-in-out transition-all duration-300 text-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 py-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50/50 hover:border-emerald-700/40 hover:dark:bg-emerald-700/10 hover:dark:border-emerald-500/30 dark:hover:text-emerald-300 flex justify-center items-center font-medium flex-1 gap-x-2 {className}"
>
	<slot />
</a>

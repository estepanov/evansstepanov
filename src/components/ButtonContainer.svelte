<script lang="ts">
	export let className: string = '';
</script>

<div class="flex flex-col md:flex-row gap-x-8 items-center justify-center {className}">
	<slot />
</div>

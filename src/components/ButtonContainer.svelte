<script lang="ts">
	export let className: string = '';
</script>

<div class="flex flex-col md:flex-row md:gap-x-8 gap-y-4 items-center justify-center {className}">
	<slot />
</div>

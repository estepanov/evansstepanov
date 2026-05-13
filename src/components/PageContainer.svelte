<script lang="ts">
	let className: string = '';
	export { className as class };
</script>

<div class="max-w-5xl w-full mx-auto p-5 flex flex-col items-center {className}">
	<slot />
</div>

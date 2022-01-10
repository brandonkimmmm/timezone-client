<svelte:head>
	<link href='https://cdn.jsdelivr.net/npm/daisyui@1.16.2/dist/full.css' rel='stylesheet' type='text/css' />
	<link href='https://cdn.jsdelivr.net/npm/tailwindcss@2.2/dist/tailwind.min.css' rel='stylesheet' type='text/css' />
</svelte:head>

<style global lang='postcss'>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>

<script lang='ts'>
	import { User, UserStore } from './stores';
	import LoginForm from './components/LoginForm.svelte';

	let user: UserStore;

	User.subscribe((value) => user = value);
</script>

<main>
	{#await User.init()}
		<div>Loading</div>
	{:then}
		{#if user.auth}
			<div>{JSON.stringify(user.data)}</div>
		{:else}
			<LoginForm />
		{/if}
	{:catch error}
		<p>Something went wrong</p>
	{/await}
</main>

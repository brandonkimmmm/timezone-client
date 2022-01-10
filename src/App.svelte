<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>

<script lang="ts">
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

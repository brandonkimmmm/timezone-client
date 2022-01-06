<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>

<script lang="ts">
	import { GlobalUser, User } from './stores';
	import LoginForm from './components/LoginForm.svelte';

	let user: User;

	GlobalUser.subscribe((value) => user = value);
</script>

<main>
	{#if user.auth}
		<p>Welcome back!</p>
	{:else}
		<LoginForm/>
	{/if}
</main>

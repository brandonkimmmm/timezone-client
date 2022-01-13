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
	import SignupForm from './components/SignupForm.svelte';
	import Home from './components/Home.svelte';

	let user: UserStore;

	let activeTab = 'login';

	User.subscribe((value) => user = value);
</script>

<main class='p-4'>
	{#await User.init()}
		<div>Loading</div>
	{:then}
		{#if user.auth}
			<Home />
		{:else}
			<div class='tabs'>
				<div
					class='tab tab-lg tab-lifted {activeTab === 'login' ? 'tab-active' : ''}'
					on:click='{() => activeTab = 'login'}'
				>Login</div>
				<div
					class='tab tab-lg tab-lifted {activeTab === 'signup' ? 'tab-active' : ''}'
					on:click='{() => activeTab = 'signup'}'
				>Signup</div>
			</div>
			{#if activeTab === 'login'}
				<LoginForm />
			{:else if activeTab === 'signup'}
				<SignupForm bind:activeTab />
			{/if}
		{/if}
	{:catch error}
		<p>Something went wrong</p>
	{/await}
</main>

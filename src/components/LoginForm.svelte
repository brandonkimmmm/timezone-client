<script lang='ts'>
	import { GlobalUser } from '../stores';

	export let email: string = '';
	export let password: string = '';

	function login() {
		console.log('API_URL');
		alert(email);
		alert(password);
	}
</script>

<h1>Form</h1>
<form on:submit|preventDefault={login} class='bg-blue-400'>
	<input class='bg-red-400' type='text' bind:value={email} />
	<input class='bg-red-400' type='password' bind:value={password} />
	<button>Login</button>
</form>

<script lang='ts'>
	import { User } from '../stores';

	export let email: string = '';
	export let password: string = '';

	async function login() {
		const res = await fetch('API_URL/login', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email,
				password
			})
		});

		email = '';
		password = '';

		const data = await res.json();

		if (!res.ok) {
			alert(data.message);
			return;
		}

		User.set(data.token, data.user);
		localStorage.setItem('token', data.token);

		alert('Welcome Back!');
	}
</script>

<h1>Form</h1>
<form on:submit|preventDefault={login} class='bg-blue-400'>
	<input class='bg-red-400' type='text' bind:value={email} />
	<input class='bg-red-400' type='password' bind:value={password} />
	<button>Login</button>
</form>

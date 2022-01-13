<script lang='ts'>
	import { User } from '../stores';

	export let email: string = '';
	export let password: string = '';

	async function login() {
		try {
			await User.login(email, password);
			email = '';
			password = '';
			alert('Welcome back!');
		} catch (err) {
			email = '';
			password = '';
			alert(err instanceof Error ? err.message : 'Something went wrong');
		}
	}
</script>

<div class='p-10 card bg-base-200'>
	<div class='form-control'>
		<label for='email' class='label'>
			<span class='label-text'>Email</span>
		</label>
		<input class='input' type='text' bind:value={email} />
		<label for='password' class='label'>
			<span class='label-text'>Password</span>
		</label>
		<input class='input' type='password' bind:value={password} />
		<div on:click|preventDefault={login} class='btn btn-primary mt-4'>Login</div>
	</div>
</div>
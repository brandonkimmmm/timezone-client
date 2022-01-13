<script lang='ts'>
	export let email: string = '';
	export let password: string = '';
	export let password_confirmation = '';

	async function signup() {
		try {
			if (password !== password_confirmation) {
				throw new Error('Passwords do not match');
			}

			const res = await fetch('API_URL/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					password,
					password_confirmation
				})
			});

			email = '';
			password = '';

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message);
			}

			alert('Successful!');
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
		<label for='password_confirmation' class='label'>
			<span class='label-text'>Password Confirmation</span>
		</label>
		<input class='input' type='password' bind:value={password_confirmation} />
		<div on:click|preventDefault={signup} class='btn btn-primary mt-4'>Signup</div>
	</div>
</div>
<script lang='ts'>
	import { User, UserStore } from '../stores';

	let user: UserStore;

	User.subscribe((value) => user = value);

	function logout() {
		User.logout();
		alert('Logged out');
	}
</script>

<div>
	<div on:click|preventDefault={logout} class='btn btn-error w-full'>Logout</div>
</div>
<script lang='ts'>
	import { User } from '../stores';
	import { ApolloClient, InMemoryCache, HttpLink, MutationUpdaterFunction } from '@apollo/client';
	import { setClient } from 'svelte-apollo';

	function createApolloClient(authToken: string) {
		const httpLink = new HttpLink({
			uri: 'API_URL/graphql/user',
			headers: {
				Authorization: `Bearer ${authToken}`
			}
		});

		const cache = new InMemoryCache();

		const client = new ApolloClient({
			link: httpLink,
			cache
		});

		return client;
	}

	const client = createApolloClient(localStorage.getItem('token') as string);
	setClient(client);

	import { gql } from '@apollo/client';
	import { query, mutation } from 'svelte-apollo';

	interface Timezone {
		id: number;
		name: string;
		city: string;
		timezone: string;
		offset: string;
	}

	const GET_TIMEZONES = gql`
		query {
			getTimezones {
				id
				name
				city
				timezone
				offset
			}
		}
	`;

	const timezones = query<{ getTimezones: Timezone[] }>(GET_TIMEZONES);

	function logout() {
		User.logout();
		alert('Logged out');
	}

	let showAddModal = false;

	let name = '';
	let city = '';
	let country = '';

	const CREATE_TIMEZONE = gql`
		mutation ($name: String!, $city: String!, $country: String) {
			createTimezone(name: $name, city: $city, country: $country) {
				id
				name
				city
				timezone
				offset
			}
		}
	`;

	const createTimezoneMutation = mutation<{ createTimezone: Timezone }>(CREATE_TIMEZONE);

	async function createTimezone () {
		try {
			showAddModal = false;
			await createTimezoneMutation({
				variables: { name, city, country: country || undefined },
				update: (cache, { data }) => {
					cache.modify({
						fields: {
							getTimezones(existingTimezones = []) {
								const newTimezoneRef = cache.writeFragment({
									data: data?.createTimezone,
									fragment: gql`
										fragment NewTimezone on Timezone {
											id
											name
											city
											timezone
											offset
										}
									`
								});
								return [...existingTimezones, newTimezoneRef];
							}
						}
					})
				}
			})
			name = '';
			city = '';
			country = '';
			alert('Timezone created');
		} catch (err) {
			name = '';
			city = '';
			country = '';
			alert(err instanceof Error ? err.message : 'Something went wrong');
		}
	}
</script>

<div>
	<div on:click|preventDefault={logout} class='btn btn-error w-full'>Logout</div>
	{#if $timezones.loading}
		<div>Loading</div>
	{:else if $timezones.error}
		<div>Error</div>
	{:else if $timezones.data}
		<div class='flex flex-col'>
			{#each $timezones.data.getTimezones as timezone}
				<div class='flex flex-col'>
					<div>{timezone.name}</div>
					<div>{timezone.city}</div>
					<div>{timezone.timezone}</div>
				</div>
			{/each}
			<!-- {#if $timezones.data.getTimezones.length < 5} -->
				<div class='btn btn-success' on:click='{() => showAddModal = true}'>Add</div>
				<div class='modal {showAddModal ? 'modal-open' : ''}'>
					<div class='modal-box'>
						<div class='p-10 card bg-base-200'>
							<div class='form-control'>
								<label for='name' class='label'>
									<span class='label-text'>Name</span>
								</label>
								<input class='input' type='text' bind:value={name} />
								<label for='city' class='label'>
									<span class='label-text'>City</span>
								</label>
								<input class='input' type='text' bind:value={city} />
								<label for='country' class='label'>
									<span class='label-text'>Country</span>
								</label>
								<input class='input' type='text' bind:value={country} />
								<div on:click|preventDefault={createTimezone} class='btn btn-primary mt-4'>Create</div>
								<div on:click='{() => showAddModal = false}' class='btn btn-error mt-4'>Cancel</div>
							</div>
						</div>
					</div>
				</div>
			<!-- {/if} -->
		</div>
	{/if}
</div>
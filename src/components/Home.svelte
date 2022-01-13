<script lang='ts'>
	import { User } from '../stores';
	import { ApolloClient, InMemoryCache, HttpLink, MutationUpdaterFunction, Reference } from '@apollo/client';
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
	let showEditModal = false;

	let editData = {
		id: 0,
		name: '',
		city: '',
	};

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

	const UPDATE_TIMEZONE = gql`
		mutation ($id: Int!, $data: UpdateTimezoneData!) {
			updateTimezone(id: $id, data: $data) {
				id
				name
				city
				timezone
				offset
			}
		}
	`;

	const updateTimezoneMutation = mutation<{ updateTimezone: Timezone }>(UPDATE_TIMEZONE);

	async function updateTimezone () {
		try {
			await updateTimezoneMutation({
				variables: { id: editData.id, data: { name: editData.name, city: editData.city} },
				update: (cache, { data }) => {
					cache.modify({
						fields: {
							getTimezones(existingTimezones = [], { readField }) {
								return existingTimezones.map((timezone: Reference) => {
									if (readField('id', timezone) === data?.updateTimezone?.id) {
										return data?.updateTimezone;
									} else {
										return timezone;
									}
								})
							}
						}
					})
				}
			})
			closeEditModal();
			alert('Timezone updated');
		} catch (err) {
			closeEditModal();
			alert(err instanceof Error ? err.message : 'Something went wrong');
		}
	};

	const DELETE_TIMEZONE = gql`
		mutation ($id: Int!) {
			deleteTimezone(id: $id) {
				id
				name
				city
				timezone
				offset
			}
		}
	`;

	const deleteTimezoneMutation = mutation<{ deleteTimezone: Timezone }>(DELETE_TIMEZONE);

	const deleteTimezone = async (id: number) => {
		try {
			await deleteTimezoneMutation({
				variables: { id },
				update: (cache, { data }) => {
					cache.modify({
						fields: {
							getTimezones(existingTimezones = [], { readField }) {
								return existingTimezones.filter((timezone: Reference) => {
									return readField('id', timezone) !== data?.deleteTimezone?.id;
								})
							}
						}
					})
				}
			})
			alert('Timezone deleted');
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Something went wrong');
		}
	};

	const openEditModal = (timezone: Timezone) => {
		editData = {
			id: timezone.id,
			name: timezone.name,
			city: timezone.city
		}
		showEditModal = true;
	};

	const closeEditModal = () => {
		editData = {
			id: 0,
			name: '',
			city: ''
		}
		showEditModal = false;
	};
</script>

<div>
	<div on:click|preventDefault={logout} class='btn btn-error w-full'>Logout</div>
	{#if $timezones.loading}
		<div>Loading</div>
	{:else if $timezones.error}
		<div>Error</div>
	{:else if $timezones.data}
		<div class='flex flex-col space-y-1'>
			<div class='modal {showEditModal ? 'modal-open' : ''}'>
				<div class='modal-box'>
					<div class='p-10 card bg-base-200'>
						<div class='form-control'>
							<label for='name' class='label'>
								<span class='label-text'>Name</span>
							</label>
							<input class='input' type='text' bind:value={editData.name} />
							<label for='city' class='label'>
								<span class='label-text'>City</span>
							</label>
							<input class='input' type='text' bind:value={editData.city} />
							<div on:click|preventDefault={updateTimezone} class='btn btn-primary mt-4'>Update</div>
							<div on:click='{() => closeEditModal()}' class='btn btn-error mt-4'>Cancel</div>
						</div>
					</div>
				</div>
			</div>
			{#each $timezones.data.getTimezones as timezone}
				<div class='indicator w-full'>
					<div class='indicator-item btn btn-error btn-xs btn-circle no-animation' on:click={() => deleteTimezone(timezone.id)}>X</div>
					<div class='flex flex-col border rounded p-4 hover:opacity-30 cursor-pointer w-full' on:click={() => openEditModal(timezone)}>
						<div class='flex flex-row space-x-4'>
							<div class='font-bold'>Name:</div>
							<div class='uppercase'>{timezone.name}</div>
						</div>
						<div class='flex flex-row space-x-4'>
							<div class='font-bold'>City:</div>
							<div class='uppercase'>{timezone.city}</div>
						</div>
						<div class='flex flex-row space-x-4'>
							<div class='font-bold'>Timezone:</div>
							<div>{timezone.timezone}</div>
						</div>
					</div>
				</div>
			{/each}
			{#if $timezones.data.getTimezones.length < 5}
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
			{/if}
		</div>
	{/if}
</div>
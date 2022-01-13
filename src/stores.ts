import { writable } from 'svelte/store';

export interface UserStore {
	auth: boolean;
	data: UserData;
}

interface UserData {
	id?: number;
	email?: string;
	role?: string;
}

interface LoginRespose {
	message: string;
	token: string;
	user: UserData;
}

const createUserStore = () => {
	const { subscribe, set } = writable({ auth: false, data: {} });

	return {
		subscribe,
		init: async () => {
			const token = localStorage.getItem('token');
			if (token) {
				const res = await fetch(
					`API_URL/validate-token?token=${token}`
				);

				if (!res.ok) {
					localStorage.removeItem('token');
					return;
				}

				const data = (await res.json()) as UserData;
				set({ auth: true, data });
			}
		},
		login: async (email: string, password: string) => {
			const res = await fetch('API_URL/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					password
				})
			});

			const data = (await res.json()) as LoginRespose;

			if (!res.ok) {
				throw new Error(data.message);
			}

			set({ auth: true, data: data.user });
			localStorage.setItem('token', data.token);
		}
	};
};

export const User = createUserStore();

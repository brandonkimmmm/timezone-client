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
		set: (auth: boolean, data: UserData) => {
			set({ auth, data });
		}
	};
};

export const User = createUserStore();

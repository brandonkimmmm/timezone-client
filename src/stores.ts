import { writable, Writable } from 'svelte/store';

export interface User {
	auth: boolean;
	data: UserData;
}

interface UserData {
	id?: number;
	email?: string;
	role?: string;
}

export const GlobalUser: Writable<User> = writable({ auth: false, data: {} });

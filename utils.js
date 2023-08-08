import { onDestroy } from 'svelte';

export function onInterval(callback, milliseconds) {
	const interval = setTimeout(callback, milliseconds);

	onDestroy(() => {
		clearInterval(interval);
	});
}
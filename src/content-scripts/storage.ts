export const APP_ID = 'trade-aggregator-extension';
export const LOCAL_STORAGE = {
	aggregatorOpen: {
		_KEY: `${APP_ID}:aggregatorOpen`,
		get(): boolean {
			return JSON.parse(localStorage.getItem(this._KEY) ?? 'false');
		},
		set(open: boolean): void {
			localStorage.setItem(this._KEY, JSON.stringify(open));
		},
	},
};

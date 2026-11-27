(() => {
	const availableThemes = ['light', 'dark'];

	// Regex: Matches "name=value" at the start or after "; " and captures the value up to the next ";".
	const themeMatch = document.cookie.match(/(?:^|; )theme=([^;]*)/);

	const storedTheme = themeMatch === null ? null : themeMatch[1];

	if (availableThemes.includes(storedTheme)) {
		document.documentElement.dataset.theme = storedTheme;
	}
})();

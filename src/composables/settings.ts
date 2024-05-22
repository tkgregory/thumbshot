export function loadSettings() {
    try {
        const localStorageSettings = localStorage.getItem('settings') as string
        if (localStorageSettings) {
            return JSON.parse(localStorageSettings);
        }
        return {
            showNumbers: true
        }
    } catch (e) {
        console.error('Failed to load settings from local storage', e)
        throw e
    }
}

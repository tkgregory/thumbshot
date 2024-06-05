import { fetchAuthSession } from 'aws-amplify/auth';

export async function fetchPreview(previewData: any, settings: any) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/preview`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            previewData: previewData,
            settings: settings
        })
    })
    if (response.status !== 200) {
        throw new Error(`Invalid response with status ${response.status}`)
    }
    return await response.json()
}

export async function fetchPathWithAuth(method: string, path: string, body?: any) {
    return fetchAuthSession().then((session) => {
        const token = session.tokens?.idToken?.toString()
        if (!token) {
            return Promise.reject('No token found')
        }

        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set("Authorization", token)
        if (body) {
            requestHeaders.set("Content-Type", "application/json")
        }

        return fetch(`${import.meta.env.VITE_API_URL}${path}`, {
            method: method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined
        })
    })
}
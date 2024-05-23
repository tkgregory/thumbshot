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
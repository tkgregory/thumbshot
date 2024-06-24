import { fetchPathWithAuth } from '../composables/api'

export function parseVideoId(youTubeVideoURL: string) {
    const url = new URL(youTubeVideoURL)
    if (url.hostname === 'www.youtube.com') {
        const videoParameter = url.searchParams.get('v')
        if (videoParameter === null) {
            throw Error('Invalid YouTube video URL')
        }
        return videoParameter
    } else if (url.hostname === 'youtu.be') {
        if (url.pathname === '/') {
            throw Error('Invalid YouTube video URL')
        }
        return url.pathname.substring(1)
    }
    throw Error('Invalid YouTube video URL')
}

export async function getVideoData(youTubeVideoURL: any) {
    let videoId
    try {
        videoId = parseVideoId(youTubeVideoURL)
    } catch (error: any) {
        throw Error(error.message)
    }

    return await fetchPathWithAuth('GET', `/youtube/videos/${videoId}`).then((response) => {
        if (response.status !== 200) {
            console.log(`Invalid response with status ${response.status}`)
            throw Error(`Video id ${videoId} not found`)
        }
        return response.json()
    })
}
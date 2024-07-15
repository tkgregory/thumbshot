'use strict'

export const handler = async (event) => {
    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=24&videoDuration=long&key=${process.env.YOUTUBE_API_KEY}`)
    const body = await response.json()

    return {
        statusCode: 200,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    }
}
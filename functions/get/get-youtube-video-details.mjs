'use strict'

export const handler = async (event) => {
    const videoId = event.pathParameters.id

    if (!videoId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing path parameter 'id'" }),
            headers: {
                "content-type": "application/json"
            }
        }
    }

    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`)
    const body = await response.json()

    if (body.items.length === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Video not found" }),
            headers: {
                "content-type": "application/json"
            }
        }
    }

    return {
        statusCode: 200,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            title: body.items[0].snippet.title,
            channelName: body.items[0].snippet.channelTitle,
            imageURL: body.items[0].snippet.thumbnails.maxres.url
        })
    }
}
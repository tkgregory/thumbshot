import type { YouTubePreviewData } from '../types/YouTubePreviewData.type'

export function getImageSrc(youtubePreview: YouTubePreviewData) {
    const thumbnailURL = import.meta.env.VITE_THUMBNAIL_URL

    if (youtubePreview.s3ObjectKey !== undefined) {
        return `${thumbnailURL}/${youtubePreview.s3ObjectKey}`
    } else if (youtubePreview.imageURL !== undefined) {
        return youtubePreview.imageURL
    }

    throw Error("No image to return")
}
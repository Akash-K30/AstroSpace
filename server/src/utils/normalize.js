export const normalizeSpaceflight = (article) => ({

    title: article.title,

    summary: article.summary,

    image: article.image_url,

    url: article.url,

    source: "Spaceflight",

    publishedAt: article.published_at

});

export const normalizeApod = (apod) => ({

    title: apod.title,

    summary: apod.explanation,

    image: apod.url,

    url: apod.hdurl || apod.url,

    source: "NASA",

    publishedAt: apod.date

});
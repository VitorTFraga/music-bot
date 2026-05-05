const play = require('play-dl')
const { YoutubeVideo } = require('/YoutubeVideo.js');

async function search(url) {

    const video = await play.search(url,{
        limit: 1,
        source: {youtube: 'video'}
    })
    if (!video || video.length === 0) return null;
    return new YoutubeVideo(video[0])
}

module.exports ={search}
const {createAudioPlayer, NoSubscriberBehavior} = require('@discordjs/voice');
const {search} = require('./utils/videoSeach.js');
//const {audioConverter} = require('./utils/audioExtractor.js');


 const player = createAudioPlayer({

    behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
 });

 async function playMusic(query) {
	
	try {
		
		const music = await search(query);

		if (!music) {
			console.log('music not found');
			return null;
		}

		//const resource = audioConverter(music.query);

		return music;

	} catch (err) {
		console.error('player maneger error', err);
		
	}
}


module.exports = {player, playMusic};
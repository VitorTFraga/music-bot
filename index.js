const {Client, GatewayIntentBits,Collection, } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const ffmpegStatic = require('ffmpeg-static');

const {setUpPlayerEvents} = require('./events/playerEvents');

dotenv.config();
const {TOKEN} = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

const player = new Player(client, {

	connectionTimeout: 60000,
	ffmpegPath: ffmpegStatic || undefined
});

async function setUpExtractors(){

	try {
		
		await player.extractors.loadMulti(DefaultExtractors);
	} catch (err) {
		console.error(`erro ao carregar extratores: ${err}`);
		
	}
}

process.on('unhandledRejection', (reason)=>{
	const isAbort = 
		reason?.name === 'AbortError' || 
        reason?.code === 'ABORT_ERR' || 
        reason?.cause?.name === 'AbortError';

	if(isAbort){

		console.warn('[Voice] Operação abortada (timeout ou desconexão):', reason.message);
		return;
	}

	console.error('[Unhandled Rejection]', reason);
});


async function bootStrap(){

	setUpPlayerEvents(player);
	await setUpExtractors();

	client.commands = new Collection();

	const foldersPath = path.join(__dirname, 'commands');
	const commandFolder = fs.readdirSync(foldersPath);

	for(const folder of commandFolder){

		const commandPath = path.join(foldersPath, folder);
		const commandFile = fs.readdirSync(commandPath).filter((file)=>file.endsWith('js'));

		for(const file of commandFile){
			const filePath = path.join(commandPath, file);
			const command = require(filePath);
			if('data'in command && 'execute'in command){

				client.commands.set(command.data.name, command);
			} else{
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
				
			}
		}	
	}

	const eventPath = path.join(__dirname, 'events');
	const eventFile = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

	for(const file of eventFile){

		const filePath = path.join(eventPath, file);
		const event = require(filePath);

		if(event.once){

			client.once(event.name, (...args)=> event.execute(...args));
		}else{

			client.on(event.name, (...args)=> event.execute(...args));
		}
	}

	await client.login(TOKEN);
}

bootStrap();
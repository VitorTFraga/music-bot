const {SlashCommandBuilder} = require('discord.js');
const { useMainPlayer } = require('@discord-player');


const player = useMainPlayer()
module.exports={

	data: new SlashCommandBuilder()
		.setName('toca')
		.setDescription('comando responsável por tocar musica')
		.addStringOption((option) =>

			option
				.setName('musica')
				.setDescription('nome da musica')
				.setRequired(true),
		),
		
	async execute(interaction){

		const player = interaction.voice.player;
		const voiceChannel = interaction.member.voice.channel;
		try {

			await player.play(voiceChannel, query);
		} catch (err) {
			console.error(`aconteceu algo erro com o play: ${err}`);
			
		}
	}
}
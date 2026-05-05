const {SlashCommandBuilder} = require('discord.js');
const { getVoiceConnection, createAudioPlayer } = require('@discordjs/voice');
const play = require('play-dl');
const YoutubeVideo = require('../../utils/YouTubeVideo').default;
const {createAudioResource} = require('@discordjs/voice')

const link = YoutubeVideo;
const player = createAudioPlayer();

module.exports={

	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('toca a musica do usuario'),
    
	async execute(interaction){

        const connection = getVoiceConnection(interaction.guild.id)
        if (!connection) {
			return interaction.reply("A conexão não rolo! Use '/brota' primeiro.");
		};
		connection.subscribe(player);

        await interaction.reply("tocando musica");
	    }
}
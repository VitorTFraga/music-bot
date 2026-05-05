const {SlashCommandBuilder} = require('discord.js')
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');


module.exports={

    data: new SlashCommandBuilder()
		.setName('brota')
		.setDescription('comando responsável por entrar no canal.'),
		
	async execute(interaction){

		const voiceChannel = interaction.member.voice.channel;//guarda quem fez o comando

        if (!voiceChannel) {
            return interaction.reply({ 
                content: 'Você precisa estar em um canal de voz para eu entrar!', 
                ephemeral: true 
            });
        }

        try {
            const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
            connection.on(VoiceConnectionStatus.Ready, () => {
	            console.log('Connection is in the Ready state!');
            })
            await interaction.reply(`entrando no chat ${voiceChannel}`);
        } catch (err) {

            console.error(err);
            await interaction.reply('Houve um erro ao tentar entrar no canal de voz.');
        }
	}
}

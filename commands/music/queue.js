const {SlashCommandBuilder, MessageFlags} = require('discord.js')
const {useQueue} = require('discord-player')

module.exports = {

    data: new SlashCommandBuilder()
        .setName('fila')
        .setDescription('mostra a fila de músicas.'),

    async execute(interaction){

        const voiceChannel = interaction.member.voice.channel;
        const botConnection = interaction.guild.members.me.voice.channel;
        const queue = useQueue(interaction.guild)

        if (!botConnection) {
            return interaction.reply({
                content: "Eu não estou em nenhum canal de voz no momento.", 
                flags: [MessageFlags.Ephemeral]    
            });
        }
        if (botConnection !== voiceChannel) {

            return interaction.reply({
                content: "voce não tem permissão para listar as músicas.",
                flags: [MessageFlags.Ephemeral]
            })
        }
        if (!queue) {

            return interaction.reply('Este servidor não possui uma sessão de música ativa.')
        }

        try {
            
            const currentTrack = queue.currentTrack;
            const upcomingTracks = queue.tracks.toArray().slice(0, 5);
            const currentTrackInfo =currentTrack 
                ? `**TOCANDO AGORA:**\n${currentTrack.title} - ${currentTrack.author}`:"**Nenhuma música tocando no momento.**";

            const message = [
                currentTrackInfo,
                ``,
                `**PRÓXIMAS MÚSICAS:**`,
                ...upcomingTracks.map((track, index)=>
                    `${index+1}. ${track.title} - ${track.author}`,
                ),
            ].join('\n')

            await interaction.reply(message)
        } catch (err) {

            console.error('algo deu errado com a fila de musica: ', err)
            return interaction.reply('algo deu errado com a fila de musica')
        }
    }
}
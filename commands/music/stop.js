const {SlashCommandBuilder, MessageFlags} = require('discord.js')
const { useQueue } = require('discord-player')

module.exports = {

    data: new SlashCommandBuilder()
        .setName('parar')
        .setDescription('para o reprodutor de musica'),

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
                content: "voce não tem permissão para parar as músicas.",
                flags: [MessageFlags.Ephemeral]
            })
        }
        if (!queue) {

            return interaction.reply('Este servidor não possui uma sessão de música ativa.')
        }

        try {
            
            queue.delete()

            await interaction.reply('playlist parada!');
        } catch (err) {
            console.error('erro ao parar o reprodutor de musica: ', err)
            return interaction.reply('erro ao parar o reprodutor de musica')
        }
    }
}
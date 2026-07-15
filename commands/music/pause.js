const {SlashCommandBuilder} = require('discord.js')
const {useTimeline} = require('discord-player')

module.exports={

    data: new SlashCommandBuilder()
        .setName('pausar')
        .setDescription('pausa a música.'),

    async execute(interaction){

        const voiceChannel = interaction.member.voice.channel;
        const botConnection = interaction.guild.members.me.voice.channel;
        const timeLine = useTimeline({

            node: interaction.guild,
        })
        

        if (!botConnection) {
            return interaction.reply({
                content: "Eu não estou em nenhum canal de voz no momento.", 
                flags: [MessageFlags.Ephemeral]    
            });
        }
        if (botConnection !== voiceChannel) {

            return interaction.reply({
                content: "voce não tem permissão para trocar de música.",
                flags: [MessageFlags.Ephemeral]
            })
        }

        if(!timeLine){

            return interaction.reply('Este servidor não possui uma sessão de áudio ativa.')
        }

        const wasPaused = timeLine.paused

        try {

            wasPaused ? timeLine.resume() : timeLine.pause();
            
            await interaction.reply(`A música está agora ${wasPaused ? 'tocando' : 'pausada'}.`);

        } catch (err) {

            console.error('erro ao trocar estado da muscia: ', err)
            await interaction.reply('Ocorreu um erro ao tentar pausar/retomar a música.');
        }

    }
}
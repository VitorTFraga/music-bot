const {SlashCommandBuilder} = require('discord.js')
const {useTimeline} = require('discord-player')

module.exports={

    data: new SlashCommandBuilder()
        .setName('pausar')
        .setDescription('pausa a música.'),

    async execute(interaction){

        const timeLine = useTimeline({

            node: interaction.guild,
        })

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
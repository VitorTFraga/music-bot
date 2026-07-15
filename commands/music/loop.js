const { useQueue, QueueRepeatMode } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

const label = {

    'Off': 'desliga',
    'Track':'musica',
    'Queue': 'fila',
    'Autoplay': 'aleatorio'
}

module.exports = {

    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('coloca a fila ou a musica em loop')
        .addNumberOption((option) =>
            option
                .setName('modo')
                .setDescription('o tipo de loop') 
                .setRequired(true) 
                .addChoices(
                    {
                        name: label.Off,
                        value: QueueRepeatMode.OFF,
                    },
                    {
                        name: label.Track,
                        value: QueueRepeatMode.TRACK,
                    },
                    {
                        name: label.Queue,
                        value: QueueRepeatMode.QUEUE,
                    },
                    {
                        name: label.Autoplay,
                        value: QueueRepeatMode.AUTOPLAY,
                    },
            )),

    async execute(interaction){

       const voiceChannel = interaction.member.voice.channel;
        const botConnection = interaction.guild.members.me.voice.channel;
        const queue = useQueue(interaction.guild)
        const loopMode = interaction.options.getNumber('modo')

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

        if (!queue) {

            return interaction.reply('Este servidor não possui uma sessão de música ativa.')
        }

        const textMode = {

            [QueueRepeatMode.OFF]: 'desligado',
            [QueueRepeatMode.TRACK]: 'música',
            [QueueRepeatMode.QUEUE]: 'fila',
            [QueueRepeatMode.AUTOPLAY]: 'aleatório',
        }

        try {
            
            queue.setRepeatMode(loopMode);

            await interaction.reply(`modo de loop trocado para ${textMode[loopMode]}`);
        } catch (err) {
            console.error('erro ao usar o comando de loop: ', err);
            return interaction.reply('erro ao usar o comando de loop.')
        }
    }
}
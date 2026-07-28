const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const { useQueue} = require('discord-player');

module.exports={

    data: new SlashCommandBuilder()
        .setName('proxima')
        .setDescription('pula a música atual.'),

    async execute(interaction){

        const voiceChannel = interaction.member.voice.channel;
        const botConnection = interaction.guild.members.me.voice.channel;
        const queue = useQueue(interaction.guild);

        if (!botConnection) {
            return interaction.reply({
                content: 'Eu não estou em nenhum canal de voz no momento.', 
                flags: [MessageFlags.Ephemeral]    
            });
        }
        if (botConnection !== voiceChannel) {

            return interaction.reply({
                content: 'voce não tem permissão para trocar de música.',
                flags: [MessageFlags.Ephemeral]
            });
        }
        if (!queue) {

            return interaction.reply('Este servidor não possui uma sessão de música ativa.');
        }

        if (!queue.isPlaying()) {
            
            return interaction.reply('Não existe música tocando no momento');
        }

        try {
            
            queue.node.skip();
            await interaction.reply('⏭️ A música foi pulada.');
        } catch (err) {

            console.error('erro ao tentar pular a música: ',err);
            return interaction.reply('erro ao tentar pular a música.');
        }
    }
};
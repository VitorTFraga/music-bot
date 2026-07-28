const {SlashCommandBuilder} = require('discord.js');
const {useQueue} = require('discord-player');

module.exports={

    data: new SlashCommandBuilder()
        .setName('tocando')
        .setDescription('musica tocando agora'),

    async execute(interaction){

        const queue = useQueue(interaction.guild);
        const currenteSong = queue.currentTrack;

        if(!queue){

            return interaction.reply('Este servidor não possui uma sessão de música ativa.');
        }

        if(!currenteSong){

            return interaction.reply('Não tem música tocando no momento.');
        }
        console.log(currenteSong.title);
        return interaction.reply(`Esta tocando agora: ${currenteSong.title}`);
    }
};
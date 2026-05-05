const {SlashCommandBuilder} = require('discord.js')

module.exports={
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('provides information about the user.'),
    
    async execute(interaction){
        await interaction.reply(
            `o comando foi feito pelo ${interaction.user.username}, que entrou no ${interaction.member.joinedAt}`
        )
    }
}
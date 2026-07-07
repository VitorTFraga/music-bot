const {SlashCommandBuilder} = require('discord.js')
const {useMainPlayer} = require('discord-player')

const VOICE_NODE_OPTIONS ={

	connectionTimeout: 60_000,
	bufferingTimeout: 30_000,
}

module.exports={

	data: new SlashCommandBuilder()
		.setName('brota')
		.setDescription('Entra no server'),
		
	async execute(interaction){

        const player = useMainPlayer()
        const voiceChannel = interaction.member.voice.channel;

        
        if(!voiceChannel){

            return interaction.reply({
				content: 'Você precisa estar em um canal de voz para eu entrar!',
				ephemeral: true,
			});
        }

		await interaction.deferReply()
		try {
			let queue = player.nodes.get(interaction.guild)

			if(!queue){

				queue = player.nodes.create(interaction.guild, {

					...VOICE_NODE_OPTIONS,
					metadata: interaction.channel,
				})
			}
			
			await queue.connect(voiceChannel,{
				queue,
				maxTime: VOICE_NODE_OPTIONS.connectionTimeout,
			})

			return interaction.editReply(`Entrei no canal **${voiceChannel.name}**.`);
		} catch (err) {

			console.error("erro ao tentar entrar no canal: ", err);
			return interaction.editReply('Não consegui conectar a tempo. Tente novamente. Houve um erro ao tentar entrar no canal de voz.');
		}
	}
}
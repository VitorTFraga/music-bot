const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const {useMainPlayer} = require('discord-player');

module.exports={

	data: new SlashCommandBuilder()
		.setName('toca')
		.setDescription('comando responsável por tocar musica')
		.addStringOption((option) =>

			option
				.setName('musica')
				.setDescription('nome da musica')
				.setRequired(true),
		),
		
	async execute(interaction){

		const player = useMainPlayer();
		const voiceChannel = interaction.member.voice.channel;
		const query = interaction.options.getString('musica', true);

		if(!voiceChannel) {
			return interaction.reply(
				'você precisa estar em um canal de voz.',
			);
		}

		 if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect,)) {
			return interaction.reply(
				'Eu não tenho permissão para acessar o seu canal de voz.',
			);
		}



		if (
			!interaction.guild.members.me
			.permissionsIn(voiceChannel)
			.has(PermissionsBitField.Flags.Speak)
		) {
			return interaction.reply(
			'I do not have permission to speak in your voice channel!',
			);
		}

		await interaction.deferReply()

		try {

			const result = await player.play(voiceChannel, query, {

				nodeOptions: {
        			metadata: { channel: interaction.channel }, 
				},
			});

			return interaction.editReply(

				`${result.track.title} foi adicionada a playlist.`
			)
		} catch (err) {
			console.error(`aconteceu algo erro com o play: ${err}`);
			return interaction.reply("Deu algo de errado com a musica chama os dev!")
			
		}
	}
}
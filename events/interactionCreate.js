const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		const player = interaction.client.player;
		const context = { guild: interaction.guild };

		try {
			await player.context.provide(context, () => command.execute(interaction));
		} catch (err) {
			console.error(err);

			const errorPayload = {
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			};

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(errorPayload);
			} else {
				await interaction.reply(errorPayload);
			}
		}
	},
};

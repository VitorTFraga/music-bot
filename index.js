const {Client, Events, GatewayIntentBits,Collection, } = require('discord.js')
const fs = require('fs')
const path = require('path')

const dotenv = require('dotenv')

dotenv.config()
const {TOKEN, CLIENT_ID, GUILD_ID} = process.env

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection()

const foldersPath = path.join(__dirname, 'commands');
const commandFolder = fs.readdirSync(foldersPath)

for(const folder of commandFolder){

	const commandPath = path.join(foldersPath, folder)
	const commandFile = fs.readdirSync(commandPath).filter((file)=>file.endsWith('js'))

	for(const file of commandFile){
		const filePath = path.join(commandPath, file)
		const command = require(filePath)
		if('data'in command && 'execute'in command){
		client.commands.set(command.data.name, command)
	} else{
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		
	}
	}	
}

client.login(TOKEN);

client.on(Events.InteractionCreate, async (interaction) =>{

	if(!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if(!command){
		console.error(`No command matching ${interaction.commandName} was found.`);
		return
	}

	try {
		await command.execute(interaction);
	} catch (err) {
		if(interaction.replied || interaction.deferred){
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}else{
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			})
		}
	}
	
})
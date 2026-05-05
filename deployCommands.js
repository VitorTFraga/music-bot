const {REST, Routes} = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const{TOKEN, CLIENT_ID, GUILD_ID} = process.env;

const fs = require('fs')
const path = require('node:path');

const commands = []

const folderPath = path.join(__dirname, 'commands')
const commandFolder = fs.readdirSync(folderPath);

for(const folder of commandFolder){

    const commandPath = path.join(folderPath, folder);
    const commandFile = fs.readdirSync(commandPath).filter((file =>file.endsWith('.js')))

    for(const file of commandFile){

        const filePath = path.join(commandPath, file);
        const command = require(filePath);

        if('data' in command && 'execute' in command){
            commands.push(command.data.toJSON())
        }else{
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            
        }
    }
}

const rest = new REST().setToken(TOKEN);

(async() =>{
    try{
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        
        const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }catch(err){
        console.log(err);
        
    }
})();
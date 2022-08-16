module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if (!interaction.isCommand() && !interaction.isMessageContextMenu()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;
		// test
		try {
			command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: '**При запуске команды произошла ошибка!**', ephemeral: true });
		}

		if (command.permission) {
			const authorPerms = interaction.channel.permissionsFor(interaction.member);
			if (!authorPerms || !authorPerms.has(command.permission)) {
        		interaction.reply({content: '**У вас недостаточно прав**', ephemeral: true }).catch(error => {console.log(error)});
			}
		}
	},
};
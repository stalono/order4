const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Статус бота'),
	async execute(interaction) {
		const pingEmbed = new MessageEmbed()
			.setTitle(`${interaction.client.ws.ping} ms`)
			.setColor('GREEN')
		await interaction.reply({ embeds: [pingEmbed], ephemeral: true }).catch(error => {console.log(error)});
	},
};
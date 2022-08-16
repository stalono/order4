const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getModer, isModer } = require('../mongoose.js');
const { errorEmbed } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('moder')
		.setDescription('Информация о модераторе')
        .addUserOption(option =>
            option.setName('модератор')
                .setDescription('Модератора о котором вы хотите получить информацию')
                .setRequired(false))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
		const user = interaction.options.getUser('модератор') || interaction.user;
        const userData = await getModer(user.id);
        const embed = userData ? new MessageEmbed()
            .setTitle(`Информация`)
            .setDescription(`**Модератор: ${user}**\n**- Мутов: ${userData.mutes}**\n**- Киков: ${userData.kicks}**\n**- Варнов: ${userData.warns}**\n**- Банов: ${userData.bans}**`)
            .setColor('DARK_GREEN')
            .setTimestamp()
            .setFooter({ text: 'Инфо | Мод' }) : new errorEmbed('Данный пользователь не является модератором');
        await interaction.reply({ embeds: [embed] }).catch(error => interaction.reply(errorEmbed(error)));
	},
};
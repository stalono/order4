const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getUser } = require('../mongoose.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Информация о пользователе')
        .addUserOption(option =>
            option.setName('пользователь')
                .setDescription('Пользователь о котором вы хотите получить информацию')
                .setRequired(false))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
		const user = interaction.options.getUser('пользователь') || interaction.user;
        const userData = await getUser(user.id);
        const embed = new MessageEmbed()
            .setTitle(`Информация`)
            .setDescription(`**Пользователь: ${user}**\n**- Мутов: ${userData.mutes}**\n**- Киков: ${userData.kicks}**\n**- Варнов: ${userData.warns}**\n**- Банов: ${userData.bans}**`)
            .setColor('DARK_GREEN')
            .setTimestamp()
            .setFooter({ text: 'Инфо | Мод' });
        await interaction.reply({ embeds: [embed] }).catch(error => interaction.reply(errorEmbed(error)));
	},
};
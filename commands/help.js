const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Информация по использованию бота'),
	async execute(interaction) {
		const embed = new MessageEmbed()
            .setTitle('Информация по использованию бота')
            .setDescription('**/ban - Заблокировать пользователя\n/kick - Кикнуть пользователя\n/mute - Замутить пользователя\n/warn - Предупредить пользователя\n/unban - Разблокировать пользователя\n/unmute - Размутить пользователя\n/unwarn - Снять предупреждение с пользователя\n/moder - Информация о модераторе\n/info - Информаиция о пользователе**')
            .setColor('DARK_GREEN')
            .setTimestamp()
            .setFooter({ text: 'Инфо | Мод' });
        await interaction.reply({ embeds: [embed] }).catch(error => interaction.reply(errorEmbed(error)));
	},
};
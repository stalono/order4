const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { errorEmbed, sendDM } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Разбанить пользователя')
        .addUserOption(option => 
            option.setName('пользователь')
                .setDescription('Пользователь которого вы желаете разбанить')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('причина')
                .setDescription('Причина блокировки')
                .setRequired(true))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
        const { banRoleName, modersChannelName } = require('../json/config.json');
		const user = interaction.options.getUser('пользователь');
        const reason = interaction.options.getString('причина');
        const bannedRole = interaction.guild.roles.cache.find(role => role.name === banRoleName);
        const modChannel = interaction.guild.channels.cache.find(channel => channel.name === modersChannelName);
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) return interaction.reply(errorEmbed('Пользователь не найден'));
        if (!bannedRole) return await interaction.reply(errorEmbed(`Роль с именем ${banRoleName} не найдена`));
        if (!modChannel) return await interaction.reply(errorEmbed(`Канал с именем ${modersChannelName} не найден`));
        if (!member.roles.cache.has(bannedRole.id)) return interaction.reply(errorEmbed('Пользователь не забанен'));


        const unBanEmbed = new MessageEmbed()
            .setTitle('Пользователь был успешно разбанен!')
            .setColor('DARK_GOLD')

        const modUnBanEmbed = new MessageEmbed()
            .setTitle(`Разблокировка пользователя ${member.name || user.username}`)
            .setDescription(`- Пользователь: ${user}\n- Модератор: ${interaction.user}\n- Причина: ${reason}`)
            .setColor('DARK_GOLD')
            .setTimestamp()
            .setFooter({ text: 'Разблокировка | Мод' });

        try {
            await member.roles.remove(bannedRole);
            await modChannel.send({embeds: [modUnBanEmbed]})
            await interaction.reply({embeds: [unBanEmbed], ephemeral: true})
        } catch(error) {
            await interaction.reply(errorEmbed(error));
            return;
        }
	},
};
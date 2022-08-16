const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { updateUser, updateModer, getUser, getModer } = require('../mongoose.js');
const { errorEmbed, sendDM } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Забанить пользователя')
        .addUserOption(option => 
            option.setName('пользователь')
                .setDescription('Пользователь которого вы желаете забанить')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('время-часов')
                .setDescription('Количество часов на которые пользователь будет забанен')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('причина')
                .setDescription('Причина блокировки')
                .setRequired(true))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
        const { banRoleName, modersChannelName } = require('../json/config.json');
		const user = interaction.options.getUser('пользователь');
        const days = interaction.options.getInteger('время-часов');
        const reason = interaction.options.getString('причина');
        const userData = await getUser(user.id);
        const moderData = await getModer(interaction.user.id);
        const bannedRole = interaction.guild.roles.cache.find(role => role.name === banRoleName);
        const modChannel = interaction.guild.channels.cache.find(channel => channel.name === modersChannelName);
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) return interaction.reply(errorEmbed('Пользователь не найден'));
        if (!bannedRole) return await interaction.reply(errorEmbed(`Роль с именем ${banRoleName} не найдена`));
        if (!modChannel) return await interaction.reply(errorEmbed(`Канал с именем ${modersChannelName} не найден`));
        if (member.roles.cache.has(bannedRole.id)) return interaction.reply(errorEmbed('Пользователь уже забанен'));

        const banEmbed = new MessageEmbed()
            .setTitle('Пользователь был успешно забанен!')
            .setColor('DARK_RED')

        const modBanEmbed = new MessageEmbed()
            .setTitle(`Блокировка пользователя ${member.name || user.username}`)
            .setDescription(`- Пользователь: ${user}\n- Модератор: ${interaction.user}\n- Причина: ${reason}\n- Часов: ${days}`)
            .setColor('BLACK')
            .setTimestamp()
            .setFooter({ text: 'Блокировка | Мод' });

        const modUnBanEmbed = new MessageEmbed()
            .setTitle(`Разблокировка пользователя ${member.name || user.username}`)
            .setDescription(`- Пользователь: ${user}\n- Модератор: Система\n- Причина: Истек срок бана\n- Часов: ${days}`)
            .setColor('BLACK')
            .setTimestamp()
            .setFooter({ text: 'Разблокировка | Мод' });

        try {
            await member.roles.add(bannedRole);
            await modChannel.send({embeds: [modBanEmbed]});
            await interaction.reply({ embeds: [banEmbed], ephemeral: true }).catch(error => {console.log(error)});
        } catch(error) {
            await interaction.reply(errorEmbed(error));
            return;
        }
        await updateUser(userData.id, { bans: userData.bans + 1 });
        await updateModer(moderData.id, { bans: moderData.bans + 1 });
        const timeoutTime = days * 60 * 60 * 1000 < 2147483647 ? days * 60 * 60 * 1000 : 2147483647;
        setTimeout(async () => {
            try {
                await member.roles.remove(bannedRole);
                await modChannel.send({embeds: [modUnBanEmbed]});
            } catch(error) { }
        } , timeoutTime);
	},
};
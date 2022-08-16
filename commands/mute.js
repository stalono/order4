const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { updateUser, updateModer, getUser, getModer } = require('../mongoose.js');
const { errorEmbed, sendDM } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Замутить пользователя')
        .addUserOption(option => 
            option.setName('пользователь')
                .setDescription('Пользователь которого вы желаете замутить')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('время-минуты')
                .setDescription('Количество минут на которые пользователь будет замучен')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('причина')
                .setDescription('Причина мута')
                .setRequired(true))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
        const { muteRoleName, modersChannelName } = require('../json/config.json');
		const user = interaction.options.getUser('пользователь');
        const days = interaction.options.getInteger('время-минуты');
        const reason = interaction.options.getString('причина');
        const userData = await getUser(user.id);
        const moderData = await getModer(interaction.user.id);
        const muttedRole = interaction.guild.roles.cache.find(role => role.name === muteRoleName);
        const modChannel = interaction.guild.channels.cache.find(channel => channel.name === modersChannelName);
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) return interaction.reply(errorEmbed('Пользователь не найден'));
        if (!muttedRole) return await interaction.reply(errorEmbed(`Роль с именем ${muteRoleName} не найдена`));
        if (!modChannel) return await interaction.reply(errorEmbed(`Канал с именем ${modersChannelName} не найден`));
        if (member.roles.cache.has(muttedRole.id)) return interaction.reply(errorEmbed('Пользователь уже замучен'));

        const muteEmbed = new MessageEmbed()
            .setTitle('Пользователь был успешно замучен!')
            .setColor('DARK_GREEN')

        const modMuteEmbed = new MessageEmbed()
            .setTitle(`Заглушка пользователя ${member.name || user.username}`)
            .setDescription(`- Пользователь: ${user}\n- Модератор: ${interaction.user}\n- Причина: ${reason}\n- Время: ${days} минут`)
            .setColor('DARK_GREEN')
            .setTimestamp()
            .setFooter({ text: 'Заглушка | Мод' });

        const modUnMuteEmbed = new MessageEmbed()
            .setTitle(`Снятие заглушки пользователя ${member.name || user.username}`)
            .setDescription(`- Пользователь: ${user}\n- Модератор: Система\n- Причина: Истек срок мута\n- Минут: ${days}`)
            .setColor('DARK_GOLD')
            .setTimestamp()
            .setFooter({ text: 'Заглушка | Мод' });

        try {
            await member.roles.add(muttedRole);
            await modChannel.send({embeds: [modMuteEmbed]});
            await interaction.reply({ embeds: [muteEmbed], ephemeral: true });
        } catch(error) {
            await interaction.reply(errorEmbed(error));
            return;
        }
        await updateUser(userData.id, { mutes: userData.mutes + 1 });
        await updateModer(moderData.id, { mutes: moderData.mutes + 1 });
        const timeoutTime = days * 60 * 1000 < 2147483647 ? days * 60 * 1000 : 2147483647;
        setTimeout(async () => {
            try {
                await member.roles.remove(muttedRole);
                await modChannel.send({embeds: [modUnMuteEmbed]});
            } catch(error) { }
        } , timeoutTime);
	},
};
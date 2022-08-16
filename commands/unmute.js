const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { updateUser, updateModer, getUser, getModer } = require('../mongoose.js');
const { errorEmbed } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Размутить пользователя')
        .addUserOption(option => 
            option.setName('пользователь')
                .setDescription('Пользователь которого вы желаете размутить')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('причина')
                .setDescription('Причина размута')
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
        if (!member.roles.cache.has(muttedRole.id)) return interaction.reply(errorEmbed('Пользователь не замучен'));

        const muteEmbed = new MessageEmbed()
            .setTitle('Пользователь был успешно размучен!')
            .setColor('DARK_GOLD')

        const modUnMuteEmbed = new MessageEmbed()
            .setTitle(`Снятие заглушки пользователя ${member.name || user.username}`)
            .setDescription(`- Пользователь: ${user}\n- Модератор: ${interaction.user}\n- Причина: ${reason}`)
            .setColor('DARK_GOLD')
            .setTimestamp()
            .setFooter({ text: 'Размут | Мод' });

        try {
            await member.roles.remove(muttedRole);
            await modChannel.send({embeds: [modUnMuteEmbed]});
            await interaction.reply({ embeds: [muteEmbed], ephemeral: true });
        } catch(error) {
            await interaction.reply(errorEmbed(error));
            return;
        }
	},
};
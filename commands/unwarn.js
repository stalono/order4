const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { updateUser, updateModer, getUser, getModer } = require('../mongoose.js');
const { errorEmbed, sendDM } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unwarn')
		.setDescription('Снять варн пользователю')
        .addUserOption(option => 
            option.setName('пользователь')
                .setDescription('Пользователь которому вы желаете снять варн')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('причина')
                .setDescription('Причина снятия варна')
                .setRequired(true))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
        const { banRoleName, modersChannelName } = require('../json/config.json');
		const user = interaction.options.getUser('пользователь');
        const reason = interaction.options.getString('причина');
        const userData = await getUser(user.id);
        const moderData = await getModer(interaction.user.id);
        const bannedRole = interaction.guild.roles.cache.find(role => role.name === banRoleName);
        const modChannel = interaction.guild.channels.cache.find(channel => channel.name === modersChannelName);
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) return interaction.reply(errorEmbed('Пользователь не найден'));
        if (!bannedRole) return await interaction.reply(errorEmbed(`Роль с именем ${banRoleName} не найдена`));
        if (!modChannel) return await interaction.reply(errorEmbed(`Канал с именем ${modersChannelName} не найден`));


        const warnEmbed = new MessageEmbed()
            .setTitle('Пользователь был успешно разварнен!')
            .setColor('DARK_GOLD')

        const modWarnEmbed = new MessageEmbed()
            .setTitle(`Снятие варна пользователю ${member.name || user.username}`)
            .setDescription(`- Пользователь: ${user}\n- Модератор: ${interaction.user}\n- Причина: ${reason}`)
            .setColor('DARK_GOLD')
            .setTimestamp()
            .setFooter({ text: 'Варн | Мод' });

        try {
            await modChannel.send({embeds: [modWarnEmbed]});
            await interaction.reply({ embeds: [warnEmbed], ephemeral: true }).catch(error => {console.log(error)});
        } catch(error) {
            await interaction.reply(errorEmbed(error));
            return;
        }
        await updateUser(userData.id, { warns: userData.warns - 1 });
	},
};
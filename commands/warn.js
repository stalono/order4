const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { updateUser, updateModer, getUser, getModer } = require('../mongoose.js');
const { errorEmbed, sendDM } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Выдать варн пользователю')
        .addUserOption(option => 
            option.setName('пользователь')
                .setDescription('Пользователь которому вы желаете выдать варн')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('причина')
                .setDescription('Причина выдачи варна')
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
            .setTitle('Пользователь был успешно заварнен!')
            .setColor('DARK_RED')

        const modWarnEmbed = new MessageEmbed()
            .setTitle(`Выдача варна пользователю ${member.name || user.username}`)
            .setDescription(`- Пользователь: ${user}\n- Модератор: ${interaction.user}\n- Причина: ${reason}`)
            .setColor('DARK_RED')
            .setTimestamp()
            .setFooter({ text: 'Варн | Мод' });

        const autoBanEmbed = new MessageEmbed()
            .setTitle(`Автоматически забанен ${member.name || user.username}`)
            .setDescription(`- Пользователь: ${user}\n- Модератор: Система\n- Причина: 5/5 варнов`)

        try {
            await modChannel.send({embeds: [modWarnEmbed]});
            await interaction.reply({ embeds: [warnEmbed], ephemeral: true }).catch(error => {console.log(error)});
        } catch(error) {
            await interaction.reply(errorEmbed(error));
            return;
        }
        await updateUser(userData.id, { warns: userData.warns + 1 });
        await updateModer(moderData.id, { warns: moderData.warns + 1 });
        if (userData.warns + 1 >= 5) {
            await member.roles.add(bannedRole);
            await modChannel.send({embeds: [autoBanEmbed]});
        }
	},
};
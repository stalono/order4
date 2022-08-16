const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { updateUser, updateModer, getUser, getModer } = require('../mongoose.js');
const { errorEmbed, sendDM } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Кикнуть пользователя')
        .addUserOption(option => 
            option.setName('пользователь')
                .setDescription('Пользователь которого вы желаете кикнуть')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('причина')
                .setDescription('Причина кика') 
                .setRequired(true))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
        const { modersChannelName } = require('../json/config.json');
		const user = interaction.options.getUser('пользователь');
        const reason = interaction.options.getString('причина');
        const userData = await getUser(user.id);
        const moderData = await getModer(interaction.user.id);
        const modChannel = interaction.guild.channels.cache.find(channel => channel.name === modersChannelName);
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) return interaction.reply(errorEmbed('Пользователь не найден'));
        if (!modChannel) return await interaction.reply(errorEmbed(`Канал с именем ${modersChannelName} не найден`));


        const kickEmbed = new MessageEmbed()
            .setTitle('Пользователь был успешно кикнут!')
            .setColor('DARK_BLUE')

        const modKickEmbed = new MessageEmbed()
            .setTitle(`Изгнание пользователя ${member.name || user.username}`)
            .setDescription(`- Пользователь: ${user}\n- Модератор: ${interaction.user}\n- Причина: ${reason}`)
            .setColor('DARK_BLUE')
            .setTimestamp()
            .setFooter({ text: 'Изгнанение | Мод' });

        try {
            await member.kick(reason);
            await modChannel.send({embeds: [modKickEmbed]});
            await interaction.reply({ embeds: [kickEmbed], ephemeral: true });
        } catch(error) {
            await interaction.reply(errorEmbed(error));
            return;
        }
        await updateUser(userData.id, { kicks: userData.kicks + 1 });
        await updateModer(moderData.id, { kicks: moderData.kicks + 1 });
	},
};
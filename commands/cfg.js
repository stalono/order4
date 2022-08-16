const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { cwd } = require('process');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cfg')
		.setDescription('Изменить конфигурацию бота')
        .addSubcommand(subcommand =>
            subcommand.setName('ban')
                .setDescription('Изменить роль бана')
                .addRoleOption(option =>
                    option.setName('роль')
                        .setDescription('Роль которую вы хотите назначить')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('mute')
                .setDescription('Изменить роль мута')
                .addRoleOption(option =>
                    option.setName('роль')
                        .setDescription('Роль которую вы хотите назначить')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('channel')
                .setDescription('Изменить канала для логов')
                .addChannelOption(option =>
                    option.setName('канал')
                        .setDescription('Канал для логов')
                        .setRequired(true))),
	async execute(interaction) {
        const config = require('../json/config.json');
		const command = interaction.options.getSubcommand();
        switch (command) {
            case 'ban':
                const role = interaction.options.getRole('роль');
                config.banRoleName = role.name;
                fs.writeFileSync(`${cwd()}/json/config.json`, JSON.stringify(config));
                await interaction.reply(`**Роль бана изменена на ${role}**`).catch(error => {console.log(error)});
                break;
            case 'mute':
                const muteRole = interaction.options.getRole('роль');
                config.muteRoleName = muteRole.name;
                fs.writeFileSync(`${cwd()}/json/config.json`, JSON.stringify(config));
                await interaction.reply(`**Роль мута изменена на ${muteRole}**`).catch(error => {console.log(error)});
                break;
            case 'channel':
                const channel = interaction.options.getChannel('канал');
                config.modersChannelName = channel.name;
                fs.writeFileSync(`${cwd()}/json/config.json`, JSON.stringify(config));
                await interaction.reply(`**Канал для логов изменен на ${channel}**`).catch(error => {console.log(error)});
                break;
        }
	},
};
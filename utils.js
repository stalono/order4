const { MessageEmbed } = require('discord.js');

function errorEmbed(error) {
    console.log(error)
    return {embeds: [ new MessageEmbed()
        .setTitle('Ошибка')
        .setDescription(`**${error}**`)
        .setColor('RED')
        .setTimestamp()
        .setFooter({ text: 'Ошибка | Мод' }) 
    ]} 
}

async function sendDM(interaction, embed, id) {
    const user = await interaction.guild.members.cache.get(id);
    const dm = await user.createDM();
    await dm.send({embeds: [embed]});
    await user.deleteDM();
}

module.exports = { errorEmbed, sendDM };
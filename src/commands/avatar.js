import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

/**
 * Comando: /avatar
 * Mostra o avatar de um usuário
 */
export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Mostra o avatar de um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário a consultar')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const avatarURL = user.displayAvatarURL({ size: 1024 });
    
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle(`👤 Avatar de ${user.username}`)
      .setImage(avatarURL)
      .setTimestamp()
      .setFooter({ text: `ID: ${user.id}` });
    
    await interaction.reply({ embeds: [embed] });
  },
};

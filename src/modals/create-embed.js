import { EmbedBuilder } from 'discord.js';

/**
 * Modal: create_embed_modal
 * Processa a criação de embed
 */
export default {
  id: 'create_embed_modal',
  async execute(interaction) {
    try {
      const title = interaction.fields.getTextInputValue('embed_title');
      const description = interaction.fields.getTextInputValue('embed_description');
      const color = interaction.fields.getTextInputValue('embed_color');
      const footer = interaction.fields.getTextInputValue('embed_footer');
      
      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();
      
      if (footer) {
        embed.setFooter({ text: footer });
      }
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao criar embed:', error);
      await interaction.reply({
        content: '❌ Erro ao criar a embed.',
        ephemeral: true,
      });
    }
  },
};

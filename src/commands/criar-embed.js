import { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

/**
 * Comando: /criar-embed
 * Cria uma embed personalizada
 */
export default {
  data: new SlashCommandBuilder()
    .setName('criar-embed')
    .setDescription('Cria uma embed personalizada'),
  
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('create_embed_modal')
      .setTitle('Criar Embed Personalizada');
    
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('embed_title')
          .setLabel('Título')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('embed_description')
          .setLabel('Descrição')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('embed_color')
          .setLabel('Cor (hex: #FFFFFF)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('#0099FF')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('embed_footer')
          .setLabel('Rodápé')
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
      )
    );
    
    await interaction.showModal(modal);
  },
};

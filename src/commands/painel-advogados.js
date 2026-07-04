import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

/**
 * Comando: /painel-advogados
 * Configura a lista automática de advogados
 */
export default {
  data: new SlashCommandBuilder()
    .setName('painel-advogados')
    .setDescription('Configura a lista automática de advogados'),
  
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('lawyer_list_config_modal')
      .setTitle('Configurar Lista de Advogados');
    
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('lawyer_channel')
          .setLabel('ID do Canal')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('lawyer_role')
          .setLabel('ID do Cargo de Advogados')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('lawyer_title')
          .setLabel('Título da Lista')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('👨‍⚖️ Lista Oficial de Advogados')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('lawyer_description')
          .setLabel('Descrição')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Advogados cadastrados no servidor')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('lawyer_color')
          .setLabel('Cor (hex: #FFFFFF)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('#0099FF')
          .setRequired(true)
      )
    );
    
    await interaction.showModal(modal);
  },
};

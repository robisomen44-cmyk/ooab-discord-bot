import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { query, getOne } from '../database/connection.js';

/**
 * Comando: /painel-ticket
 * Cria um painel de configuração de tickets
 */
export default {
  data: new SlashCommandBuilder()
    .setName('painel-ticket')
    .setDescription('Configura o sistema de tickets'),
  
  async execute(interaction) {
    // Cria um modal para a configuração
    const modal = new ModalBuilder()
      .setCustomId('ticket_config_modal')
      .setTitle('Configurar Sistema de Tickets');
    
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('ticket_channel')
          .setLabel('ID do Canal')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('ticket_category')
          .setLabel('ID da Categoria')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('ticket_title')
          .setLabel('Título do Painel')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Sistema de Suporte')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('ticket_description')
          .setLabel('Descrição')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Clique em Abrir Ticket para começar')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('ticket_color')
          .setLabel('Cor do Painel (hex: #FFFFFF)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('#0099FF')
          .setRequired(true)
      )
    );
    
    await interaction.showModal(modal);
  },
};

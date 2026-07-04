import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

/**
 * Comando: /anuncio-atendimento
 * Configura o anúncio automático de atendimento
 */
export default {
  data: new SlashCommandBuilder()
    .setName('anuncio-atendimento')
    .setDescription('Configura o anúncio de atendimento'),
  
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('attendance_announcement_config_modal')
      .setTitle('Configurar Anúncio de Atendimento');
    
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('announce_channel')
          .setLabel('ID do Canal')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('announce_open_time')
          .setLabel('Horário de Abertura (HH:MM)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('08:00')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('announce_close_time')
          .setLabel('Horário de Fechamento (HH:MM)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('18:00')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('announce_title')
          .setLabel('Título')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Status do Atendimento')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('announce_description')
          .setLabel('Descrição')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Status do atendimento do servidor')
          .setRequired(true)
      )
    );
    
    await interaction.showModal(modal);
  },
};

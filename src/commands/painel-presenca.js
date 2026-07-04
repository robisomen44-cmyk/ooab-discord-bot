import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

/**
 * Comando: /painel-presenca
 * Configura o sistema de presença
 */
export default {
  data: new SlashCommandBuilder()
    .setName('painel-presenca')
    .setDescription('Configura o sistema de presença'),
  
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('attendance_config_modal')
      .setTitle('Configurar Sistema de Presença');
    
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('attendance_channel')
          .setLabel('ID do Canal de Presença')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('attendance_authorized_role')
          .setLabel('ID do Cargo Autorizado')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('attendance_morning_time')
          .setLabel('Horário da Manhã (HH:MM-HH:MM)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('07:00-12:00')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('attendance_afternoon_time')
          .setLabel('Horário da Tarde (HH:MM-HH:MM)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('13:00-18:00')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('attendance_report_time')
          .setLabel('Horário do Relatório (HH:MM)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('18:00')
          .setRequired(true)
      )
    );
    
    await interaction.showModal(modal);
  },
};

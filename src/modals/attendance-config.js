import { EmbedBuilder } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Modal: attendance_config_modal
 * Processa a configuração de presença
 */
export default {
  id: 'attendance_config_modal',
  async execute(interaction) {
    try {
      const channelId = interaction.fields.getTextInputValue('attendance_channel');
      const authorizedRoleId = interaction.fields.getTextInputValue('attendance_authorized_role');
      const morningTime = interaction.fields.getTextInputValue('attendance_morning_time');
      const afternoonTime = interaction.fields.getTextInputValue('attendance_afternoon_time');
      const reportTime = interaction.fields.getTextInputValue('attendance_report_time');
      
      // Valida
      const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);
      const role = await interaction.guild.roles.fetch(authorizedRoleId).catch(() => null);
      
      if (!channel || !role) {
        return await interaction.reply({
          content: '❌ Canal ou cargo não encontrados.',
          ephemeral: true
        });
      }
      
      // Parse dos horários
      const [morningStart, morningEnd] = morningTime.split('-');
      const [afternoonStart, afternoonEnd] = afternoonTime.split('-');
      
      // Salva no banco
      await query(
        `INSERT INTO attendance_configs (server_id, channel_id, authorized_role_id, morning_start, morning_end, afternoon_start, afternoon_end, report_time, report_channel_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (server_id) 
         DO UPDATE SET channel_id = $2, authorized_role_id = $3, morning_start = $4, morning_end = $5, afternoon_start = $6, afternoon_end = $7, report_time = $8, report_channel_id = $9`,
        [interaction.guildId, channelId, authorizedRoleId, morningStart, morningEnd, afternoonStart, afternoonEnd, reportTime, channelId]
      );
      
      // Cria painel de presença
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('🕐 Registrar Presença')
        .setDescription(`🎅 Manhã: ${morningStart} - ${morningEnd}\n🎆 Tarde: ${afternoonStart} - ${afternoonEnd}`)
        .setTimestamp();
      
      await channel.send({ embeds: [embed] });
      
      await interaction.reply({
        content: '✅ Sistema de presença configurado!',
        ephemeral: true
      });
    } catch (error) {
      console.error('Erro ao configurar presença:', error);
      await interaction.reply({
        content: '❌ Erro ao configurar a presença.',
        ephemeral: true
      });
    }
  },
};

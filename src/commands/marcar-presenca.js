import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Comando: /marcar-presenca
 * Marca presença do usuário
 */
export default {
  data: new SlashCommandBuilder()
    .setName('marcar-presenca')
    .setDescription('Marca sua presença'),
  
  async execute(interaction) {
    try {
      // Busca configuração de presença
      const configResult = await query(
        'SELECT * FROM attendance_configs WHERE server_id = $1',
        [interaction.guildId]
      );
      
      if (configResult.rowCount === 0) {
        return await interaction.reply({
          content: '❌ Sistema de presença não configurado.',
          ephemeral: true,
        });
      }
      
      const config = configResult.rows[0];
      const member = await interaction.guild.members.fetch(interaction.user.id);
      
      // Verifica permissão
      if (!member.roles.cache.has(config.authorized_role_id)) {
        return await interaction.reply({
          content: '❌ Você não tem permissão para marcar presença.',
          ephemeral: true,
        });
      }
      
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const morningStart = parseInt(config.morning_start.split(':')[0]) * 60 + parseInt(config.morning_start.split(':')[1]);
      const morningEnd = parseInt(config.morning_end.split(':')[0]) * 60 + parseInt(config.morning_end.split(':')[1]);
      const afternoonStart = parseInt(config.afternoon_start.split(':')[0]) * 60 + parseInt(config.afternoon_start.split(':')[1]);
      const afternoonEnd = parseInt(config.afternoon_end.split(':')[0]) * 60 + parseInt(config.afternoon_end.split(':')[1]);
      
      let shift = null;
      if (currentTime >= morningStart && currentTime <= morningEnd) {
        shift = 'morning';
      } else if (currentTime >= afternoonStart && currentTime <= afternoonEnd) {
        shift = 'afternoon';
      }
      
      if (!shift) {
        return await interaction.reply({
          content: '❌ Fora do horário permitido para marcar presença.',
          ephemeral: true,
        });
      }
      
      // Verifica se já marcou
      const existingResult = await query(
        `SELECT * FROM attendance 
         WHERE server_id = $1 AND user_id = $2 AND date = $3 AND shift = $4`,
        [interaction.guildId, interaction.user.id, now.toISOString().split('T')[0], shift]
      );
      
      if (existingResult.rowCount > 0) {
        return await interaction.reply({
          content: `❌ Você já marcou presença neste turno.`,
          ephemeral: true,
        });
      }
      
      // Registra presença
      await query(
        `INSERT INTO attendance (server_id, user_id, date, shift, time_marked)
         VALUES ($1, $2, $3, $4, NOW())`,
        [interaction.guildId, interaction.user.id, now.toISOString().split('T')[0], shift]
      );
      
      const shiftName = shift === 'morning' ? '🌅 Manhã' : '🌇 Tarde';
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const embed = new EmbedBuilder()
        .setColor('#00AA00')
        .setTitle('✅ Presença Marcada')
        .addFields(
          { name: '👤 Usuário', value: interaction.user.username, inline: true },
          { name: '🕐 Turno', value: shiftName, inline: true },
          { name: '⏰ Horário', value: timeStr, inline: true }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao marcar presença:', error);
      await interaction.reply({ content: '❌ Erro ao marcar presença.', ephemeral: true });
    }
  },
};

import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Comando: /relatorio-presenca
 * Gera relatório de presença
 */
export default {
  data: new SlashCommandBuilder()
    .setName('relatorio-presenca')
    .setDescription('Gera relatório de presença')
    .addStringOption(option =>
      option.setName('data')
        .setDescription('Data (DD/MM/YYYY)')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    try {
      let date = new Date().toISOString().split('T')[0];
      
      if (interaction.options.getString('data')) {
        const [day, month, year] = interaction.options.getString('data').split('/');
        date = `${year}-${month}-${day}`;
      }
      
      const result = await query(
        `SELECT user_id, shift, time_marked FROM attendance 
         WHERE server_id = $1 AND date = $2
         ORDER BY user_id`,
        [interaction.guildId, date]
      );
      
      const attendance = result.rows;
      
      if (attendance.length === 0) {
        return await interaction.reply({
          content: '✅ Nenhum registro de presença para esta data.',
          ephemeral: true,
        });
      }
      
      // Agrupa por usuário
      const grouped = {};
      for (const record of attendance) {
        if (!grouped[record.user_id]) {
          grouped[record.user_id] = {};
        }
        const shiftName = record.shift === 'morning' ? '🌅 Manhã' : '🌇 Tarde';
        const time = new Date(record.time_marked).toLocaleTimeString('pt-BR');
        grouped[record.user_id][shiftName] = time;
      }
      
      let description = '';
      for (const [userId, shifts] of Object.entries(grouped)) {
        const member = await interaction.guild.members.fetch(userId).catch(() => null);
        const memberName = member?.user.username || 'Desconhecido';
        description += `**${memberName}**\n`;
        description += `${shifts['🌅 Manhã'] || '❌ Não marcou'}\n`;
        description += `${shifts['🌇 Tarde'] || '❌ Não marcou'}\n\n`;
      }
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('📊 Relatório de Presença')
        .setDescription(description)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      await interaction.reply({ content: '❌ Erro ao gerar relatório.', ephemeral: true });
    }
  },
};

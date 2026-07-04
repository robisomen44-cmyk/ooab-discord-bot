import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Comando: /audiencias
 * Lista todas as audiências
 */
export default {
  data: new SlashCommandBuilder()
    .setName('audiencias')
    .setDescription('Lista todas as audiências agendadas'),
  
  async execute(interaction) {
    try {
      const result = await query(
        `SELECT h.*, p.process_number FROM hearings h
         JOIN processes p ON h.process_id = p.id
         WHERE h.server_id = $1 AND h.status = 'scheduled'
         ORDER BY h.date ASC
         LIMIT 10`,
        [interaction.guildId]
      );
      
      const hearings = result.rows;
      
      if (hearings.length === 0) {
        return await interaction.reply({
          content: '❌ Nenhuma audiência agendada.',
          ephemeral: true,
        });
      }
      
      let description = '';
      for (const hearing of hearings) {
        const dateStr = `<t:${Math.floor(new Date(hearing.date).getTime() / 1000)}:d>`;
        description += `📅 **${hearing.process_number}** - ${dateStr}\n`;
      }
      
      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('📅 Audiências Agendadas')
        .setDescription(description)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao listar audiências:', error);
      await interaction.reply({ content: '❌ Erro ao listar audiências.', ephemeral: true });
    }
  },
};

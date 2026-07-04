import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Comando: /processos
 * Lista todos os processos
 */
export default {
  data: new SlashCommandBuilder()
    .setName('processos')
    .setDescription('Lista todos os processos')
    .addStringOption(option =>
      option.setName('status')
        .setDescription('Filtrar por status')
        .setRequired(false)
        .addChoices(
          { name: 'Aberto', value: 'open' },
          { name: 'Em Andamento', value: 'in_progress' },
          { name: 'Audiência Marcada', value: 'hearing_scheduled' },
          { name: 'Julgado', value: 'judged' },
          { name: 'Arquivado', value: 'archived' }
        )
    ),
  
  async execute(interaction) {
    try {
      const status = interaction.options.getString('status');
      
      let query_text = 'SELECT * FROM processes WHERE server_id = $1';
      let params = [interaction.guildId];
      
      if (status) {
        query_text += ' AND status = $2';
        params.push(status);
      }
      
      query_text += ' ORDER BY created_at DESC LIMIT 10';
      
      const result = await query(query_text, params);
      const processes = result.rows;
      
      if (processes.length === 0) {
        return await interaction.reply({
          content: '❌ Nenhum processo encontrado.',
          ephemeral: true,
        });
      }
      
      const statusEmojis = {
        'open': '🔴',
        'in_progress': '🟡',
        'hearing_scheduled': '📅',
        'judged': '✅',
        'archived': '📦',
      };
      
      let description = '';
      for (const proc of processes) {
        description += `${statusEmojis[proc.status]} **${proc.process_number}** - ${proc.plaintiff_id} vs ${proc.defendant_id}\n`;
      }
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('⚖️ Processos Jurídicos')
        .setDescription(description)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao listar processos:', error);
      await interaction.reply({ content: '❌ Erro ao listar processos.', ephemeral: true });
    }
  },
};

import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { query, getOne } from '../database/connection.js';

/**
 * Comando: /agendar-audiencia
 * Agenda uma nova audiência
 */
export default {
  data: new SlashCommandBuilder()
    .setName('agendar-audiencia')
    .setDescription('Agenda uma nova audiência')
    .addStringOption(option =>
      option.setName('processo')
        .setDescription('Número do processo')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('data')
        .setDescription('Data da audiência (DD/MM/YYYY HH:MM)')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('juiz')
        .setDescription('Juiz responsável')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    try {
      const processNumber = interaction.options.getString('processo');
      const dateStr = interaction.options.getString('data');
      const judge = interaction.options.getUser('juiz');
      
      // Busca processo
      const processResult = await getOne(
        'SELECT * FROM processes WHERE process_number = $1 AND server_id = $2',
        [processNumber, interaction.guildId]
      );
      
      if (!processResult) {
        return await interaction.reply({
          content: '❌ Processo não encontrado.',
          ephemeral: true,
        });
      }
      
      // Parse da data
      const [date, time] = dateStr.split(' ');
      const [day, month, year] = date.split('/');
      const scheduleDate = new Date(`${year}-${month}-${day}T${time}:00`);
      
      if (isNaN(scheduleDate.getTime())) {
        return await interaction.reply({
          content: '❌ Data inválida. Use: DD/MM/YYYY HH:MM',
          ephemeral: true,
        });
      }
      
      // Cria audiência
      const result = await query(
        `INSERT INTO hearings (server_id, process_id, date, judge_id, status)
         VALUES ($1, $2, $3, $4, 'scheduled')
         RETURNING *`,
        [interaction.guildId, processResult.id, scheduleDate, judge.id]
      );
      
      const hearing = result.rows[0];
      
      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('📅 Audiência Agendada')
        .addFields(
          { name: '📋 Processo', value: processNumber, inline: true },
          { name: '⏰ Data', value: `<t:${Math.floor(scheduleDate.getTime() / 1000)}:F>`, inline: true },
          { name: '👨‍⚖️ Juiz', value: judge.username, inline: true },
          { name: '🔴 Status', value: 'Agendada', inline: true }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao agendar audiência:', error);
      await interaction.reply({ content: '❌ Erro ao agendar audiência.', ephemeral: true });
    }
  },
};

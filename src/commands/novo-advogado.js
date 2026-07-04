import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Comando: /novo-advogado
 * Cadastra um novo advogado
 */
export default {
  data: new SlashCommandBuilder()
    .setName('novo-advogado')
    .setDescription('Cadastra um novo advogado')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário a cadastrar')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('oab')
        .setDescription('Número OAB')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('especializacao')
        .setDescription('Especialização')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    try {
      const user = interaction.options.getUser('usuario');
      const oabNumber = interaction.options.getString('oab');
      const specialization = interaction.options.getString('especializacao') || 'Geral';
      
      // Verifica se já existe
      const existing = await query(
        'SELECT * FROM lawyers WHERE server_id = $1 AND user_id = $2',
        [interaction.guildId, user.id]
      );
      
      if (existing.rowCount > 0) {
        return await interaction.reply({
          content: '❌ Este advogado já está cadastrado.',
          ephemeral: true,
        });
      }
      
      // Cria novo advogado
      const result = await query(
        `INSERT INTO lawyers (server_id, user_id, oab_number, specialization)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [interaction.guildId, user.id, oabNumber, specialization]
      );
      
      const lawyer = result.rows[0];
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('👨‍⚖️ Advogado Cadastrado')
        .addFields(
          { name: '👤 Usuário', value: user.username, inline: true },
          { name: '📋 OAB', value: oabNumber, inline: true },
          { name: '📚 Especialização', value: specialization, inline: true }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao cadastrar advogado:', error);
      await interaction.reply({ content: '❌ Erro ao cadastrar advogado.', ephemeral: true });
    }
  },
};

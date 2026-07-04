import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Comando: /buscar-artigo
 * Busca um artigo ou lei
 */
export default {
  data: new SlashCommandBuilder()
    .setName('buscar-artigo')
    .setDescription('Busca um artigo ou lei')
    .addStringOption(option =>
      option.setName('termo')
        .setDescription('Termo de busca')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    try {
      const searchTerm = interaction.options.getString('termo').toLowerCase();
      
      // Busca no banco
      const result = await query(
        `SELECT * FROM laws 
         WHERE LOWER(code) LIKE $1 OR LOWER(title) LIKE $1 OR LOWER(text) LIKE $1
         LIMIT 10`,
        [`%${searchTerm}%`]
      );
      
      if (result.rowCount === 0) {
        return await interaction.reply({
          content: '❌ Nenhum artigo encontrado.',
          ephemeral: true,
        });
      }
      
      const laws = result.rows;
      
      let description = '';
      for (const law of laws) {
        description += `**${law.code}** - ${law.title}\n`;
      }
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('📚 Resultados da Busca')
        .setDescription(description)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao buscar artigo:', error);
      await interaction.reply({ content: '❌ Erro ao buscar.', ephemeral: true });
    }
  },
};

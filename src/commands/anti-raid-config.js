import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Comando: /anti-raid-config
 * Configura o Anti-Raid
 */
export default {
  data: new SlashCommandBuilder()
    .setName('anti-raid-config')
    .setDescription('Configura o Anti-Raid do servidor')
    .addStringOption(option =>
      option.setName('acao')
        .setDescription('Ação a tomar')
        .setRequired(true)
        .addChoices(
          { name: 'Timeout', value: 'timeout' },
          { name: 'Kick', value: 'kick' },
          { name: 'Ban', value: 'ban' }
        )
    )
    .addIntegerOption(option =>
      option.setName('limite')
        .setDescription('Limite de ações em 10 segundos')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    try {
      const action = interaction.options.getString('acao');
      const limit = interaction.options.getInteger('limite');
      
      // Salva configuração
      await query(
        `INSERT INTO servers (id, owner_id) VALUES ($1, $2)
         ON CONFLICT (id) DO NOTHING`,
        [interaction.guildId, interaction.guild.ownerId]
      );
      
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('🛡️ Anti-Raid Configurado')
        .addFields(
          { name: '⚡ Ação', value: action.toUpperCase(), inline: true },
          { name: '📊 Limite', value: `${limit} ações/10s`, inline: true }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao configurar Anti-Raid:', error);
      await interaction.reply({ content: '❌ Erro ao configurar Anti-Raid.', ephemeral: true });
    }
  },
};

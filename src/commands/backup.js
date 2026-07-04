import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Comando: /backup
 * Faz backup do servidor
 */
export default {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Faz backup das configurações do servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    try {
      await interaction.deferReply();
      
      const guild = interaction.guild;
      
      // Coleta dados do servidor
      const backupData = {
        name: guild.name,
        description: guild.description,
        channels: guild.channels.cache.map(c => ({ id: c.id, name: c.name, type: c.type })),
        roles: guild.roles.cache.map(r => ({ id: r.id, name: r.name, color: r.color })),
        timestamp: new Date(),
      };
      
      // Salva no banco
      await query(
        `INSERT INTO backups (server_id, backup_data, created_by)
         VALUES ($1, $2, $3)`,
        [guild.id, JSON.stringify(backupData), interaction.user.id]
      );
      
      const embed = new EmbedBuilder()
        .setColor('#00AA00')
        .setTitle('💾 Backup Realizado')
        .addFields(
          { name: '📑 Canais', value: String(backupData.channels.length), inline: true },
          { name: '🏷️ Cargos', value: String(backupData.roles.length), inline: true }
        )
        .setTimestamp();
      
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao fazer backup:', error);
      await interaction.editReply({ content: '❌ Erro ao fazer backup.', ephemeral: true });
    }
  },
};

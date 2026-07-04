import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Modal: welcome_config_modal
 * Processa a configuração de entrada
 */
export default {
  id: 'welcome_config_modal',
  async execute(interaction) {
    try {
      const channelId = interaction.fields.getTextInputValue('welcome_channel');
      const title = interaction.fields.getTextInputValue('welcome_title');
      const description = interaction.fields.getTextInputValue('welcome_description');
      const addRoleId = interaction.fields.getTextInputValue('welcome_add_role');
      const color = interaction.fields.getTextInputValue('welcome_color');
      
      // Valida
      const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);
      const role = await interaction.guild.roles.fetch(addRoleId).catch(() => null);
      
      if (!channel || !role) {
        return await interaction.reply({
          content: '❌ Canal ou cargo não encontrados.',
          ephemeral: true
        });
      }
      
      // Salva no banco
      await query(
        `INSERT INTO welcome_configs (server_id, channel_id, title, description, color, add_role_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (server_id) 
         DO UPDATE SET channel_id = $2, title = $3, description = $4, color = $5, add_role_id = $6`,
        [interaction.guildId, channelId, title, description, color, addRoleId]
      );
      
      await interaction.reply({
        content: '✅ Mensagem de entrada configurada!',
        ephemeral: true
      });
    } catch (error) {
      console.error('Erro ao configurar entrada:', error);
      await interaction.reply({
        content: '❌ Erro ao configurar a entrada.',
        ephemeral: true
      });
    }
  },
};

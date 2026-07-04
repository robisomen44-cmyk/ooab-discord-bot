import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Modal: ticket_config_modal
 * Processa a configuração de tickets
 */
export default {
  id: 'ticket_config_modal',
  async execute(interaction) {
    try {
      const channelId = interaction.fields.getTextInputValue('ticket_channel');
      const categoryId = interaction.fields.getTextInputValue('ticket_category');
      const title = interaction.fields.getTextInputValue('ticket_title');
      const description = interaction.fields.getTextInputValue('ticket_description');
      const color = interaction.fields.getTextInputValue('ticket_color');
      
      // Valida se o canal e categoria existem
      const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);
      const category = await interaction.guild.channels.fetch(categoryId).catch(() => null);
      
      if (!channel || !category) {
        return await interaction.reply({
          content: '❌ Canal ou categoria não encontrados. Verifique os IDs.',
          ephemeral: true
        });
      }
      
      // Salva no banco de dados
      await query(
        `INSERT INTO ticket_configs (server_id, channel_id, category_id, title, description, color)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (server_id) 
         DO UPDATE SET channel_id = $2, category_id = $3, title = $4, description = $5, color = $6`,
        [interaction.guildId, channelId, categoryId, title, description, color]
      );
      
      // Cria o painel de tickets
      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();
      
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('open_ticket')
          .setLabel('🎫 Abrir Ticket')
          .setStyle(ButtonStyle.Primary)
      );
      
      await channel.send({ embeds: [embed], components: [button] });
      
      await interaction.reply({
        content: '✅ Sistema de tickets configurado com sucesso!',
        ephemeral: true
      });
    } catch (error) {
      console.error('Erro ao configurar tickets:', error);
      await interaction.reply({
        content: '❌ Erro ao configurar o sistema de tickets.',
        ephemeral: true
      });
    }
  },
};

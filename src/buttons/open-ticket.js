import { query } from '../database/connection.js';
import { v4 as uuidv4 } from 'crypto';

/**
 * Botão: open_ticket
 * Abre um novo ticket
 */
export default {
  id: 'open_ticket',
  async execute(interaction) {
    try {
      // Obtém configuração de tickets
      const config = await query(
        'SELECT * FROM ticket_configs WHERE server_id = $1',
        [interaction.guildId]
      );
      
      if (config.rowCount === 0) {
        return await interaction.reply({
          content: '❌ Sistema de tickets não configurado.',
          ephemeral: true
        });
      }
      
      const ticketConfig = config.rows[0];
      const ticketId = `ticket-${Date.now()}`;
      
      // Cria canal de ticket
      const channel = await interaction.guild.channels.create({
        name: `${ticketId}`,
        type: 0, // GUILD_TEXT
        parent: ticketConfig.category_id,
        topic: `Ticket de ${interaction.user.username}`,
        permissionOverwrites: [
          {
            id: interaction.guildId,
            deny: ['ViewChannel'],
          },
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
          },
          {
            id: ticketConfig.support_role_id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages'],
          },
        ],
      });
      
      // Salva ticket no banco
      await query(
        `INSERT INTO tickets (ticket_id, server_id, channel_id, user_id, status)
         VALUES ($1, $2, $3, $4, 'open')`,
        [ticketId, interaction.guildId, channel.id, interaction.user.id]
      );
      
      // Envia mensagem no canal de tickets
      await channel.send({
        content: `👋 Bem-vindo ${interaction.user}!\n\n${ticketConfig.open_message || 'Seu ticket foi criado. Aguarde por um atendente.'}`,
      });
      
      await interaction.reply({
        content: `✅ Ticket criado em ${channel}!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Erro ao abrir ticket:', error);
      await interaction.reply({
        content: '❌ Erro ao abrir o ticket.',
        ephemeral: true,
      });
    }
  },
};

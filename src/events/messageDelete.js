import { query } from '../database/connection.js';
import { logAction } from '../services/databaseService.js';

/**
 * Evento: messageDelete
 * Executado quando uma mensagem é deletada
 */
export default {
  name: 'messageDelete',
  async execute(message) {
    try {
      if (message.author.bot) return;
      
      await logAction({
        serverId: message.guildId,
        type: 'message_deleted',
        userId: message.author.id,
        action: `Mensagem deletada em #${message.channel.name}`,
        beforeValue: message.content,
        channelId: message.channelId,
        targetId: message.author.id,
      });
    } catch (error) {
      console.error('Erro ao registrar mensagem deletada:', error);
    }
  },
};

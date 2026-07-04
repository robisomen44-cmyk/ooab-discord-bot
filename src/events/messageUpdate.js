import { query } from '../database/connection.js';
import { logAction } from '../services/databaseService.js';

/**
 * Evento: messageUpdate
 * Executado quando uma mensagem é editada
 */
export default {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    try {
      if (newMessage.author.bot) return;
      if (oldMessage.content === newMessage.content) return;
      
      await logAction({
        serverId: newMessage.guildId,
        type: 'message_edited',
        userId: newMessage.author.id,
        action: `Mensagem editada em #${newMessage.channel.name}`,
        beforeValue: oldMessage.content,
        afterValue: newMessage.content,
        channelId: newMessage.channelId,
        targetId: newMessage.author.id,
      });
    } catch (error) {
      console.error('Erro ao registrar mensagem editada:', error);
    }
  },
};

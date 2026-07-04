import { query } from '../database/connection.js';
import { logAction } from '../services/databaseService.js';

/**
 * Evento: channelDelete
 * Executado quando um canal é deletado
 */
export default {
  name: 'channelDelete',
  async execute(channel) {
    try {
      await logAction({
        serverId: channel.guild.id,
        type: 'channel_deleted',
        userId: null,
        action: `Canal #${channel.name} deletado`,
        targetId: channel.id,
      });
    } catch (error) {
      console.error('Erro ao registrar deleção de canal:', error);
    }
  },
};

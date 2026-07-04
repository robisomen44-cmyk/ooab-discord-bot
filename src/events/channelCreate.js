import { query } from '../database/connection.js';
import { logAction } from '../services/databaseService.js';

/**
 * Evento: channelCreate
 * Executado quando um canal é criado
 */
export default {
  name: 'channelCreate',
  async execute(channel) {
    try {
      await logAction({
        serverId: channel.guild.id,
        type: 'channel_created',
        userId: null,
        action: `Canal #${channel.name} criado`,
        targetId: channel.id,
      });
    } catch (error) {
      console.error('Erro ao registrar criação de canal:', error);
    }
  },
};

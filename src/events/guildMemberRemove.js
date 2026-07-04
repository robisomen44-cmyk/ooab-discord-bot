import { query } from '../database/connection.js';
import { logAction } from '../services/databaseService.js';

/**
 * Evento: guildMemberRemove
 * Executado quando um membro sai do servidor
 */
export default {
  name: 'guildMemberRemove',
  async execute(member) {
    try {
      // Registra log
      await logAction({
        serverId: member.guild.id,
        type: 'member_leave',
        userId: member.id,
        action: `Membro ${member.user.username} saiu`,
        targetId: member.id,
      });
    } catch (error) {
      console.error('Erro ao processar saída de membro:', error);
    }
  },
};

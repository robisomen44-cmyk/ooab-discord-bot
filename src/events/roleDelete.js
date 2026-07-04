import { query } from '../database/connection.js';
import { logAction } from '../services/databaseService.js';

/**
 * Evento: roleDelete
 * Executado quando um cargo é deletado
 */
export default {
  name: 'roleDelete',
  async execute(role) {
    try {
      await logAction({
        serverId: role.guild.id,
        type: 'role_deleted',
        userId: null,
        action: `Cargo ${role.name} deletado`,
        targetId: role.id,
      });
    } catch (error) {
      console.error('Erro ao registrar deleção de cargo:', error);
    }
  },
};

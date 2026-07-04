import { query } from '../database/connection.js';
import { logAction } from '../services/databaseService.js';

/**
 * Evento: roleCreate
 * Executado quando um cargo é criado
 */
export default {
  name: 'roleCreate',
  async execute(role) {
    try {
      await logAction({
        serverId: role.guild.id,
        type: 'role_created',
        userId: null,
        action: `Cargo ${role.name} criado`,
        targetId: role.id,
      });
    } catch (error) {
      console.error('Erro ao registrar criação de cargo:', error);
    }
  },
};

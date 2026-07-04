import { query } from '../database/connection.js';
import { addRoleHistory } from '../services/databaseService.js';

/**
 * Evento: guildMemberUpdate
 * Executado quando um membro do servidor é atualizado
 */
export default {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    try {
      // Verifica se os cargos mudaram
      const oldRoles = oldMember.roles.cache.map(r => r.id).sort();
      const newRoles = newMember.roles.cache.map(r => r.id).sort();
      
      if (oldRoles.join() !== newRoles.join()) {
        // Encontra cargos adicionados
        for (const roleId of newRoles) {
          if (!oldRoles.includes(roleId)) {
            const role = newMember.guild.roles.cache.get(roleId);
            await addRoleHistory(
              newMember.guild.id,
              newMember.id,
              roleId,
              role?.name || 'Desconhecido',
              'added'
            );
          }
        }
        
        // Encontra cargos removidos
        for (const roleId of oldRoles) {
          if (!newRoles.includes(roleId)) {
            const role = oldMember.guild.roles.cache.get(roleId);
            await addRoleHistory(
              oldMember.guild.id,
              oldMember.id,
              roleId,
              role?.name || 'Desconhecido',
              'removed'
            );
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar atualização de membro:', error);
    }
  },
};

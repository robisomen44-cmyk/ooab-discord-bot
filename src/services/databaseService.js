import { query, getOne, getMany } from '../database/connection.js';

/**
 * Registra uma ação nos logs
 */
export async function logAction({
  serverId,
  type,
  userId,
  action,
  beforeValue = null,
  afterValue = null,
  channelId = null,
  targetId = null,
}) {
  try {
    await query(
      `INSERT INTO logs (server_id, type, user_id, action, before_value, after_value, channel_id, target_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [serverId, type, userId, action, beforeValue, afterValue, channelId, targetId]
    );
  } catch (error) {
    console.error('❌ Erro ao registrar log:', error);
  }
}

/**
 * Obtém logs de um servidor
 */
export async function getLogs(serverId, limit = 50) {
  return getMany(
    `SELECT * FROM logs WHERE server_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [serverId, limit]
  );
}

/**
 * Adiciona uma advertência
 */
export async function addWarning(serverId, userId, reason, moderatorId, expiresAt = null) {
  try {
    const result = await query(
      `INSERT INTO warnings (server_id, user_id, reason, moderator_id, expires_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [serverId, userId, reason, moderatorId, expiresAt]
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ Erro ao adicionar advertência:', error);
    return null;
  }
}

/**
 * Obtém advertências de um usuário
 */
export async function getUserWarnings(serverId, userId) {
  return getMany(
    `SELECT * FROM warnings 
     WHERE server_id = $1 AND user_id = $2 
     AND (expires_at IS NULL OR expires_at > NOW())
     ORDER BY created_at DESC`,
    [serverId, userId]
  );
}

/**
 * Remove uma advertência
 */
export async function removeWarning(warningId) {
  try {
    await query('DELETE FROM warnings WHERE id = $1', [warningId]);
    return true;
  } catch (error) {
    console.error('❌ Erro ao remover advertência:', error);
    return false;
  }
}

/**
 * Registra histórico de cargo
 */
export async function addRoleHistory(serverId, userId, roleId, roleName, action) {
  try {
    await query(
      `INSERT INTO role_history (server_id, user_id, role_id, role_name, action)
       VALUES ($1, $2, $3, $4, $5)`,
      [serverId, userId, roleId, roleName, action]
    );
  } catch (error) {
    console.error('❌ Erro ao registrar histórico de cargo:', error);
  }
}

/**
 * Obtém histórico de cargos
 */
export async function getRoleHistory(serverId, userId) {
  return getMany(
    `SELECT * FROM role_history 
     WHERE server_id = $1 AND user_id = $2
     ORDER BY added_at DESC`,
    [serverId, userId]
  );
}

/**
 * Cria ou atualiza perfil do usuário
 */
export async function upsertUserProfile(serverId, userId) {
  try {
    await query(
      `INSERT INTO user_profiles (server_id, user_id, last_activity)
       VALUES ($1, $2, NOW())
       ON CONFLICT (server_id, user_id) 
       DO UPDATE SET last_activity = NOW(), updated_at = NOW()`,
      [serverId, userId]
    );
  } catch (error) {
    console.error('❌ Erro ao criar/atualizar perfil:', error);
  }
}

/**
 * Obtém perfil do usuário
 */
export async function getUserProfile(serverId, userId) {
  return getOne(
    `SELECT * FROM user_profiles WHERE server_id = $1 AND user_id = $2`,
    [serverId, userId]
  );
}

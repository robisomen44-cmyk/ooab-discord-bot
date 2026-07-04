import { query } from '../database/connection.js';

/**
 * Botão: verify_member
 * Verifica um membro
 */
export default {
  id: 'verify_member',
  async execute(interaction) {
    try {
      // Obtém configuração de verificação
      const config = await query(
        'SELECT * FROM verification_configs WHERE server_id = $1',
        [interaction.guildId]
      );
      
      if (config.rowCount === 0) {
        return await interaction.reply({
          content: '❌ Sistema de verificação não configurado.',
          ephemeral: true,
        });
      }
      
      const verifyConfig = config.rows[0];
      const member = await interaction.guild.members.fetch(interaction.user.id);
      
      // Adiciona cargo
      await member.roles.add(verifyConfig.add_role_id);
      
      if (verifyConfig.remove_role_id) {
        await member.roles.remove(verifyConfig.remove_role_id);
      }
      
      await interaction.reply({
        content: '✅ Você foi verificado com sucesso!',
        ephemeral: true,
      });
    } catch (error) {
      console.error('Erro ao verificar membro:', error);
      await interaction.reply({
        content: '❌ Erro ao verificar.',
        ephemeral: true,
      });
    }
  },
};

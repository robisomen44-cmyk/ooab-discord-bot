import { query } from '../database/connection.js';
import { logAction } from '../services/databaseService.js';

/**
 * Evento: guildMemberAdd
 * Executado quando um novo membro entra no servidor
 */
export default {
  name: 'guildMemberAdd',
  async execute(member) {
    try {
      // Busca configuração de entrada
      const configResult = await query(
        'SELECT * FROM welcome_configs WHERE server_id = $1',
        [member.guild.id]
      );
      
      if (configResult.rowCount === 0) return;
      
      const config = configResult.rows[0];
      const channel = member.guild.channels.cache.get(config.channel_id);
      
      if (!channel) return;
      
      // Cria embed de boas-vindas
      const { EmbedBuilder } = await import('discord.js');
      const embed = new EmbedBuilder()
        .setColor(config.color || '#00AA00')
        .setTitle(config.title)
        .setDescription(config.description.replace('{user}', member.user.username))
        .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
        .addFields(
          { name: '👤 Usuário', value: member.user.username, inline: true },
          { name: '🆔 ID', value: member.id, inline: true },
          { name: '👥 Membros', value: String(member.guild.memberCount), inline: true }
        )
        .setTimestamp();
      
      await channel.send({ embeds: [embed] });
      
      // Adiciona cargo automaticamente
      if (config.add_role_id) {
        await member.roles.add(config.add_role_id).catch(console.error);
      }
      
      // Remove cargo se configurado
      if (config.remove_role_id) {
        await member.roles.remove(config.remove_role_id).catch(console.error);
      }
      
      // Registra log
      await logAction({
        serverId: member.guild.id,
        type: 'member_join',
        userId: member.id,
        action: `Membro ${member.user.username} entrou`,
        targetId: member.id,
      });
    } catch (error) {
      console.error('Erro ao processar entrada de membro:', error);
    }
  },
};

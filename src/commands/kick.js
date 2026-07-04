import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { logAction } from '../services/databaseService.js';

/**
 * Comando: /kick
 * Expulsa um usuário do servidor
 */
export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa um usuário do servidor')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Usuário a ser expulso')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Motivo da expulsão')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'Motivo não especificado';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    
    if (!member) {
      return await interaction.reply({ content: '❌ Usuário não encontrado no servidor.', ephemeral: true });
    }
    
    try {
      await member.kick(reason);
      
      await logAction({
        serverId: interaction.guildId,
        type: 'kick',
        userId: interaction.user.id,
        action: `Expulsão de ${user.username}`,
        afterValue: reason,
        targetId: user.id,
      });
      
      const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('👢 Usuário Expulso')
        .setDescription(`**${user.username}** foi expulso do servidor`)
        .addFields(
          { name: '👤 Usuário', value: `${user}`, inline: true },
          { name: '🛡️ Moderador', value: `${interaction.user}`, inline: true },
          { name: '📝 Motivo', value: reason, inline: false }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao expulsar usuário:', error);
      await interaction.reply({ content: '❌ Erro ao expulsar o usuário.', ephemeral: true });
    }
  },
};

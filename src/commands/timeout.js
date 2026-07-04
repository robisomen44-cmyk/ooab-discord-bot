import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { logAction } from '../services/databaseService.js';

/**
 * Comando: /timeout
 * Silencia um usuário por um período
 */
export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Silencia um usuário')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Usuário a ser silenciado')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duração em minutos')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320) // 28 dias em minutos
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Motivo do silenciamento')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'Motivo não especificado';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    
    if (!member) {
      return await interaction.reply({ content: '❌ Usuário não encontrado no servidor.', ephemeral: true });
    }
    
    try {
      const durationMs = duration * 60 * 1000; // Converte para milissegundos
      await member.timeout(durationMs, reason);
      
      await logAction({
        serverId: interaction.guildId,
        type: 'timeout',
        userId: interaction.user.id,
        action: `Timeout para ${user.username}`,
        afterValue: `${duration} minutos - ${reason}`,
        targetId: user.id,
      });
      
      const embed = new EmbedBuilder()
        .setColor('#9900FF')
        .setTitle('🔇 Usuário Silenciado')
        .setDescription(`**${user.username}** foi silenciado`)
        .addFields(
          { name: '👤 Usuário', value: `${user}`, inline: true },
          { name: '⏱️ Duração', value: `${duration} minutos`, inline: true },
          { name: '🛡️ Moderador', value: `${interaction.user}`, inline: true },
          { name: '📝 Motivo', value: reason, inline: false }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao silenciar usuário:', error);
      await interaction.reply({ content: '❌ Erro ao silenciar o usuário.', ephemeral: true });
    }
  },
};

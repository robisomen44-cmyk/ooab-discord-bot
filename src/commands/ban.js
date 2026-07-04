import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { logAction } from '../services/databaseService.js';

/**
 * Comando: /ban
 * Bane um usuário do servidor
 */
export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bane um usuário do servidor')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Usuário a ser banido')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Motivo do banimento')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'Motivo não especificado';
    
    try {
      // Tenta banir o usuário
      await interaction.guild.members.ban(user, { reason });
      
      // Registra no banco de dados
      await logAction({
        serverId: interaction.guildId,
        type: 'ban',
        userId: interaction.user.id,
        action: `Banimento de ${user.username}`,
        afterValue: reason,
        targetId: user.id,
      });
      
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('⛔ Usuário Banido')
        .setDescription(`**${user.username}** foi banido do servidor`)
        .addFields(
          { name: '👤 Usuário', value: `${user}`, inline: true },
          { name: '🛡️ Moderador', value: `${interaction.user}`, inline: true },
          { name: '📝 Motivo', value: reason, inline: false }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao banir usuário:', error);
      await interaction.reply({ content: '❌ Erro ao banir o usuário.', ephemeral: true });
    }
  },
};

import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { logAction } from '../services/databaseService.js';

/**
 * Comando: /warn
 * Adverte um usuário
 */
export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Adverte um usuário')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Usuário a ser advertido')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Motivo da advertência')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    
    try {
      // Tenta enviar DM para o usuário
      try {
        const dmEmbed = new EmbedBuilder()
          .setColor('#FFFF00')
          .setTitle('⚠️ Você recebeu uma advertência')
          .setDescription(`No servidor **${interaction.guild.name}**`)
          .addFields(
            { name: '📝 Motivo', value: reason },
            { name: '🛡️ Moderador', value: interaction.user.username }
          )
          .setTimestamp();
        
        await user.send({ embeds: [dmEmbed] });
      } catch (err) {
        console.log('Não foi possível enviar DM para o usuário');
      }
      
      await logAction({
        serverId: interaction.guildId,
        type: 'warning',
        userId: interaction.user.id,
        action: `Advertência para ${user.username}`,
        afterValue: reason,
        targetId: user.id,
      });
      
      const embed = new EmbedBuilder()
        .setColor('#FFFF00')
        .setTitle('⚠️ Usuário Advertido')
        .setDescription(`**${user.username}** recebeu uma advertência`)
        .addFields(
          { name: '👤 Usuário', value: `${user}`, inline: true },
          { name: '🛡️ Moderador', value: `${interaction.user}`, inline: true },
          { name: '📝 Motivo', value: reason, inline: false }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao advertir usuário:', error);
      await interaction.reply({ content: '❌ Erro ao advertir o usuário.', ephemeral: true });
    }
  },
};

import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

/**
 * Comando: /unlock
 * Desbloqueia um canal
 */
export default {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Desbloqueia o canal atual')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    try {
      const channel = interaction.channel;
      
      // Desbloqueia @everyone
      await channel.permissionOverwrites.delete(interaction.guildId);
      
      const embed = new EmbedBuilder()
        .setColor('#00AA00')
        .setTitle('🔓 Canal Desbloqueado')
        .setDescription(`#${channel.name} foi desbloqueado`)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao desbloquear canal:', error);
      await interaction.reply({ content: '❌ Erro ao desbloquear o canal.', ephemeral: true });
    }
  },
};

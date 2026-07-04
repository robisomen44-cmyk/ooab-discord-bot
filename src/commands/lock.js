import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Comando: /lock
 * Bloqueia um canal
 */
export default {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Bloqueia o canal atual')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    try {
      const channel = interaction.channel;
      
      // Bloqueia @everyone
      await channel.permissionOverwrites.create(interaction.guildId, {
        SendMessages: false,
      });
      
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('🔒 Canal Bloqueado')
        .setDescription(`#${channel.name} foi bloqueado`)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao bloquear canal:', error);
      await interaction.reply({ content: '❌ Erro ao bloquear o canal.', ephemeral: true });
    }
  },
};

import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Modal: verification_config_modal
 * Processa a configuração de verificação
 */
export default {
  id: 'verification_config_modal',
  async execute(interaction) {
    try {
      const channelId = interaction.fields.getTextInputValue('verify_channel');
      const title = interaction.fields.getTextInputValue('verify_title');
      const description = interaction.fields.getTextInputValue('verify_description');
      const addRoleId = interaction.fields.getTextInputValue('verify_add_role');
      const color = interaction.fields.getTextInputValue('verify_color');
      
      // Valida
      const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);
      const addRole = await interaction.guild.roles.fetch(addRoleId).catch(() => null);
      
      if (!channel || !addRole) {
        return await interaction.reply({
          content: '❌ Canal ou cargo não encontrados.',
          ephemeral: true
        });
      }
      
      // Salva no banco
      await query(
        `INSERT INTO verification_configs (server_id, channel_id, title, description, color, add_role_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (server_id) 
         DO UPDATE SET channel_id = $2, title = $3, description = $4, color = $5, add_role_id = $6`,
        [interaction.guildId, channelId, title, description, color, addRoleId]
      );
      
      // Cria o painel
      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();
      
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verify_member')
          .setLabel('✅ Verificar')
          .setStyle(ButtonStyle.Success)
      );
      
      await channel.send({ embeds: [embed], components: [button] });
      
      await interaction.reply({
        content: '✅ Sistema de verificação configurado!',
        ephemeral: true
      });
    } catch (error) {
      console.error('Erro ao configurar verificação:', error);
      await interaction.reply({
        content: '❌ Erro ao configurar a verificação.',
        ephemeral: true
      });
    }
  },
};

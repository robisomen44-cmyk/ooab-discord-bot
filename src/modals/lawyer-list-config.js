import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { query, getMany } from '../database/connection.js';

/**
 * Modal: lawyer_list_config_modal
 * Processa a configuração da lista de advogados
 */
export default {
  id: 'lawyer_list_config_modal',
  async execute(interaction) {
    try {
      const channelId = interaction.fields.getTextInputValue('lawyer_channel');
      const roleId = interaction.fields.getTextInputValue('lawyer_role');
      const title = interaction.fields.getTextInputValue('lawyer_title');
      const description = interaction.fields.getTextInputValue('lawyer_description');
      const color = interaction.fields.getTextInputValue('lawyer_color');
      
      // Valida se o canal e cargo existem
      const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);
      const role = await interaction.guild.roles.fetch(roleId).catch(() => null);
      
      if (!channel || !role) {
        return await interaction.reply({
          content: '❌ Canal ou cargo não encontrados. Verifique os IDs.',
          ephemeral: true
        });
      }
      
      // Salva no banco de dados
      const result = await query(
        `INSERT INTO lawyer_list_configs (server_id, channel_id, title, description, color, lawyer_role_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (server_id) 
         DO UPDATE SET channel_id = $2, title = $3, description = $4, color = $5, lawyer_role_id = $6
         RETURNING *`,
        [interaction.guildId, channelId, title, description, color, roleId]
      );
      
      // Atualiza a lista de advogados
      const lawyers = await interaction.guild.members.fetch();
      const lawyerList = lawyers
        .filter(m => m.roles.cache.has(roleId))
        .map((m, i) => `${i + 1}. ${m.user.username}`)
        .join('\n') || 'Nenhum advogado cadastrado';
      
      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .addFields(
          { name: '👨‍⚖️ Advogados', value: lawyerList, inline: false }
        )
        .setTimestamp();
      
      const message = await channel.send({ embeds: [embed] });
      
      // Atualiza o message_id no banco
      await query(
        'UPDATE lawyer_list_configs SET message_id = $1 WHERE server_id = $2',
        [message.id, interaction.guildId]
      );
      
      await interaction.reply({
        content: '✅ Lista de advogados configurada com sucesso!',
        ephemeral: true
      });
    } catch (error) {
      console.error('Erro ao configurar lista de advogados:', error);
      await interaction.reply({
        content: '❌ Erro ao configurar a lista de advogados.',
        ephemeral: true
      });
    }
  },
};

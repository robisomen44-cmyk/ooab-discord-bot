import { EmbedBuilder } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Modal: attendance_announcement_config_modal
 * Processa a configuração de anúncio de atendimento
 */
export default {
  id: 'attendance_announcement_config_modal',
  async execute(interaction) {
    try {
      const channelId = interaction.fields.getTextInputValue('announce_channel');
      const openTime = interaction.fields.getTextInputValue('announce_open_time');
      const closeTime = interaction.fields.getTextInputValue('announce_close_time');
      const title = interaction.fields.getTextInputValue('announce_title');
      const description = interaction.fields.getTextInputValue('announce_description');
      
      // Valida
      const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);
      
      if (!channel) {
        return await interaction.reply({
          content: '❌ Canal não encontrado.',
          ephemeral: true
        });
      }
      
      // Salva no banco
      const result = await query(
        `INSERT INTO attendance_announcement_configs (server_id, channel_id, title, description, open_time, close_time)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (server_id) 
         DO UPDATE SET channel_id = $2, title = $3, description = $4, open_time = $5, close_time = $6
         RETURNING *`,
        [interaction.guildId, channelId, title, description, openTime, closeTime]
      );
      
      // Cria primeira mensagem
      const embed = new EmbedBuilder()
        .setColor('#00AA00')
        .setTitle('🟢 Atendimento Aberto')
        .setDescription(description)
        .addFields(
          { name: 'Horário', value: `${openTime} - ${closeTime}` }
        )
        .setTimestamp();
      
      const message = await channel.send({ embeds: [embed] });
      
      // Atualiza message_id
      await query(
        'UPDATE attendance_announcement_configs SET message_id = $1 WHERE server_id = $2',
        [message.id, interaction.guildId]
      );
      
      await interaction.reply({
        content: '✅ Anúncio de atendimento configurado!',
        ephemeral: true
      });
    } catch (error) {
      console.error('Erro ao configurar anúncio:', error);
      await interaction.reply({
        content: '❌ Erro ao configurar o anúncio.',
        ephemeral: true
      });
    }
  },
};

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getMany } from '../database/connection.js';

/**
 * Comando: /logs
 * Mostra os logs do servidor
 */
export default {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Mostra os logs recentes do servidor')
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('Tipo de log')
        .setRequired(false)
        .addChoices(
          { name: 'Entrada de Membros', value: 'member_join' },
          { name: 'Saída de Membros', value: 'member_leave' },
          { name: 'Mensagens Deletadas', value: 'message_deleted' },
          { name: 'Mensagens Editadas', value: 'message_edited' },
          { name: 'Banimentos', value: 'ban' },
          { name: 'Advertências', value: 'warning' },
          { name: 'Canais Criados', value: 'channel_created' },
          { name: 'Canais Deletados', value: 'channel_deleted' },
          { name: 'Cargos Criados', value: 'role_created' },
          { name: 'Cargos Deletados', value: 'role_deleted' }
        )
    ),
  
  async execute(interaction) {
    try {
      const type = interaction.options.getString('tipo');
      
      let query_text = 'SELECT * FROM logs WHERE server_id = $1';
      let params = [interaction.guildId];
      
      if (type) {
        query_text += ' AND type = $2';
        params.push(type);
      }
      
      query_text += ' ORDER BY created_at DESC LIMIT 10';
      
      const logs = await getMany(query_text, params);
      
      if (logs.length === 0) {
        return await interaction.reply({
          content: '✅ Nenhum log encontrado.',
          ephemeral: true,
        });
      }
      
      let description = '';
      for (const log of logs) {
        const date = `<t:${Math.floor(new Date(log.created_at).getTime() / 1000)}:t>`;
        description += `📝 **${log.type}** - ${log.action}\n⏰ ${date}\n\n`;
      }
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('📊 Logs do Servidor')
        .setDescription(description)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao exibir logs:', error);
      await interaction.reply({ content: '❌ Erro ao exibir logs.', ephemeral: true });
    }
  },
};

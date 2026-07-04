import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { logAction } from '../services/databaseService.js';

/**
 * Comando: /clear
 * Limpa mensagens do canal
 */
export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Limpa mensagens do canal')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Quantidade de mensagens a remover')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    
    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);
      
      await logAction({
        serverId: interaction.guildId,
        type: 'clear',
        userId: interaction.user.id,
        action: `Limpeza de ${deleted.size} mensagens`,
        channelId: interaction.channelId,
      });
      
      const embed = new EmbedBuilder()
        .setColor('#00AA00')
        .setTitle('🗑️ Mensagens Removidas')
        .setDescription(`**${deleted.size}** mensagens foram removidas do canal`)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Erro ao limpar mensagens:', error);
      await interaction.reply({ content: '❌ Erro ao limpar as mensagens.', ephemeral: true });
    }
  },
};

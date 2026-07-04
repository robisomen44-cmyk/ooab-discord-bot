import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

/**
 * Comando: /slowmode
 * Define velocidade lenta do chat
 */
export default {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Define o slowmode do canal')
    .addIntegerOption(option =>
      option.setName('segundos')
        .setDescription('Segundos entre mensagens (0 para desativar)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600) // 6 horas
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    try {
      const seconds = interaction.options.getInteger('segundos');
      const channel = interaction.channel;
      
      await channel.setRateLimitPerUser(seconds);
      
      const status = seconds === 0 ? 'desativado' : `${seconds}s`;
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('⏱️ Slowmode Configurado')
        .setDescription(`Slowmode: ${status}`)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao configurar slowmode:', error);
      await interaction.reply({ content: '❌ Erro ao configurar slowmode.', ephemeral: true });
    }
  },
};

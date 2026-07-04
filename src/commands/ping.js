import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

/**
 * Comando: /ping
 * Verifica a latência do bot
 */
export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Verifica a latência do bot'),
  
  async execute(interaction) {
    const latency = interaction.client.ws.ping;
    
    const embed = new EmbedBuilder()
      .setColor('#00AA00')
      .setTitle('🏓 Pong!')
      .setDescription(`Latência do bot: **${latency}ms**`)
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  },
};

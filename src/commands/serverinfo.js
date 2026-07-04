import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

/**
 * Comando: /serverinfo
 * Mostra informações do servidor
 */
export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Mostra informações do servidor'),
  
  async execute(interaction) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner();
    const roles = guild.roles.cache.size;
    const channels = guild.channels.cache.size;
    const members = guild.memberCount;
    const boosts = guild.premiumSubscriptionCount || 0;
    
    const createdDate = `<t:${Math.floor(guild.createdTimestamp / 1000)}:d>`;
    
    const embed = new EmbedBuilder()
      .setColor('#00AA00')
      .setTitle(`🏘️ ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 512 }))
      .setImage(guild.bannerURL({ size: 1024 }))
      .addFields(
        { name: '🆔 ID do Servidor', value: guild.id, inline: true },
        { name: '👤 Proprietário', value: `${owner.user.username}`, inline: true },
        { name: '🔒 Nível de Verificação', value: guild.verificationLevel.toString(), inline: true },
        { name: '📅 Criado em', value: createdDate, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: '👥 Membros', value: String(members), inline: true },
        { name: '📃 Cargos', value: String(roles), inline: true },
        { name: '📁 Canais', value: String(channels), inline: true },
        { name: '🚆 Boosts', value: String(boosts), inline: true },
        { name: '🗑️ Nível do Boost', value: `Nível ${guild.premiumTier}`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Informações do Servidor' });
    
    await interaction.reply({ embeds: [embed] });
  },
};

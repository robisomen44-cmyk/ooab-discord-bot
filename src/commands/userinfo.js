import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

/**
 * Comando: /userinfo
 * Mostra informações de um usuário
 */
export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Mostra informações de um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário a consultar')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    
    if (!member) {
      return await interaction.reply({ content: '❌ Usuário não encontrado no servidor.', ephemeral: true });
    }
    
    const joinedDate = member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:d>` : 'Desconhecido';
    const createdDate = `<t:${Math.floor(user.createdTimestamp / 1000)}:d>`;
    const status = member.presence?.status || 'offline';
    const statusEmoji = {
      'online': '🔴',
      'idle': '🟡',
      'dnd': '🔴',
      'offline': '⚪'
    }[status] || '?';
    
    const roles = member.roles.cache
      .filter(r => r.id !== interaction.guildId)
      .map(r => r)
      .sort((a, b) => b.position - a.position)
      .slice(0, 10)
      .map(r => r.toString())
      .join(' ');
    
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle(`👤 ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ size: 512 }))
      .addFields(
        { name: '🆔 ID', value: user.id, inline: true },
        { name: `${statusEmoji} Status`, value: status.toUpperCase(), inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: '📅 Conta Criada', value: createdDate, inline: true },
        { name: '📅 Entrou no Servidor', value: joinedDate, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: '🎆 Cargos', value: roles || 'Nenhum cargo', inline: false }
      )
      .setTimestamp()
      .setFooter({ text: `Solicitado por ${interaction.user.username}` });
    
    await interaction.reply({ embeds: [embed] });
  },
};

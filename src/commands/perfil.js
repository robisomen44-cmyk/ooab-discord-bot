import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getUserProfile, getRoleHistory, getUserWarnings } from '../services/databaseService.js';

/**
 * Comando: /perfil
 * Mostra o perfil completo de um usuário
 */
export default {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Visualiza o perfil de um usuário')
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
    
    try {
      const profile = await getUserProfile(interaction.guildId, user.id);
      const roleHistory = await getRoleHistory(interaction.guildId, user.id);
      const warnings = await getUserWarnings(interaction.guildId, user.id);
      
      const joinedDate = member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:d>` : 'Desconhecido';
      const createdDate = `<t:${Math.floor(user.createdTimestamp / 1000)}:d>`;
      
      let roleHistoryText = 'Não há histórico disponível';
      if (roleHistory && roleHistory.length > 0) {
        roleHistoryText = roleHistory
          .slice(0, 10)
          .map(rh => `${rh.action === 'added' ? '✅' : '❌'} ${rh.role_name}`)
          .join('\n');
      }
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`👤 Perfil do Usuário`)
        .setThumbnail(user.displayAvatarURL({ size: 512 }))
        .addFields(
          { name: '👤 Nome', value: user.username, inline: true },
          { name: '🆔 ID', value: user.id, inline: true },
          { name: '📅 Data de Criação', value: createdDate, inline: true },
          { name: '📅 Entrou no Servidor', value: joinedDate, inline: true },
          { name: '🎆 Tempo no Servidor', value: member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Desconhecido', inline: true },
          { name: '\u200b', value: '\u200b', inline: true }, // Espaçador
          { name: '🎫 Tickets Abertos', value: String(profile?.total_tickets || 0), inline: true },
          { name: '⚖️ Processos', value: String(profile?.total_processes || 0), inline: true },
          { name: '📅 Audiências', value: String(profile?.total_hearings || 0), inline: true },
          { name: '🗑️ Advertências', value: String(warnings?.length || 0), inline: true },
          { name: '\u200b', value: '\u200b', inline: true }, // Espaçador
          { name: '\u200b', value: '\u200b', inline: true }, // Espaçador
          { name: '📃 Histórico de Cargos', value: roleHistoryText, inline: false }
        )
        .setTimestamp()
        .setFooter({ text: `Solicitado por ${interaction.user.username}` });
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      await interaction.reply({ content: '❌ Erro ao buscar o perfil do usuário.', ephemeral: true });
    }
  },
};

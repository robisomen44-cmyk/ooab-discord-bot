import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { logAction } from '../services/databaseService.js';

/**
 * Comando: /role
 * Adiciona ou remove cargo de um usuário
 */
export default {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Adiciona ou remove cargo')
    .addSubcommand(sub =>
      sub.setName('adicionar')
        .setDescription('Adiciona um cargo a um usuário')
        .addUserOption(option =>
          option.setName('usuario')
            .setDescription('Usuário')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName('cargo')
            .setDescription('Cargo')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName('remover')
        .setDescription('Remove um cargo de um usuário')
        .addUserOption(option =>
          option.setName('usuario')
            .setDescription('Usuário')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName('cargo')
            .setDescription('Cargo')
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  
  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();
      const user = interaction.options.getUser('usuario');
      const role = interaction.options.getRole('cargo');
      const member = await interaction.guild.members.fetch(user.id);
      
      if (subcommand === 'adicionar') {
        await member.roles.add(role);
        
        await logAction({
          serverId: interaction.guildId,
          type: 'role_added',
          userId: interaction.user.id,
          action: `Cargo ${role.name} adicionado a ${user.username}`,
          targetId: user.id,
        });
        
        const embed = new EmbedBuilder()
          .setColor('#00AA00')
          .setTitle('✅ Cargo Adicionado')
          .addFields(
            { name: '👤 Usuário', value: user.username, inline: true },
            { name: '🏷️ Cargo', value: role.name, inline: true }
          )
          .setTimestamp();
        
        return await interaction.reply({ embeds: [embed] });
      }
      
      if (subcommand === 'remover') {
        await member.roles.remove(role);
        
        await logAction({
          serverId: interaction.guildId,
          type: 'role_removed',
          userId: interaction.user.id,
          action: `Cargo ${role.name} removido de ${user.username}`,
          targetId: user.id,
        });
        
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('❌ Cargo Removido')
          .addFields(
            { name: '👤 Usuário', value: user.username, inline: true },
            { name: '🏷️ Cargo', value: role.name, inline: true }
          )
          .setTimestamp();
        
        return await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Erro ao gerenciar cargo:', error);
      await interaction.reply({ content: '❌ Erro ao gerenciar cargo.', ephemeral: true });
    }
  },
};

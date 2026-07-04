import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

/**
 * Comando: /nickname
 * Muda o apelido de um usuário
 */
export default {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Muda o apelido de um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('apelido')
        .setDescription('Novo apelido (deixe vazio para remover)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  
  async execute(interaction) {
    try {
      const user = interaction.options.getUser('usuario');
      const nickname = interaction.options.getString('apelido');
      const member = await interaction.guild.members.fetch(user.id);
      
      await member.setNickname(nickname);
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('✏️ Apelido Alterado')
        .addFields(
          { name: '👤 Usuário', value: user.username, inline: true },
          { name: '📝 Novo Apelido', value: nickname || 'Removido', inline: true }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao alterar apelido:', error);
      await interaction.reply({ content: '❌ Erro ao alterar apelido.', ephemeral: true });
    }
  },
};

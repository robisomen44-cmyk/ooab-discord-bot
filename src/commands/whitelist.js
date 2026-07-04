import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { query } from '../database/connection.js';

/**
 * Comando: /whitelist
 * Gerencia whitelist de usuários
 */
export default {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Gerencia whitelist')
    .addSubcommand(sub =>
      sub.setName('adicionar')
        .setDescription('Adiciona um usuário à whitelist')
        .addUserOption(option =>
          option.setName('usuario')
            .setDescription('Usuário a adicionar')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('motivo')
            .setDescription('Motivo da whitelist')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub.setName('remover')
        .setDescription('Remove um usuário da whitelist')
        .addUserOption(option =>
          option.setName('usuario')
            .setDescription('Usuário a remover')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName('listar')
        .setDescription('Lista usuários na whitelist')
    ),
  
  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();
      
      if (subcommand === 'adicionar') {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo') || 'Sem motivo';
        
        await query(
          `INSERT INTO whitelist (server_id, user_id, reason, added_by)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (server_id, user_id) DO UPDATE SET reason = $3`,
          [interaction.guildId, user.id, reason, interaction.user.id]
        );
        
        const embed = new EmbedBuilder()
          .setColor('#00AA00')
          .setTitle('✅ Usuário Adicionado à Whitelist')
          .addFields(
            { name: '👤 Usuário', value: user.username, inline: true },
            { name: '📝 Motivo', value: reason, inline: true }
          )
          .setTimestamp();
        
        return await interaction.reply({ embeds: [embed] });
      }
      
      if (subcommand === 'remover') {
        const user = interaction.options.getUser('usuario');
        
        await query(
          'DELETE FROM whitelist WHERE server_id = $1 AND user_id = $2',
          [interaction.guildId, user.id]
        );
        
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('❌ Usuário Removido da Whitelist')
          .addFields(
            { name: '👤 Usuário', value: user.username, inline: true }
          )
          .setTimestamp();
        
        return await interaction.reply({ embeds: [embed] });
      }
      
      if (subcommand === 'listar') {
        const result = await query(
          'SELECT * FROM whitelist WHERE server_id = $1',
          [interaction.guildId]
        );
        
        if (result.rowCount === 0) {
          return await interaction.reply({
            content: '❌ Nenhum usuário na whitelist.',
            ephemeral: true,
          });
        }
        
        let description = '';
        for (const entry of result.rows) {
          const user = await interaction.client.users.fetch(entry.user_id).catch(() => null);
          description += `👤 ${user?.username || 'Desconhecido'} - ${entry.reason}\n`;
        }
        
        const embed = new EmbedBuilder()
          .setColor('#0099FF')
          .setTitle('📋 Whitelist do Servidor')
          .setDescription(description)
          .setTimestamp();
        
        return await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Erro ao gerenciar whitelist:', error);
      await interaction.reply({ content: '❌ Erro ao gerenciar whitelist.', ephemeral: true });
    }
  },
};

import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { query, getOne, getMany } from '../database/connection.js';

/**
 * Comando: /novo-processo
 * Cria um novo processo jurídico
 */
export default {
  data: new SlashCommandBuilder()
    .setName('novo-processo')
    .setDescription('Cria um novo processo jurídico')
    .addStringOption(option =>
      option.setName('denunciante')
        .setDescription('Nome do denunciante')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('acusado')
        .setDescription('Nome do acusado')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('descricao')
        .setDescription('Descrição do processo')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('advogado')
        .setDescription('Advogado responsável')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    try {
      const plaintiff = interaction.options.getString('denunciante');
      const defendant = interaction.options.getString('acusado');
      const description = interaction.options.getString('descricao');
      const lawyerUser = interaction.options.getUser('advogado');
      
      // Gera número automático do processo
      const processNumber = `${interaction.guildId.slice(-6)}-${Date.now().toString().slice(-8)}`;
      
      // Salva no banco
      const result = await query(
        `INSERT INTO processes (server_id, process_number, plaintiff_id, defendant_id, lawyer_id, description, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'open')
         RETURNING *`,
        [interaction.guildId, processNumber, plaintiff, defendant, lawyerUser?.id || null, description]
      );
      
      const process = result.rows[0];
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('⚖️ Novo Processo Criado')
        .addFields(
          { name: '📋 Número', value: processNumber, inline: true },
          { name: '🔴 Status', value: 'Aberto', inline: true },
          { name: '👨‍⚖️ Denunciante', value: plaintiff, inline: true },
          { name: '🚨 Acusado', value: defendant, inline: true },
          { name: '💼 Advogado', value: lawyerUser?.username || 'Não atribuído', inline: true },
          { name: '📝 Descrição', value: description, inline: false }
        )
        .setTimestamp()
        .setFooter({ text: `ID: ${process.id}` });
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao criar processo:', error);
      await interaction.reply({ content: '❌ Erro ao criar processo.', ephemeral: true });
    }
  },
};

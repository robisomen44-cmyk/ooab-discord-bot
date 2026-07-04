import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

/**
 * Comando: /painel-verificacao
 * Configura o sistema de verificação
 */
export default {
  data: new SlashCommandBuilder()
    .setName('painel-verificacao')
    .setDescription('Configura o sistema de verificação'),
  
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('verification_config_modal')
      .setTitle('Configurar Sistema de Verificação');
    
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('verify_channel')
          .setLabel('ID do Canal')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('verify_title')
          .setLabel('Título')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Sistema de Verificação')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('verify_description')
          .setLabel('Descrição')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Clique no botão para se verificar')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('verify_add_role')
          .setLabel('ID do Cargo a Adicionar')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('verify_color')
          .setLabel('Cor (hex: #FFFFFF)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('#0099FF')
          .setRequired(true)
      )
    );
    
    await interaction.showModal(modal);
  },
};

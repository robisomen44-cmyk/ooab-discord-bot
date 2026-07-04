import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

/**
 * Comando: /editar-entrada
 * Configura a mensagem de entrada do servidor
 */
export default {
  data: new SlashCommandBuilder()
    .setName('editar-entrada')
    .setDescription('Configura a mensagem de entrada'),
  
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('welcome_config_modal')
      .setTitle('Configurar Mensagem de Entrada');
    
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('welcome_channel')
          .setLabel('ID do Canal')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('welcome_title')
          .setLabel('Título')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Bem-vindo ao servidor!')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('welcome_description')
          .setLabel('Descrição')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Mensagem de boas-vindas')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('welcome_add_role')
          .setLabel('ID do Cargo a Adicionar')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789')
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('welcome_color')
          .setLabel('Cor (hex: #FFFFFF)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('#00AA00')
          .setRequired(true)
      )
    );
    
    await interaction.showModal(modal);
  },
};

import { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

/**
 * Comando: /novo-artigo
 * Cadastra um novo artigo/lei
 */
export default {
  data: new SlashCommandBuilder()
    .setName('novo-artigo')
    .setDescription('Cadastra um novo artigo ou lei'),
  
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('new_article_modal')
      .setTitle('Cadastrar Novo Artigo/Lei');
    
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('article_code')
          .setLabel('Código (ex: Art. 1º, Lei 123)')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('article_title')
          .setLabel('Título')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('article_text')
          .setLabel('Texto do Artigo')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('article_penalty')
          .setLabel('Penalidade (opcional)')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
      )
    );
    
    await interaction.showModal(modal);
  },
};

import { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

/**
 * Comando: /gerar-documento
 * Gera documentos jurídicos
 */
export default {
  data: new SlashCommandBuilder()
    .setName('gerar-documento')
    .setDescription('Gera documentos jurídicos')
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('Tipo de documento')
        .setRequired(true)
        .addChoices(
          { name: 'Petição', value: 'peticao' },
          { name: 'Recurso', value: 'recurso' },
          { name: 'Procuração', value: 'procuracao' },
          { name: 'Habeas Corpus', value: 'habeas_corpus' },
          { name: 'Parecer', value: 'parecer' },
          { name: 'Contrato', value: 'contrato' }
        )
    ),
  
  async execute(interaction) {
    const tipo = interaction.options.getString('tipo');
    
    const labels = {
      'peticao': 'Petição',
      'recurso': 'Recurso',
      'procuracao': 'Procuração',
      'habeas_corpus': 'Habeas Corpus',
      'parecer': 'Parecer',
      'contrato': 'Contrato',
    };
    
    const modal = new ModalBuilder()
      .setCustomId(`generate_doc_${tipo}`)
      .setTitle(`Gerar ${labels[tipo]}`);
    
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('doc_titulo')
          .setLabel('Título')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('doc_partes')
          .setLabel('Partes (separe por vírgula)')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('doc_corpo')
          .setLabel('Corpo do Documento')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('doc_data')
          .setLabel('Data (DD/MM/YYYY)')
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
      )
    );
    
    await interaction.showModal(modal);
  },
};

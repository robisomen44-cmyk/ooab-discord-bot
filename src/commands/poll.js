import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

/**
 * Comando: /poll
 * Cria uma enquete rápida
 */
export default {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Cria uma enquete')
    .addStringOption(option =>
      option.setName('pergunta')
        .setDescription('Pergunta da enquete')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('opcao1')
        .setDescription('Opção 1')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('opcao2')
        .setDescription('Opção 2')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('opcao3')
        .setDescription('Opção 3')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    const question = interaction.options.getString('pergunta');
    const option1 = interaction.options.getString('opcao1');
    const option2 = interaction.options.getString('opcao2');
    const option3 = interaction.options.getString('opcao3');
    
    const options = [option1, option2];
    if (option3) options.push(option3);
    
    let description = `**${question}**\n\n`;
    const reactions = ['①', '②', '③', '④', '⑤'];
    
    for (let i = 0; i < options.length; i++) {
      description += `${reactions[i]} ${options[i]}\n`;
    }
    
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🗳️ Enquete')
      .setDescription(description)
      .setTimestamp();
    
    const message = await interaction.reply({ embeds: [embed], fetchReply: true });
    
    // Adiciona reações
    for (let i = 0; i < options.length; i++) {
      await message.react(reactions[i]);
    }
  },
};

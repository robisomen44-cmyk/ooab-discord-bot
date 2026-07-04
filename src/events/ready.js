import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

/**
 * Evento: ready
 * Executado quando o bot está pronto
 */
export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`\n✅ Bot online como ${client.user.username}`);
    console.log(`🆔 ID: ${client.user.id}`);
    console.log(`📊 Servidores: ${client.guilds.cache.size}`);
    console.log(`👥 Usuários: ${client.users.cache.size}\n`);
  },
};

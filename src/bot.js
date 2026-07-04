import { Client, GatewayIntentBits, Collection, ChannelType, ActivityType } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './database/init.js';
import { getDatabase } from './database/connection.js';

// Carrega variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Cliente Discord com intents necessários para todas as funcionalidades
 */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.AutoModerationConfiguration,
  ],
});

/**
 * Coleções para armazenar comandos, eventos e dados em cache
 */
client.commands = new Collection();
client.events = new Collection();
client.modals = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

/**
 * Carrega todos os comandos do diretório de comandos
 */
async function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  
  if (!fs.existsSync(commandsPath)) {
    console.log('📁 Diretório de comandos não encontrado. Criando...');
    fs.mkdirSync(commandsPath, { recursive: true });
    return;
  }

  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const command = await import(`file://${filePath}`);
      if (command.default?.data?.name) {
        client.commands.set(command.default.data.name, command.default);
        console.log(`✅ Comando carregado: ${command.default.data.name}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar comando ${file}:`, error);
    }
  }
}

/**
 * Carrega todos os eventos do diretório de eventos
 */
async function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');
  
  if (!fs.existsSync(eventsPath)) {
    console.log('📁 Diretório de eventos não encontrado. Criando...');
    fs.mkdirSync(eventsPath, { recursive: true });
    return;
  }

  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    try {
      const event = await import(`file://${filePath}`);
      if (event.default?.name) {
        if (event.default.once) {
          client.once(event.default.name, (...args) => event.default.execute(...args));
        } else {
          client.on(event.default.name, (...args) => event.default.execute(...args));
        }
        console.log(`✅ Evento carregado: ${event.default.name}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar evento ${file}:`, error);
    }
  }
}

/**
 * Carrega todos os modals do diretório de modals
 */
async function loadModals() {
  const modalsPath = path.join(__dirname, 'modals');
  
  if (!fs.existsSync(modalsPath)) {
    console.log('📁 Diretório de modals não encontrado. Criando...');
    fs.mkdirSync(modalsPath, { recursive: true });
    return;
  }

  const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));

  for (const file of modalFiles) {
    const filePath = path.join(modalsPath, file);
    try {
      const modal = await import(`file://${filePath}`);
      if (modal.default?.id) {
        client.modals.set(modal.default.id, modal.default);
        console.log(`✅ Modal carregado: ${modal.default.id}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar modal ${file}:`, error);
    }
  }
}

/**
 * Carrega todos os botões do diretório de buttons
 */
async function loadButtons() {
  const buttonsPath = path.join(__dirname, 'buttons');
  
  if (!fs.existsSync(buttonsPath)) {
    console.log('📁 Diretório de botões não encontrado. Criando...');
    fs.mkdirSync(buttonsPath, { recursive: true });
    return;
  }

  const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

  for (const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    try {
      const button = await import(`file://${filePath}`);
      if (button.default?.id) {
        client.buttons.set(button.default.id, button.default);
        console.log(`✅ Botão carregado: ${button.default.id}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar botão ${file}:`, error);
    }
  }
}

/**
 * Carrega todos os select menus do diretório de selectMenus
 */
async function loadSelectMenus() {
  const selectMenusPath = path.join(__dirname, 'selectMenus');
  
  if (!fs.existsSync(selectMenusPath)) {
    console.log('📁 Diretório de select menus não encontrado. Criando...');
    fs.mkdirSync(selectMenusPath, { recursive: true });
    return;
  }

  const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));

  for (const file of selectMenuFiles) {
    const filePath = path.join(selectMenusPath, file);
    try {
      const selectMenu = await import(`file://${filePath}`);
      if (selectMenu.default?.id) {
        client.selectMenus.set(selectMenu.default.id, selectMenu.default);
        console.log(`✅ Select Menu carregado: ${selectMenu.default.id}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar select menu ${file}:`, error);
    }
  }
}

/**
 * Função de inicialização
 */
async function initialize() {
  try {
    console.log('🚀 Iniciando OAB Discord Bot...');
    
    // Inicializa banco de dados
    console.log('🗄️  Inicializando banco de dados...');
    await initializeDatabase();
    console.log('✅ Banco de dados inicializado');
    
    // Carrega componentes
    console.log('📦 Carregando componentes...');
    await loadCommands();
    await loadEvents();
    await loadModals();
    await loadButtons();
    await loadSelectMenus();
    
    // Faz login no Discord
    console.log('🔐 Autenticando com Discord...');
    await client.login(process.env.BOT_TOKEN);
    
  } catch (error) {
    console.error('❌ Erro durante a inicialização:', error);
    process.exit(1);
  }
}

// Evento de ready
client.once('ready', () => {
  console.log(`\n✅ Bot online como ${client.user.username}#${client.user.discriminator}`);
  console.log(`🆔 ID: ${client.user.id}`);
  console.log(`📊 Servidores: ${client.guilds.cache.size}`);
  console.log(`👥 Usuários: ${client.users.cache.size}\n`);
  
  // Define status do bot
  client.user.setActivity('⚖️ Servindo a OAB', { type: ActivityType.Custom });
});

// Manipulador de interações (comandos slash, botões, modals, etc)
client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) {
        await command.execute(interaction);
      }
    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (button) {
        await button.execute(interaction);
      }
    } else if (interaction.isStringSelectMenu()) {
      const selectMenu = client.selectMenus.get(interaction.customId);
      if (selectMenu) {
        await selectMenu.execute(interaction);
      }
    } else if (interaction.isModalSubmit()) {
      const modal = client.modals.get(interaction.customId);
      if (modal) {
        await modal.execute(interaction);
      }
    }
  } catch (error) {
    console.error('Erro ao processar interação:', error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ Ocorreu um erro ao processar sua solicitação.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Ocorreu um erro ao processar sua solicitação.', ephemeral: true });
    }
  }
});

// Manipulador de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejection não tratada:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exceção não tratada:', error);
});

// Inicia o bot
initialize();

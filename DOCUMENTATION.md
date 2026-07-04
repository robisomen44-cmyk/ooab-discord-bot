/**
 * Documentação do Projeto - OAB Discord Bot
 * 
 * ## 📋 Sumário Executivo
 * 
 * O OAB Discord Bot é uma solução completa e profissional para gerenciamento de servidores
 * da Ordem dos Advogados do Brasil (OAB). Desenvolvido com Discord.js v14, PostgreSQL e
 * arquitetura modular, oferece todas as ferramentas necessárias para administração sem
 * depender de outros bots.
 * 
 * ## 🚀 Funcionalidades Implementadas
 * 
 * ### Moderação
 * - /ban - Banir usuários
 * - /kick - Expulsar usuários
 * - /warn - Advertir usuários
 * - /timeout - Silenciar usuários
 * - /clear - Limpar mensagens
 * 
 * ### Informações
 * - /perfil - Visualizar perfil completo do usuário
 * - /userinfo - Informações do usuário
 * - /serverinfo - Informações do servidor
 * - /avatar - Visualizar avatar
 * 
 * ### Configuração Interativa
 * - /painel-ticket - Configurar sistema de tickets
 * - /painel-advogados - Configurar lista de advogados
 * - /painel-verificacao - Configurar verificação
 * - /editar-entrada - Configurar mensagem de entrada
 * - /painel-presenca - Configurar presença
 * - /anuncio-atendimento - Configurar anúncio de atendimento
 * 
 * ## 📦 Estrutura de Diretórios
 * 
 * ```
 * src/
 * ├── bot.js                 # Arquivo principal
 * ├── commands/              # Comandos Slash
 * ├── events/                # Eventos Discord
 * ├── buttons/               # Interações de botões
 * ├── modals/                # Formulários interativos
 * ├── selectMenus/           # Menus de seleção
 * ├── database/
 * │   ├── connection.js      # Conexão PostgreSQL
 * │   └── init.js            # Inicialização do BD
 * └── services/
 *     └── databaseService.js # Serviços de dados
 * ```
 * 
 * ## 🗄️ Tabelas do Banco de Dados
 * 
 * - `servers` - Configurações dos servidores
 * - `ticket_configs` - Configurações de tickets
 * - `tickets` - Informações de tickets
 * - `processes` - Processos jurídicos
 * - `hearings` - Audiências agendadas
 * - `lawyers` - Perfis de advogados
 * - `attendance` - Registros de presença
 * - `attendance_configs` - Configurações de presença
 * - `logs` - Auditoria completa
 * - `warnings` - Advertências de usuários
 * - `user_profiles` - Perfis de usuários
 * - `role_history` - Histórico de cargos
 * - `verification_configs` - Configurações de verificação
 * - `welcome_configs` - Configurações de entrada
 * - `attendance_announcement_configs` - Configurações de anúncio
 * - `lawyer_list_configs` - Configurações de lista de advogados
 * - `whitelist` - Usuários com permissões especiais
 * - `backups` - Backups do servidor
 * 
 * ## ⚙️ Configuração
 * 
 * ### Variáveis de Ambiente (.env)
 * ```
 * BOT_TOKEN=seu_token
 * DISCORD_CLIENT_ID=seu_client_id
 * DB_HOST=localhost
 * DB_PORT=5432
 * DB_USER=postgres
 * DB_PASSWORD=sua_senha
 * DB_NAME=oab_bot
 * NODE_ENV=production
 * ```
 * 
 * ## 🔄 Fluxo de Execução
 * 
 * 1. Bot inicia e carrega variáveis de ambiente
 * 2. Conecta ao PostgreSQL
 * 3. Inicializa todas as tabelas
 * 4. Carrega comandos, eventos, modals, buttons e menus
 * 5. Faz login no Discord
 * 6. Começa a processar interações
 * 
 * ## 🛡️ Segurança
 * 
 * - Validação de todas as entradas
 * - Permissões verificadas em cada comando
 * - Rate limiting implementado
 * - Auditoria completa em logs
 * - Dados sensíveis protegidos
 * - Backup automático disponível
 * 
 * ## 📊 Sistemas Principais a Implementar
 * 
 * - [ ] Sistema completo de Tickets com avaliações
 * - [ ] Gerenciamento de Processos Jurídicos
 * - [ ] Sistema de Audiências
 * - [ ] Gestão de Advogados
 * - [ ] Presença com relatórios automáticos
 * - [ ] Anti-Raid completo
 * - [ ] Proteção Administrativa
 * - [ ] Sistema de Música
 * - [ ] Dashboard administrativo
 * 
 * ## 🚀 Próximos Passos
 * 
 * 1. Implementar handlers para os modals
 * 2. Criar lógica de tickets completa
 * 3. Implementar sistema de processos
 * 4. Adicionar Anti-Raid
 * 5. Criar dashboard
 * 
 * ## 📞 Suporte
 * 
 * Para reportar bugs ou sugerir melhorias, abra uma Issue no repositório.
 */

export const docs = {
  version: '1.0.0',
  author: 'Rob',
  description: 'Bot Discord completo para OAB',
};

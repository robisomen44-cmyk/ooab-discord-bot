import { query, getOne } from './connection.js';

/**
 * Inicializa todas as tabelas do banco de dados
 */
export async function initializeDatabase() {
  try {
    console.log('🗄️  Criando tabelas...');
    
    // Tabela de configurações dos servidores
    await query(`
      CREATE TABLE IF NOT EXISTS servers (
        id BIGINT PRIMARY KEY,
        name VARCHAR(255),
        owner_id BIGINT,
        prefix VARCHAR(5) DEFAULT '!',
        language VARCHAR(10) DEFAULT 'pt-BR',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Tabela de configurações de tickets
    await query(`
      CREATE TABLE IF NOT EXISTS ticket_configs (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        channel_id BIGINT,
        category_id BIGINT,
        title VARCHAR(255),
        description TEXT,
        color VARCHAR(7),
        support_role_id BIGINT,
        authorized_role_id BIGINT,
        evaluation_channel_id BIGINT,
        transcript_channel_id BIGINT,
        open_message TEXT,
        close_message TEXT,
        button_emoji VARCHAR(10),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(server_id)
      );
    `);
    
    // Tabela de tickets
    await query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(20) UNIQUE,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        channel_id BIGINT,
        user_id BIGINT,
        support_id BIGINT,
        status VARCHAR(20) DEFAULT 'open',
        opened_at TIMESTAMP DEFAULT NOW(),
        closed_at TIMESTAMP,
        evaluation_rating INT,
        evaluation_comment TEXT,
        evaluation_date TIMESTAMP,
        transcript TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Tabela de processos jurídicos
    await query(`
      CREATE TABLE IF NOT EXISTS processes (
        id SERIAL PRIMARY KEY,
        process_number VARCHAR(30) UNIQUE,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        plaintiff_id BIGINT,
        defendant_id BIGINT,
        lawyer_id BIGINT,
        judge_id BIGINT,
        status VARCHAR(30) DEFAULT 'open',
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Tabela de audiências
    await query(`
      CREATE TABLE IF NOT EXISTS hearings (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        process_id INT REFERENCES processes(id) ON DELETE CASCADE,
        date TIMESTAMP,
        judge_id BIGINT,
        lawyer_id BIGINT,
        status VARCHAR(30) DEFAULT 'scheduled',
        decision TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Tabela de advogados
    await query(`
      CREATE TABLE IF NOT EXISTS lawyers (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        user_id BIGINT,
        oab_number VARCHAR(20),
        specialization VARCHAR(100),
        join_date TIMESTAMP DEFAULT NOW(),
        average_rating DECIMAL(3,2) DEFAULT 0,
        warnings INT DEFAULT 0,
        suspensions INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(server_id, user_id)
      );
    `);
    
    // Tabela de presença
    await query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        user_id BIGINT,
        date DATE,
        shift VARCHAR(20),
        time_marked TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(server_id, user_id, date, shift)
      );
    `);
    
    // Tabela de configuração de presença
    await query(`
      CREATE TABLE IF NOT EXISTS attendance_configs (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE UNIQUE,
        channel_id BIGINT,
        authorized_role_id BIGINT,
        morning_start TIME,
        morning_end TIME,
        afternoon_start TIME,
        afternoon_end TIME,
        report_time TIME,
        report_channel_id BIGINT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Tabela de logs
    await query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        type VARCHAR(50),
        user_id BIGINT,
        action VARCHAR(255),
        before_value TEXT,
        after_value TEXT,
        channel_id BIGINT,
        target_id BIGINT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS logs_server_id_idx ON logs(server_id);
      CREATE INDEX IF NOT EXISTS logs_created_at_idx ON logs(created_at);
    `);
    
    // Tabela de advertências
    await query(`
      CREATE TABLE IF NOT EXISTS warnings (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        user_id BIGINT,
        reason VARCHAR(255),
        moderator_id BIGINT,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS warnings_user_id_idx ON warnings(user_id);
      CREATE INDEX IF NOT EXISTS warnings_server_id_idx ON warnings(server_id);
    `);
    
    // Tabela de perfil de usuário
    await query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        user_id BIGINT,
        total_tickets INT DEFAULT 0,
        total_processes INT DEFAULT 0,
        total_hearings INT DEFAULT 0,
        total_attendance INT DEFAULT 0,
        last_activity TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(server_id, user_id)
      );
    `);
    
    // Tabela de histórico de cargos
    await query(`
      CREATE TABLE IF NOT EXISTS role_history (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        user_id BIGINT,
        role_id BIGINT,
        role_name VARCHAR(255),
        action VARCHAR(20),
        added_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS role_history_user_idx ON role_history(user_id);
    `);
    
    // Tabela de configurações de verificação
    await query(`
      CREATE TABLE IF NOT EXISTS verification_configs (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE UNIQUE,
        channel_id BIGINT,
        title VARCHAR(255),
        description TEXT,
        color VARCHAR(7),
        add_role_id BIGINT,
        remove_role_id BIGINT,
        roblox_group_id BIGINT,
        roblox_min_rank INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Tabela de configurações de entrada
    await query(`
      CREATE TABLE IF NOT EXISTS welcome_configs (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE UNIQUE,
        channel_id BIGINT,
        title VARCHAR(255),
        description TEXT,
        color VARCHAR(7),
        add_role_id BIGINT,
        remove_role_id BIGINT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Tabela de configurações de atendimento
    await query(`
      CREATE TABLE IF NOT EXISTS attendance_announcement_configs (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE UNIQUE,
        channel_id BIGINT,
        title VARCHAR(255),
        description TEXT,
        color VARCHAR(7),
        open_time TIME,
        close_time TIME,
        message_id BIGINT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Tabela de configurações de lista de advogados
    await query(`
      CREATE TABLE IF NOT EXISTS lawyer_list_configs (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE UNIQUE,
        channel_id BIGINT,
        title VARCHAR(255),
        description TEXT,
        color VARCHAR(7),
        lawyer_role_id BIGINT,
        message_id BIGINT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Tabela de whitelist
    await query(`
      CREATE TABLE IF NOT EXISTS whitelist (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        user_id BIGINT,
        reason VARCHAR(255),
        added_by BIGINT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(server_id, user_id)
      );
    `);
    
    // Tabela de backup
    await query(`
      CREATE TABLE IF NOT EXISTS backups (
        id SERIAL PRIMARY KEY,
        server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
        backup_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        created_by BIGINT
      );
      
      CREATE INDEX IF NOT EXISTS backups_server_id_idx ON backups(server_id);
    `);
    
    console.log('✅ Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

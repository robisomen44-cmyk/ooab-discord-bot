import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * Pool de conexão com PostgreSQL
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'oab_bot',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

/**
 * Trata erros de conexão
 */
pool.on('error', (err) => {
  console.error('Erro não esperado no pool de conexão', err);
});

/**
 * Retorna uma conexão do pool
 */
export async function getDatabase() {
  return pool;
}

/**
 * Executa query com a pool
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('✅ Query executada:', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ Erro na query:', error);
    throw error;
  }
}

/**
 * Obtém uma única linha
 */
export async function getOne(text, params) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Obtém múltiplas linhas
 */
export async function getMany(text, params) {
  const result = await query(text, params);
  return result.rows || [];
}

export default pool;

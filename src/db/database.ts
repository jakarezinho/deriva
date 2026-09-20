// SQLite via sql.js (WebAssembly) com persistência em IndexedDB
import initSqlJs, { type Database } from 'sql.js';
// @ts-ignore - Importar URL do WASM processada pelo Vite
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

const DB_NAME = 'derivas_urbanas_db';
const DB_STORE = 'sqlite_data';
const DB_FILE_KEY = 'main_db';

let db: Database | null = null;
let initPromise: Promise<void> | null = null;
let initError: string | null = null;

// Verificar se o banco foi inicializado
export function isDatabaseReady(): boolean {
  return db !== null;
}

export function getInitError(): string | null {
  return initError;
}

// Inicializar banco de dados
export async function initDatabase(): Promise<void> {
  if (db) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Carregar sql.js com WASM via URL processada pelo Vite
      const wasmResponse = await fetch(wasmUrl);
      const wasmBuffer = await wasmResponse.arrayBuffer();
      const SQL = await initSqlJs({
        wasmBinary: wasmBuffer
      });

      // Tentar carregar banco existente do IndexedDB
      const savedDb = await loadFromIndexedDB();
      
      if (savedDb) {
        db = new SQL.Database(savedDb);
      } else {
        // Criar novo banco
        db = new SQL.Database();
        createTables();
        await saveToIndexedDB();
      }
    } catch (error) {
      initError = error instanceof Error ? error.message : 'Erro desconhecido ao inicializar banco';
      console.error('Erro ao inicializar banco de dados:', error);
      throw error;
    }
  })();

  return initPromise;
}

// Criar tabelas
function createTables() {
  if (!db) throw new Error('Banco não inicializado');

  db.run(`
    CREATE TABLE IF NOT EXISTS derivas (
      id TEXT PRIMARY KEY,
      data_inicio TEXT NOT NULL,
      data_fim TEXT,
      duracao INTEGER,
      local_inicio TEXT,
      local_fim TEXT,
      notas TEXT,
      humor INTEGER CHECK(humor >= 1 AND humor <= 5),
      clima TEXT,
      distancia REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS prompts_seguidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deriva_id TEXT NOT NULL,
      prompt_id INTEGER NOT NULL,
      prompt_text TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (deriva_id) REFERENCES derivas(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS descobertas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deriva_id TEXT NOT NULL,
      texto TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (deriva_id) REFERENCES derivas(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Inserir config padrão se não existir
  db.run(`INSERT OR IGNORE INTO config (key, value) VALUES ('nomeDerivante', 'Derivante')`);
  db.run(`INSERT OR IGNORE INTO config (key, value) VALUES ('cidadeBase', '')`);
  db.run(`INSERT OR IGNORE INTO config (key, value) VALUES ('temaPreferido', '')`);
}

// Salvar banco no IndexedDB
async function saveToIndexedDB(): Promise<void> {
  if (!db) return;

  const data = db.export();
  const buffer = data.buffer as ArrayBuffer;

  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => {
        console.warn('IndexedDB não disponível, dados não serão persistidos');
        resolve(); // Não falhar, apenas avisar
      };
      request.onsuccess = () => {
        const database = request.result;
        
        if (!database.objectStoreNames.contains(DB_STORE)) {
          database.close();
          resolve();
          return;
        }
        
        const transaction = database.transaction([DB_STORE], 'readwrite');
        const store = transaction.objectStore(DB_STORE);
        
        store.put(buffer, DB_FILE_KEY);
        
        transaction.oncomplete = () => {
          database.close();
          resolve();
        };
        transaction.onerror = () => {
          database.close();
          resolve(); // Não falhar
        };
      };

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(DB_STORE)) {
          database.createObjectStore(DB_STORE);
        }
      };
    } catch (e) {
      console.warn('Erro ao salvar no IndexedDB:', e);
      resolve(); // Não falhar
    }
  });
}

// Carregar banco do IndexedDB
async function loadFromIndexedDB(): Promise<Uint8Array | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => resolve(null);
      request.onsuccess = () => {
        const database = request.result;
        
        if (!database.objectStoreNames.contains(DB_STORE)) {
          database.close();
          resolve(null);
          return;
        }
        
        const transaction = database.transaction([DB_STORE], 'readonly');
        const store = transaction.objectStore(DB_STORE);
        
        const getRequest = store.get(DB_FILE_KEY);
        
        getRequest.onsuccess = () => {
          database.close();
          resolve(getRequest.result ? new Uint8Array(getRequest.result) : null);
        };
        getRequest.onerror = () => {
          database.close();
          resolve(null);
        };
      };

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(DB_STORE)) {
          database.createObjectStore(DB_STORE);
        }
      };
    } catch (e) {
      resolve(null);
    }
  });
}

// Helper para garantir que o banco está pronto
function ensureDb(): Database {
  if (!db) throw new Error('Banco não inicializado. Aguarde a inicialização.');
  return db;
}

// Exportar banco como JSON
export function exportDatabase(): string {
  const database = ensureDb();

  const derivas = getAllDerivas();
  const config = getConfig();

  return JSON.stringify({
    derivas,
    config,
    exportDate: new Date().toISOString(),
    version: '1.0'
  }, null, 2);
}

// Importar banco de JSON
export async function importDatabase(jsonString: string): Promise<boolean> {
  const database = ensureDb();

  try {
    const data = JSON.parse(jsonString);
    
    // Limpar dados existentes
    database.run('DELETE FROM prompts_seguidos');
    database.run('DELETE FROM descobertas');
    database.run('DELETE FROM derivas');

    // Importar derivas
    if (data.derivas && Array.isArray(data.derivas)) {
      for (const deriva of data.derivas) {
        database.run(
          `INSERT INTO derivas (id, data_inicio, data_fim, duracao, local_inicio, local_fim, notas, humor, clima, distancia)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            deriva.id,
            deriva.data_inicio || deriva.dataInicio,
            deriva.data_fim || deriva.dataFim || null,
            deriva.duracao || null,
            deriva.local_inicio || deriva.localInicio || null,
            deriva.local_fim || deriva.localFim || null,
            deriva.notas || null,
            deriva.humor || 3,
            deriva.clima || null,
            deriva.distancia || null
          ]
        );

        // Importar prompts seguidos
        const promptsList = deriva.promptsSeguidos || deriva.prompts_seguidos || [];
        if (Array.isArray(promptsList)) {
          for (const prompt of promptsList) {
            database.run(
              `INSERT INTO prompts_seguidos (deriva_id, prompt_id, prompt_text, timestamp)
               VALUES (?, ?, ?, ?)`,
              [deriva.id, prompt.promptId || prompt.prompt_id, prompt.promptText || prompt.prompt_text, prompt.timestamp]
            );
          }
        }

        // Importar descobertas
        const descList = deriva.descobertas || [];
        if (Array.isArray(descList)) {
          for (const descoberta of descList) {
            database.run(
              `INSERT INTO descobertas (deriva_id, texto) VALUES (?, ?)`,
              [deriva.id, typeof descoberta === 'string' ? descoberta : descoberta.texto]
            );
          }
        }
      }
    }

    // Importar config
    if (data.config) {
      database.run('UPDATE config SET value = ? WHERE key = ?', [data.config.nomeDerivante || 'Derivante', 'nomeDerivante']);
      database.run('UPDATE config SET value = ? WHERE key = ?', [data.config.cidadeBase || '', 'cidadeBase']);
      database.run('UPDATE config SET value = ? WHERE key = ?', [data.config.temaPreferido || '', 'temaPreferido']);
    }

    await saveToIndexedDB();
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
}

// ============ TIPOS ============

export interface DerivaDB {
  id: string;
  data_inicio: string;
  data_fim: string | null;
  duracao: number | null;
  local_inicio: string | null;
  local_fim: string | null;
  notas: string | null;
  humor: number;
  clima: string | null;
  distancia: number | null;
}

export interface DerivaCompleta extends DerivaDB {
  promptsSeguidos: Array<{
    promptId: number;
    promptText: string;
    timestamp: string;
  }>;
  descobertas: string[];
}

// ============ CRUD DERIVAS ============

export function getAllDerivas(): DerivaCompleta[] {
  const database = ensureDb();

  const result = database.exec('SELECT * FROM derivas ORDER BY data_inicio DESC');
  if (result.length === 0) return [];

  const derivas: DerivaCompleta[] = result[0].values.map((row: any) => {
    const deriva: DerivaDB = {
      id: row[0] as string,
      data_inicio: row[1] as string,
      data_fim: row[2] as string | null,
      duracao: row[3] as number | null,
      local_inicio: row[4] as string | null,
      local_fim: row[5] as string | null,
      notas: row[6] as string | null,
      humor: row[7] as number,
      clima: row[8] as string | null,
      distancia: row[9] as number | null,
    };

    // Buscar prompts seguidos
    const promptsResult = database.exec(
      'SELECT prompt_id, prompt_text, timestamp FROM prompts_seguidos WHERE deriva_id = ? ORDER BY timestamp',
      [deriva.id]
    );
    const promptsSeguidos = promptsResult.length > 0
      ? promptsResult[0].values.map((p: any) => ({
          promptId: p[0] as number,
          promptText: p[1] as string,
          timestamp: p[2] as string,
        }))
      : [];

    // Buscar descobertas
    const descResult = database.exec(
      'SELECT texto FROM descobertas WHERE deriva_id = ? ORDER BY created_at',
      [deriva.id]
    );
    const descobertas = descResult.length > 0
      ? descResult[0].values.map((d: any) => d[0] as string)
      : [];

    return {
      ...deriva,
      promptsSeguidos,
      descobertas,
    };
  });

  return derivas;
}

export function getDerivaById(id: string): DerivaCompleta | null {
  const database = ensureDb();

  const result = database.exec('SELECT * FROM derivas WHERE id = ?', [id]);
  if (result.length === 0 || result[0].values.length === 0) return null;

  const row = result[0].values[0];
  const deriva: DerivaDB = {
    id: row[0] as string,
    data_inicio: row[1] as string,
    data_fim: row[2] as string | null,
    duracao: row[3] as number | null,
    local_inicio: row[4] as string | null,
    local_fim: row[5] as string | null,
    notas: row[6] as string | null,
    humor: row[7] as number,
    clima: row[8] as string | null,
    distancia: row[9] as number | null,
  };

  // Buscar prompts seguidos
  const promptsResult = database.exec(
    'SELECT prompt_id, prompt_text, timestamp FROM prompts_seguidos WHERE deriva_id = ? ORDER BY timestamp',
    [id]
  );
  const promptsSeguidos = promptsResult.length > 0
    ? promptsResult[0].values.map((p: any) => ({
        promptId: p[0] as number,
        promptText: p[1] as string,
        timestamp: p[2] as string,
      }))
    : [];

  // Buscar descobertas
  const descResult = database.exec(
    'SELECT texto FROM descobertas WHERE deriva_id = ? ORDER BY created_at',
    [id]
  );
  const descobertas = descResult.length > 0
    ? descResult[0].values.map((d: any) => d[0] as string)
    : [];

  return {
    ...deriva,
    promptsSeguidos,
    descobertas,
  };
}

export async function createDeriva(deriva: DerivaCompleta): Promise<void> {
  const database = ensureDb();

  database.run(
    `INSERT INTO derivas (id, data_inicio, data_fim, duracao, local_inicio, local_fim, notas, humor, clima, distancia)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      deriva.id,
      deriva.data_inicio,
      deriva.data_fim,
      deriva.duracao,
      deriva.local_inicio,
      deriva.local_fim,
      deriva.notas,
      deriva.humor,
      deriva.clima,
      deriva.distancia,
    ]
  );

  // Inserir prompts seguidos
  for (const prompt of deriva.promptsSeguidos) {
    database.run(
      `INSERT INTO prompts_seguidos (deriva_id, prompt_id, prompt_text, timestamp)
       VALUES (?, ?, ?, ?)`,
      [deriva.id, prompt.promptId, prompt.promptText, prompt.timestamp]
    );
  }

  // Inserir descobertas
  for (const descoberta of deriva.descobertas) {
    database.run(
      `INSERT INTO descobertas (deriva_id, texto) VALUES (?, ?)`,
      [deriva.id, descoberta]
    );
  }

  await saveToIndexedDB();
}

export async function updateDeriva(deriva: DerivaCompleta): Promise<void> {
  const database = ensureDb();

  database.run(
    `UPDATE derivas SET 
      data_fim = ?, duracao = ?, local_inicio = ?, local_fim = ?, 
      notas = ?, humor = ?, clima = ?, distancia = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      deriva.data_fim,
      deriva.duracao,
      deriva.local_inicio,
      deriva.local_fim,
      deriva.notas,
      deriva.humor,
      deriva.clima,
      deriva.distancia,
      deriva.id,
    ]
  );

  // Atualizar prompts seguidos (deletar e reinserir)
  database.run('DELETE FROM prompts_seguidos WHERE deriva_id = ?', [deriva.id]);
  for (const prompt of deriva.promptsSeguidos) {
    database.run(
      `INSERT INTO prompts_seguidos (deriva_id, prompt_id, prompt_text, timestamp)
       VALUES (?, ?, ?, ?)`,
      [deriva.id, prompt.promptId, prompt.promptText, prompt.timestamp]
    );
  }

  // Atualizar descobertas (deletar e reinserir)
  database.run('DELETE FROM descobertas WHERE deriva_id = ?', [deriva.id]);
  for (const descoberta of deriva.descobertas) {
    database.run(
      `INSERT INTO descobertas (deriva_id, texto) VALUES (?, ?)`,
      [deriva.id, descoberta]
    );
  }

  await saveToIndexedDB();
}

export async function deleteDeriva(id: string): Promise<void> {
  const database = ensureDb();

  // Deletar dados relacionados primeiro (por segurança)
  database.run('DELETE FROM prompts_seguidos WHERE deriva_id = ?', [id]);
  database.run('DELETE FROM descobertas WHERE deriva_id = ?', [id]);
  database.run('DELETE FROM derivas WHERE id = ?', [id]);
  
  await saveToIndexedDB();
}

// ============ CONFIG ============

export interface DerivaConfig {
  nomeDerivante: string;
  cidadeBase: string;
  temaPreferido: string;
}

export function getConfig(): DerivaConfig {
  const database = ensureDb();

  const result = database.exec('SELECT key, value FROM config');
  if (result.length === 0) {
    return { nomeDerivante: 'Derivante', cidadeBase: '', temaPreferido: '' };
  }

  const config: Record<string, string> = {};
  result[0].values.forEach((row: any) => {
    config[row[0] as string] = row[1] as string;
  });

  return {
    nomeDerivante: config.nomeDerivante || 'Derivante',
    cidadeBase: config.cidadeBase || '',
    temaPreferido: config.temaPreferido || '',
  };
}

export async function saveConfig(config: DerivaConfig): Promise<void> {
  const database = ensureDb();

  database.run('UPDATE config SET value = ? WHERE key = ?', [config.nomeDerivante, 'nomeDerivante']);
  database.run('UPDATE config SET value = ? WHERE key = ?', [config.cidadeBase, 'cidadeBase']);
  database.run('UPDATE config SET value = ? WHERE key = ?', [config.temaPreferido, 'temaPreferido']);

  await saveToIndexedDB();
}

// ============ ESTATÍSTICAS ============

export function getStats() {
  const database = ensureDb();

  const totalResult = database.exec('SELECT COUNT(*) FROM derivas');
  const totalDerivas = totalResult.length > 0 && totalResult[0].values.length > 0 
    ? (totalResult[0].values[0][0] as number) || 0 
    : 0;

  const promptsResult = database.exec('SELECT COUNT(*) FROM prompts_seguidos');
  const totalPrompts = promptsResult.length > 0 && promptsResult[0].values.length > 0 
    ? (promptsResult[0].values[0][0] as number) || 0 
    : 0;

  const tempoResult = database.exec('SELECT COALESCE(SUM(duracao), 0) FROM derivas');
  const totalMinutos = tempoResult.length > 0 && tempoResult[0].values.length > 0 
    ? (tempoResult[0].values[0][0] as number) || 0 
    : 0;

  const humorResult = database.exec('SELECT COALESCE(AVG(humor), 0) FROM derivas');
  const mediaHumorVal = humorResult.length > 0 && humorResult[0].values.length > 0 
    ? (humorResult[0].values[0][0] as number) || 0 
    : 0;
  const mediaHumor = mediaHumorVal.toFixed(1);

  const descResult = database.exec('SELECT COUNT(*) FROM descobertas');
  const totalDescobertas = descResult.length > 0 && descResult[0].values.length > 0 
    ? (descResult[0].values[0][0] as number) || 0 
    : 0;

  return { totalDerivas, totalPrompts, totalMinutos, mediaHumor, totalDescobertas };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

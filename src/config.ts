/**
 * Configuração do ambiente
 * Detecta automaticamente se a API PHP está disponível
 */

// URL base da API (ajuste se necessário)
const API_BASE_URL = '/api/derivas.php';

// Verifica se a API está disponível
export async function checkApiAvailability(): Promise<boolean> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    console.log('API não disponível, usando modo offline (IndexedDB)');
    return false;
  }
}

// Configuração do modo de armazenamento
export const STORAGE_MODE = {
  API: 'api',      // Usa API PHP + SQLite no servidor
  LOCAL: 'local'   // Usa SQLite no navegador (IndexedDB)
};

// Detecta automaticamente o melhor modo
export async function detectStorageMode(): Promise<string> {
  const isApiAvailable = await checkApiAvailability();
  return isApiAvailable ? STORAGE_MODE.API : STORAGE_MODE.LOCAL;
}

export { API_BASE_URL };

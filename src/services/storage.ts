/**
 * Camada de abstração para armazenamento
 * Detecta automaticamente se usa API PHP ou SQLite local
 */

import { detectStorageMode, STORAGE_MODE } from '../config';
import { apiService } from '../services/api';
import {
  initDatabase,
  getAllDerivas as localGetAllDerivas,
  getDerivaById as localGetDerivaById,
  createDeriva as localCreateDeriva,
  updateDeriva as localUpdateDeriva,
  deleteDeriva as localDeleteDeriva,
  getConfig as localGetConfig,
  saveConfig as localSaveConfig,
  getStats as localGetStats,
  exportDatabase as localExportDatabase,
  importDatabase as localImportDatabase,
  generateId,
  type DerivaCompleta,
  type DerivaConfig
} from '../db/database';

let currentMode: string = STORAGE_MODE.LOCAL;

// Inicializa o storage (detecta API ou usa local)
export async function initStorage(): Promise<string> {
  currentMode = await detectStorageMode();
  console.log(`Modo de armazenamento: ${currentMode === STORAGE_MODE.API ? 'API (servidor)' : 'Local (navegador)'}`);
  
  if (currentMode === STORAGE_MODE.LOCAL) {
    await initDatabase();
  }
  
  return currentMode;
}

export function getStorageMode(): string {
  return currentMode;
}

// ============ DERIVAS ============

export async function getAllDerivas(): Promise<DerivaCompleta[]> {
  if (currentMode === STORAGE_MODE.API) {
    return await apiService.getAllDerivas();
  }
  return localGetAllDerivas();
}

export async function getDerivaById(id: string): Promise<DerivaCompleta | null> {
  if (currentMode === STORAGE_MODE.API) {
    try {
      return await apiService.getDeriva(id);
    } catch {
      return null;
    }
  }
  return localGetDerivaById(id);
}

export async function createDeriva(deriva: DerivaCompleta): Promise<void> {
  if (currentMode === STORAGE_MODE.API) {
    await apiService.createDeriva(deriva);
    return;
  }
  await localCreateDeriva(deriva);
}

export async function updateDeriva(deriva: DerivaCompleta): Promise<void> {
  if (currentMode === STORAGE_MODE.API) {
    await apiService.updateDeriva(deriva);
    return;
  }
  await localUpdateDeriva(deriva);
}

export async function deleteDeriva(id: string): Promise<void> {
  if (currentMode === STORAGE_MODE.API) {
    await apiService.deleteDeriva(id);
    return;
  }
  await localDeleteDeriva(id);
}

// ============ CONFIG ============

export async function getConfig(): Promise<DerivaConfig> {
  if (currentMode === STORAGE_MODE.API) {
    return await apiService.getConfig();
  }
  return localGetConfig();
}

export async function saveConfig(config: DerivaConfig): Promise<void> {
  if (currentMode === STORAGE_MODE.API) {
    await apiService.saveConfig(config);
    return;
  }
  await localSaveConfig(config);
}

// ============ STATS ============

export async function getStats(): Promise<{
  totalDerivas: number;
  totalPrompts: number;
  totalMinutos: number;
  mediaHumor: string;
  totalDescobertas: number;
}> {
  if (currentMode === STORAGE_MODE.API) {
    const stats = await apiService.getStats();
    return { ...stats, mediaHumor: stats.mediaHumor.toFixed(1) };
  }
  return localGetStats();
}

// ============ EXPORT/IMPORT ============

export async function exportDatabase(): Promise<string> {
  if (currentMode === STORAGE_MODE.API) {
    const data = await apiService.exportAll();
    return JSON.stringify(data, null, 2);
  }
  return localExportDatabase();
}

export async function importDatabase(jsonString: string): Promise<boolean> {
  if (currentMode === STORAGE_MODE.API) {
    const data = JSON.parse(jsonString);
    const result = await apiService.importAll(data);
    return result.success;
  }
  return localImportDatabase(jsonString);
}

// Re-export generateId
export { generateId };
export type { DerivaCompleta, DerivaConfig };

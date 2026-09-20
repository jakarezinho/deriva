// Store para derivas urbanas — persistência em localStorage (simulando SQLite)

export interface Deriva {
  id: string;
  dataInicio: string;
  dataFim?: string;
  duracao?: number; // em minutos
  localInicio: string;
  localFim?: string;
  promptsSeguidos: { promptId: number; promptText: string; timestamp: string }[];
  notas: string;
  humor: number; // 1-5
  clima: string;
  distancia?: number; // km estimados
  descobertas: string[];
}

const STORAGE_KEY = 'derivas_urbanas';
const CONFIG_KEY = 'deriva_config';

export interface DerivaConfig {
  nomeDerivante: string;
  cidadeBase: string;
  temaPreferido: string;
}

export function getDerivas(): Deriva[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDeriva(deriva: Deriva): void {
  const derivas = getDerivas();
  const index = derivas.findIndex(d => d.id === deriva.id);
  if (index >= 0) {
    derivas[index] = deriva;
  } else {
    derivas.push(deriva);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(derivas));
}

export function deleteDeriva(id: string): void {
  const derivas = getDerivas().filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(derivas));
}

export function getConfig(): DerivaConfig {
  try {
    const data = localStorage.getItem(CONFIG_KEY);
    return data ? JSON.parse(data) : { nomeDerivante: 'Derivante', cidadeBase: '', temaPreferido: '' };
  } catch {
    return { nomeDerivante: 'Derivante', cidadeBase: '', temaPreferido: '' };
  }
}

export function saveConfig(config: DerivaConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getStats() {
  const derivas = getDerivas();
  const totalDerivas = derivas.length;
  const totalPrompts = derivas.reduce((acc, d) => acc + d.promptsSeguidos.length, 0);
  const totalMinutos = derivas.reduce((acc, d) => acc + (d.duracao || 0), 0);
  const mediaHumor = derivas.length > 0
    ? (derivas.reduce((acc, d) => acc + d.humor, 0) / derivas.length).toFixed(1)
    : '0';
  const totalDescobertas = derivas.reduce((acc, d) => acc + d.descobertas.length, 0);

  return { totalDerivas, totalPrompts, totalMinutos, mediaHumor, totalDescobertas };
}

export function exportData(): string {
  const data = {
    derivas: getDerivas(),
    config: getConfig(),
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.derivas) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.derivas));
    }
    if (data.config) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(data.config));
    }
    return true;
  } catch {
    return false;
  }
}

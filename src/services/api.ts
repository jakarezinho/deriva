/**
 * Serviço de API para comunicação com o backend PHP
 */

import { API_BASE_URL } from '../config';
import type { DerivaCompleta, DerivaConfig } from '../db/database';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Derivas
  async getAllDerivas(): Promise<DerivaCompleta[]> {
    return this.request<DerivaCompleta[]>('');
  }

  async getDeriva(id: string): Promise<DerivaCompleta> {
    return this.request<DerivaCompleta>(`?id=${encodeURIComponent(id)}`);
  }

  async createDeriva(deriva: DerivaCompleta): Promise<{ success: boolean; id: string }> {
    return this.request('', {
      method: 'POST',
      body: JSON.stringify(deriva),
    });
  }

  async updateDeriva(deriva: DerivaCompleta): Promise<{ success: boolean }> {
    return this.request('', {
      method: 'PUT',
      body: JSON.stringify(deriva),
    });
  }

  async deleteDeriva(id: string): Promise<{ success: boolean }> {
    return this.request(`?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // Estatísticas
  async getStats(): Promise<{
    totalDerivas: number;
    totalPrompts: number;
    totalMinutos: number;
    mediaHumor: number;
    totalDescobertas: number;
  }> {
    return this.request('?stats=1');
  }

  // Configuração
  async getConfig(): Promise<DerivaConfig> {
    return this.request('?config=1');
  }

  async saveConfig(config: DerivaConfig): Promise<{ success: boolean }> {
    return this.request('?config=1', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  // Export/Import
  async exportAll(): Promise<{
    derivas: DerivaCompleta[];
    config: DerivaConfig;
    exportDate: string;
    version: string;
  }> {
    return this.request('?export=1', {
      method: 'POST',
    });
  }

  async importAll(data: any): Promise<{ success: boolean; imported: number }> {
    return this.request('?import=1', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();

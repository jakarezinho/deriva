// ============ ESTADO GLOBAL ============
let derivaAtiva = null;
let todasDerivas = [];
let mapa = null;
let markers = [];
let localizacaoAtual = null;
let watchId = null;
let marcadorPreview = null; // Marcador temporário de localização

// Estado do modal de descoberta
let descobertaAtual = {
    latitude: null,
    longitude: null,
    fotoPath: null,
    fotoThumbPath: null,
    orientacao: 0,
    notas: ''
};

// Estado do modal de edição de descoberta
let descobertaEmEdicao = null;
let dadosEdicao = {
    latitude: null,
    longitude: null,
    fotoPath: null,
    fotoThumbPath: null,
    orientacao: 0,
    notas: ''
};

// Coordenadas de Caldas da Rainha (fallback)
const CALDAS_RAINHA = {
    lat: 39.4145,
    lng: -9.1143
};

// API URLs
const API_DERIVAS = 'api/derivas.php';
const API_DESCOBERTAS = 'api/descobertas.php';
const API_UPLOAD = 'api/upload.php';

// ============ INICIALIZAÇÃO ============

document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
});

async function initApp() {
    try {
        await carregarDerivas();
        await encontrarDerivaAtiva();
        
        if (derivaAtiva) {
            mostrarDerivaAtiva();
        } else {
            mostrarEstadoVazio();
        }
        
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Erro ao inicializar:', error);
        document.getElementById('loading').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <p style="color: #f87171; margin-bottom: 0.5rem;">Erro ao conectar à API</p>
                <p style="color: #6b6b80; font-size: 0.875rem; margin-bottom: 1rem;">${error.message}</p>
                <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: rgba(192, 132, 252, 0.1); color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.3); border-radius: 0.5rem; cursor: pointer;">Tentar novamente</button>
            </div>
        `;
    }
}

async function carregarDerivas() {
    const response = await fetch(API_DERIVAS);
    if (!response.ok) throw new Error('Erro ao carregar derivas');
    todasDerivas = await response.json();
}

async function encontrarDerivaAtiva() {
    derivaAtiva = todasDerivas.find(d => d.estado === 'ativa');
}

// ============ NAVEGAÇÃO ============

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });
    
    if (page === 'arquivo') {
        renderArquivo();
    }
    
    window.scrollTo(0, 0);
}

// ============ DERIVA ATIVA ============

function mostrarEstadoVazio() {
    document.getElementById('deriva-header').style.display = 'none';
    document.getElementById('deriva-content').style.display = 'none';
    document.getElementById('sem-deriva').style.display = 'block';
}

function mostrarDerivaAtiva() {
    document.getElementById('deriva-header').style.display = 'flex';
    document.getElementById('deriva-content').style.display = 'block';
    document.getElementById('sem-deriva').style.display = 'none';
    
    // Atualizar header
    document.getElementById('deriva-titulo').textContent = derivaAtiva.titulo;
    document.getElementById('deriva-data').textContent = formatarData(derivaAtiva.data_criacao);
    
    // Inicializar mapa
    inicializarMapa();
    
    // Renderizar descobertas
    renderDescobertas();
    
    // Iniciar geolocalização
    iniciarGeolocalizacao();
}

async function criarNovaDeriva() {
    const titulo = prompt('Título da deriva (deixe em branco para usar a data):');
    
    try {
        const response = await fetch(API_DERIVAS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: titulo || '' })
        });
        
        if (!response.ok) throw new Error('Erro ao criar deriva');
        
        const result = await response.json();
        
        // Recarregar derivas
        await carregarDerivas();
        await encontrarDerivaAtiva();
        
        // Mostrar nova deriva
        showPage('home');
        mostrarDerivaAtiva();
        
        alert('Nova deriva criada!');
    } catch (error) {
        alert('Erro ao criar deriva: ' + error.message);
    }
}

async function arquivarDeriva() {
    if (!derivaAtiva) return;
    
    if (!confirm('Arquivar esta deriva? Não poderá adicionar mais descobertas.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_DERIVAS}?arquivar=1`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: derivaAtiva.id })
        });
        
        if (!response.ok) throw new Error('Erro ao arquivar deriva');
        
        // Recarregar
        await carregarDerivas();
        derivaAtiva = null;
        
        // Parar geolocalização
        pararGeolocalizacao();
        
        // Mostrar estado vazio
        mostrarEstadoVazio();
        
        alert('Deriva arquivada!');
    } catch (error) {
        alert('Erro ao arquivar: ' + error.message);
    }
}

async function editarTitulo() {
    if (!derivaAtiva) return;
    
    document.getElementById('titulo-input').value = derivaAtiva.titulo;
    document.getElementById('modal-titulo').style.display = 'flex';
}

async function salvarTitulo() {
    const novoTitulo = document.getElementById('titulo-input').value.trim();
    
    if (!novoTitulo) {
        alert('Título não pode estar vazio');
        return;
    }
    
    try {
        const response = await fetch(API_DERIVAS, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: derivaAtiva.id,
                titulo: novoTitulo
            })
        });
        
        if (!response.ok) throw new Error('Erro ao atualizar título');
        
        derivaAtiva.titulo = novoTitulo;
        document.getElementById('deriva-titulo').textContent = novoTitulo;
        
        fecharModalTitulo();
        
        await carregarDerivas();
    } catch (error) {
        alert('Erro ao atualizar título: ' + error.message);
    }
}

function fecharModalTitulo() {
    document.getElementById('modal-titulo').style.display = 'none';
}

// ============ GEOLOCALIZAÇÃO ============

function iniciarGeolocalizacao() {
    if (!navigator.geolocation) {
        console.warn('Geolocalização não suportada');
        return;
    }
    
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            localizacaoAtual = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            // Atualizar UI
            document.getElementById('localizacao-info').style.display = 'flex';
            document.getElementById('coord-text').textContent = 
                `${localizacaoAtual.lat.toFixed(6)}, ${localizacaoAtual.lng.toFixed(6)} (±${Math.round(localizacaoAtual.accuracy)}m)`;
        },
        (error) => {
            console.warn('Erro na geolocalização:', error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function pararGeolocalizacao() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

function localizarMe() {
    if (!localizacaoAtual) {
        alert('A obter localização... Tente novamente em alguns segundos.');
        return;
    }
    
    if (mapa) {
        // Centrar na localização
        mapa.setView([localizacaoAtual.lat, localizacaoAtual.lng], 16);
        
        // Remover marcador preview anterior se existir
        if (marcadorPreview) {
            mapa.removeLayer(marcadorPreview);
        }
        
        // Criar marcador preview temporário
        const previewIcon = L.divIcon({
            className: 'preview-marker-container',
            html: '<div class="preview-marker"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        marcadorPreview = L.marker([localizacaoAtual.lat, localizacaoAtual.lng], {
            icon: previewIcon
        }).addTo(mapa);
        
        // Adicionar popup informativo
        marcadorPreview.bindPopup('<strong>📍 Sua localização atual</strong><br><small>Este marcador desaparecerá quando guardar a descoberta</small>').openPopup();
    }
}

async function capturarLocalizacao() {
    if (!navigator.geolocation) {
        alert('Geolocalização não suportada');
        return;
    }
    
    document.getElementById('desc-coords').textContent = 'A obter localização...';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            descobertaAtual.latitude = position.coords.latitude;
            descobertaAtual.longitude = position.coords.longitude;
            
            document.getElementById('desc-coords').textContent = 
                `${descobertaAtual.latitude.toFixed(6)}, ${descobertaAtual.longitude.toFixed(6)}`;
        },
        (error) => {
            alert('Erro ao obter localização: ' + error.message);
            document.getElementById('desc-coords').textContent = '';
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// ============ MAPA ============

function inicializarMapa() {
    if (mapa) {
        mapa.remove();
    }
    
    // Verificar se há marcadores para centrar
    const temMarcadores = derivaAtiva && derivaAtiva.descobertas && 
        derivaAtiva.descobertas.some(d => d.latitude && d.longitude);
    
    let centro, zoom;
    
    if (temMarcadores) {
        // Calcular bounds de todos os marcadores
        const bounds = L.latLngBounds();
        derivaAtiva.descobertas.forEach(d => {
            if (d.latitude && d.longitude) {
                bounds.extend([d.latitude, d.longitude]);
            }
        });
        
        // Criar mapa e ajustar aos bounds
        mapa = L.map('mapa');
        mapa.fitBounds(bounds, { padding: [50, 50] });
    } else {
        // Sem marcadores: centrar em Caldas da Rainha
        centro = [CALDAS_RAINHA.lat, CALDAS_RAINHA.lng];
        zoom = 13;
        mapa = L.map('mapa').setView(centro, zoom);
    }
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
    }).addTo(mapa);
    
    // Adicionar marcadores das descobertas
    renderMarcadores();
}

function renderMarcadores() {
    // Limpar marcadores existentes
    markers.forEach(m => mapa.removeLayer(m));
    markers = [];
    
    if (!derivaAtiva || !derivaAtiva.descobertas) return;
    
    derivaAtiva.descobertas.forEach(desc => {
        if (desc.latitude && desc.longitude) {
            // Criar marcador com miniatura
            const icon = L.divIcon({
                className: 'foto-marker-container',
                html: `<div class="foto-marker">
                    <img src="${desc.foto_thumb_path}" alt="Descoberta">
                </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            
            const marker = L.marker([desc.latitude, desc.longitude], { icon })
                .addTo(mapa)
                .on('click', () => mostrarDetalhesDescoberta(desc));
            
            markers.push(marker);
        }
    });
}

// ============ DESCOBERTAS ============

function renderDescobertas() {
    const container = document.getElementById('descobertas-list');
    const total = document.getElementById('total-descobertas');
    
    if (!derivaAtiva || !derivaAtiva.descobertas || derivaAtiva.descobertas.length === 0) {
        container.innerHTML = '<p class="empty-message">Ainda não há descobertas. Comece a explorar!</p>';
        total.textContent = '0';
        return;
    }
    
    total.textContent = derivaAtiva.descobertas.length;
    
    container.innerHTML = derivaAtiva.descobertas.map(desc => `
        <div class="descoberta-item ${desc.favorita ? 'favorita' : ''}" onclick="mostrarDetalhesDescoberta(derivaAtiva.descobertas.find(d => d.id === ${desc.id}))">
            ${desc.foto_thumb_path 
                ? `<img src="${desc.foto_thumb_path}" alt="Descoberta" class="descoberta-foto">`
                : `<div class="descoberta-foto" style="display: flex; align-items: center; justify-content: center; color: #6b6b80;">📷</div>`
            }
            ${desc.favorita ? '<span class="favorita-badge">★ FAVORITA</span>' : ''}
            <div class="descoberta-info">
                <p class="descoberta-notas">${desc.notas || 'Sem notas'}</p>
                <p class="descoberta-data">${formatarHora(desc.timestamp)}</p>
            </div>
        </div>
    `).join('');
}

function adicionarDescoberta() {
    if (!derivaAtiva) {
        alert('Nenhuma deriva ativa');
        return;
    }
    
    // Reset state
    descobertaAtual = {
        latitude: localizacaoAtual ? localizacaoAtual.lat : null,
        longitude: localizacaoAtual ? localizacaoAtual.lng : null,
        fotoPath: null,
        fotoThumbPath: null,
        orientacao: 0,
        notas: ''
    };
    
    // Atualizar UI
    document.getElementById('desc-notas').value = '';
    document.getElementById('foto-preview').style.display = 'none';
    
    if (descobertaAtual.latitude && descobertaAtual.longitude) {
        document.getElementById('desc-coords').textContent = 
            `${descobertaAtual.latitude.toFixed(6)}, ${descobertaAtual.longitude.toFixed(6)}`;
    } else {
        document.getElementById('desc-coords').textContent = '';
    }
    
    document.getElementById('modal-descoberta').style.display = 'flex';
}

function fecharModalDescoberta() {
    document.getElementById('modal-descoberta').style.display = 'none';
}

// ============ PROCESSAMENTO DE FOTOS ============

async function processarFoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem');
        return;
    }
    
    // Ler EXIF para orientação
    let orientacao = 0;
    try {
        orientacao = await lerOrientacaoEXIF(file);
    } catch (e) {
        console.warn('Erro ao ler EXIF:', e);
    }
    
    // Processar imagem (compressão + rotação)
    try {
        const { blobOriginal, blobThumb } = await processarImagem(file, orientacao);
        
        // Upload para servidor
        const formData = new FormData();
        formData.append('foto', blobOriginal, 'foto.jpg');
        
        const response = await fetch(API_UPLOAD, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Erro ao enviar foto');
        
        const result = await response.json();
        
        descobertaAtual.fotoPath = result.foto_path;
        descobertaAtual.fotoThumbPath = result.foto_thumb_path;
        descobertaAtual.orientacao = result.orientacao;
        
        // Mostrar preview
        const preview = document.getElementById('foto-preview');
        const previewImg = document.getElementById('foto-preview-img');
        previewImg.src = URL.createObjectURL(blobOriginal);
        preview.style.display = 'block';
        
    } catch (error) {
        alert('Erro ao processar foto: ' + error.message);
    }
}

function lerOrientacaoEXIF(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const view = new DataView(e.target.result);
            
            if (view.getUint16(0, false) !== 0xFFD8) {
                resolve(0);
                return;
            }
            
            const length = view.byteLength;
            let offset = 2;
            
            while (offset < length) {
                const marker = view.getUint16(offset, false);
                offset += 2;
                
                if (marker === 0xFFE1) {
                    if (offset + 2 > length) break;
                    offset += 2;
                    
                    if (offset + 10 > length) break;
                    if (view.getUint32(offset, false) !== 0x45786966) {
                        resolve(0);
                        return;
                    }
                    
                    offset += 6;
                    const little = view.getUint16(offset, false) === 0x4949;
                    offset += 2;
                    
                    const tagOffset = view.getUint32(offset, little);
                    offset += 4;
                    
                    const tags = view.getUint16(offset + tagOffset, little);
                    offset += tagOffset;
                    
                    for (let i = 0; i < tags; i++) {
                        const tagOffset2 = offset + i * 12;
                        const tag = view.getUint16(tagOffset2, little);
                        if (tag === 0x0112) {
                            const value = view.getUint16(tagOffset2 + 8, little);
                            switch (value) {
                                case 3: resolve(180); return;
                                case 6: resolve(90); return;
                                case 8: resolve(270); return;
                                default: resolve(0); return;
                            }
                        }
                    }
                    break;
                } else if ((marker & 0xFF00) !== 0xFF00) {
                    break;
                } else {
                    offset += view.getUint16(offset, false);
                }
            }
            
            resolve(0);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function processarImagem(file, orientacao) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Calcular fator de compressão adaptativo
                const tamanhoBytes = file.size;
                let fator;
                if (tamanhoBytes > 5 * 1024 * 1024) {
                    fator = 0.5;
                } else if (tamanhoBytes > 2 * 1024 * 1024) {
                    fator = 0.65;
                } else if (tamanhoBytes > 1 * 1024 * 1024) {
                    fator = 0.8;
                } else {
                    fator = 1.0;
                }
                
                // Dimensões finais
                let largura = img.width * fator;
                let altura = img.height * fator;
                
                // Aplicar rotação se necessário
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                if (orientacao === 90 || orientacao === 270) {
                    canvas.width = altura;
                    canvas.height = largura;
                } else {
                    canvas.width = largura;
                    canvas.height = altura;
                }
                
                // Aplicar transformação
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((orientacao * Math.PI) / 180);
                ctx.drawImage(img, -largura / 2, -altura / 2, largura, altura);
                ctx.restore();
                
                // Converter para blob
                canvas.toBlob((blobOriginal) => {
                    // Criar miniatura 200x200
                    const thumbSize = 200;
                    const thumbCanvas = document.createElement('canvas');
                    thumbCanvas.width = thumbSize;
                    thumbCanvas.height = thumbSize;
                    const thumbCtx = thumbCanvas.getContext('2d');
                    
                    // Crop central
                    const lado = Math.min(largura, altura);
                    const x = (largura - lado) / 2;
                    const y = (altura - lado) / 2;
                    
                    thumbCtx.drawImage(canvas, x, y, lado, lado, 0, 0, thumbSize, thumbSize);
                    
                    thumbCanvas.toBlob((blobThumb) => {
                        resolve({ blobOriginal, blobThumb });
                    }, 'image/jpeg', 0.85);
                }, 'image/jpeg', 0.9);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function removerFoto() {
    descobertaAtual.fotoPath = null;
    descobertaAtual.fotoThumbPath = null;
    document.getElementById('foto-preview').style.display = 'none';
    document.getElementById('foto-input').value = '';
}

function abrirCamera() {
    adicionarDescoberta();
    setTimeout(() => {
        document.getElementById('foto-input').click();
    }, 100);
}

// ============ GUARDAR DESCOBERTA ============

async function guardarDescoberta() {
    const notas = document.getElementById('desc-notas').value.trim();
    
    if (!notas && !descobertaAtual.fotoPath) {
        alert('Adicione pelo menos notas ou uma foto');
        return;
    }
    
    try {
        const response = await fetch(API_DESCOBERTAS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                deriva_id: derivaAtiva.id,
                notas: notas,
                latitude: descobertaAtual.latitude,
                longitude: descobertaAtual.longitude,
                foto_path: descobertaAtual.fotoPath,
                foto_thumb_path: descobertaAtual.fotoThumbPath,
                orientacao: descobertaAtual.orientacao
            })
        });
        
        if (!response.ok) throw new Error('Erro ao guardar descoberta');
        
        // Remover marcador preview
        if (marcadorPreview && mapa) {
            mapa.removeLayer(marcadorPreview);
            marcadorPreview = null;
        }
        
        // Recarregar deriva
        const derivaResponse = await fetch(`${API_DERIVAS}?id=${derivaAtiva.id}`);
        derivaAtiva = await derivaResponse.json();
        
        // Atualizar UI
        renderDescobertas();
        renderMarcadores();
        
        fecharModalDescoberta();
        
        await carregarDerivas();
    } catch (error) {
        alert('Erro ao guardar: ' + error.message);
    }
}

// ============ DETALHES DA DESCOBERTA ============

function mostrarDetalhesDescoberta(desc) {
    const content = document.getElementById('detalhes-content');
    
    content.innerHTML = `
        ${desc.foto_path ? `
            <div class="detalhes-foto">
                <img src="${desc.foto_path}" alt="Descoberta" style="transform: rotate(${desc.orientacao}deg);">
            </div>
        ` : ''}
        
        <div class="detalhes-meta">
            ${desc.latitude && desc.longitude ? `
                <span>📍 ${desc.latitude.toFixed(6)}, ${desc.longitude.toFixed(6)}</span>
            ` : ''}
            <span>🕐 ${formatarDataHora(desc.timestamp)}</span>
            <button class="favorita-btn ${desc.favorita ? 'ativa' : 'inativa'}" onclick="toggleFavorita(${desc.id}, event)" title="${desc.favorita ? 'Remover dos favoritos' : 'Marcar como favorita'}">
                ${desc.favorita ? '★' : '☆'}
            </button>
        </div>
        
        ${desc.notas ? `
            <div class="detalhes-notas">${desc.notas}</div>
        ` : '<p style="color: #6b6b80; font-style: italic;">Sem notas</p>'}
        
        <div class="detalhes-actions">
            <button class="btn-secondary" onclick="editarDescoberta(derivaAtiva.descobertas.find(d => d.id === ${desc.id}))">✏️ Editar</button>
            <button class="btn-danger" onclick="eliminarDescoberta(${desc.id})">🗑️ Eliminar</button>
        </div>
    `;
    
    document.getElementById('modal-detalhes').style.display = 'flex';
}

function fecharModalDetalhes() {
    document.getElementById('modal-detalhes').style.display = 'none';
}

async function eliminarDescoberta(id) {
    if (!confirm('Eliminar esta descoberta?')) return;
    
    try {
        const response = await fetch(`${API_DESCOBERTAS}?id=${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erro ao eliminar');
        
        // Recarregar deriva
        const derivaResponse = await fetch(`${API_DERIVAS}?id=${derivaAtiva.id}`);
        derivaAtiva = await derivaResponse.json();
        
        renderDescobertas();
        renderMarcadores();
        fecharModalDetalhes();
        
        await carregarDerivas();
    } catch (error) {
        alert('Erro ao eliminar: ' + error.message);
    }
}

// ============ ARQUIVO ============

function renderArquivo() {
    const container = document.getElementById('arquivo-list');
    const arquivadas = todasDerivas.filter(d => d.estado === 'arquivada');
    
    if (arquivadas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📁</div>
                <h2>Nenhuma deriva arquivada</h2>
                <p>As derivas arquivadas aparecerão aqui.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = arquivadas.map(d => `
        <div class="arquivo-item">
            <div class="arquivo-info">
                <h3>${d.titulo}</h3>
                <div class="arquivo-meta">
                    <span>📅 ${formatarData(d.data_criacao)}</span>
                    <span>🔍 ${d.total_descobertas} descobertas</span>
                </div>
            </div>
            <div class="arquivo-actions">
                <button class="btn-secondary" onclick="verDerivaArquivada('${d.id}')">Ver</button>
                <button class="btn-warning" onclick="reativarDeriva('${d.id}')">Reativar</button>
                <button class="btn-danger" onclick="eliminarDeriva('${d.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

async function verDerivaArquivada(id) {
    try {
        const response = await fetch(`${API_DERIVAS}?id=${id}`);
        const deriva = await response.json();
        
        // Mostrar numa nova janela ou modal
        const content = document.getElementById('detalhes-content');
        content.innerHTML = `
            <h2 style="font-family: Georgia, serif; margin-bottom: 1rem;">${deriva.titulo}</h2>
            <p style="color: #6b6b80; margin-bottom: 1rem;">📅 ${formatarDataHora(deriva.data_criacao)}</p>
            <p style="margin-bottom: 1rem;">🔍 ${deriva.total_descobertas} descobertas</p>
            <div class="descobertas-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem;">
                ${deriva.descobertas.map(desc => `
                    <div class="descoberta-item" onclick="mostrarDetalhesDescobertaArquivada(${JSON.stringify(desc).replace(/"/g, '&quot;')})">
                        ${desc.foto_thumb_path 
                            ? `<img src="${desc.foto_thumb_path}" alt="Descoberta" class="descoberta-foto">`
                            : `<div class="descoberta-foto" style="display: flex; align-items: center; justify-content: center; color: #6b6b80;">📷</div>`
                        }
                        <div class="descoberta-info">
                            <p class="descoberta-notas">${desc.notas || 'Sem notas'}</p>
                            <p class="descoberta-data">${formatarHora(desc.timestamp)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.getElementById('modal-detalhes').style.display = 'flex';
    } catch (error) {
        alert('Erro ao carregar deriva: ' + error.message);
    }
}

function mostrarDetalhesDescobertaArquivada(desc) {
    const content = document.getElementById('detalhes-content');
    
    content.innerHTML = `
        ${desc.foto_path ? `
            <div class="detalhes-foto">
                <img src="${desc.foto_path}" alt="Descoberta">
            </div>
        ` : ''}
        
        <div class="detalhes-meta">
            ${desc.latitude && desc.longitude ? `
                <span>📍 ${desc.latitude.toFixed(6)}, ${desc.longitude.toFixed(6)}</span>
            ` : ''}
            <span>🕐 ${formatarDataHora(desc.timestamp)}</span>
        </div>
        
        ${desc.notas ? `
            <div class="detalhes-notas">${desc.notas}</div>
        ` : '<p style="color: #6b6b80; font-style: italic;">Sem notas</p>'}
    `;
    
    document.getElementById('modal-detalhes').style.display = 'flex';
}

async function reativarDeriva(id) {
    if (!confirm('Reativar esta deriva? A deriva ativa atual será arquivada.')) return;
    
    try {
        const response = await fetch(`${API_DERIVAS}?reativar=1`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        if (!response.ok) throw new Error('Erro ao reativar');
        
        await carregarDerivas();
        await encontrarDerivaAtiva();
        
        showPage('home');
        mostrarDerivaAtiva();
        
        alert('Deriva reativada!');
    } catch (error) {
        alert('Erro ao reativar: ' + error.message);
    }
}

async function eliminarDeriva(id) {
    if (!confirm('Eliminar permanentemente esta deriva e todas as suas descobertas?')) return;
    
    try {
        const response = await fetch(`${API_DERIVAS}?id=${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erro ao eliminar');
        
        await carregarDerivas();
        renderArquivo();
        
        alert('Deriva eliminada!');
    } catch (error) {
        alert('Erro ao eliminar: ' + error.message);
    }
}

// ============ EDITAR DESCOBERTA ============

function editarDescoberta(desc) {
    descobertaEmEdicao = desc;
    dadosEdicao = {
        latitude: desc.latitude,
        longitude: desc.longitude,
        fotoPath: desc.foto_path,
        fotoThumbPath: desc.foto_thumb_path,
        orientacao: desc.orientacao,
        notas: desc.notas
    };
    
    // Atualizar UI
    document.getElementById('edit-desc-notas').value = desc.notas || '';
    
    if (desc.latitude && desc.longitude) {
        document.getElementById('edit-desc-coords').textContent = 
            `${desc.latitude.toFixed(6)}, ${desc.longitude.toFixed(6)}`;
    } else {
        document.getElementById('edit-desc-coords').textContent = '';
    }
    
    // Mostrar foto atual
    const preview = document.getElementById('edit-foto-preview');
    const previewImg = document.getElementById('edit-foto-preview-img');
    
    if (desc.foto_path) {
        previewImg.src = desc.foto_path;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
    
    document.getElementById('modal-editar-descoberta').style.display = 'flex';
}

function fecharModalEditarDescoberta() {
    document.getElementById('modal-editar-descoberta').style.display = 'none';
    descobertaEmEdicao = null;
    dadosEdicao = {
        latitude: null,
        longitude: null,
        fotoPath: null,
        fotoThumbPath: null,
        orientacao: 0,
        notas: ''
    };
}

async function capturarLocalizacaoEdicao() {
    if (!navigator.geolocation) {
        alert('Geolocalização não suportada');
        return;
    }
    
    document.getElementById('edit-desc-coords').textContent = 'A obter localização...';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            dadosEdicao.latitude = position.coords.latitude;
            dadosEdicao.longitude = position.coords.longitude;
            
            document.getElementById('edit-desc-coords').textContent = 
                `${dadosEdicao.latitude.toFixed(6)}, ${dadosEdicao.longitude.toFixed(6)}`;
        },
        (error) => {
            alert('Erro ao obter localização: ' + error.message);
            document.getElementById('edit-desc-coords').textContent = '';
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

async function processarFotoEdicao(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem');
        return;
    }
    
    let orientacao = 0;
    try {
        orientacao = await lerOrientacaoEXIF(file);
    } catch (e) {
        console.warn('Erro ao ler EXIF:', e);
    }
    
    try {
        const { blobOriginal, blobThumb } = await processarImagem(file, orientacao);
        
        const formData = new FormData();
        formData.append('foto', blobOriginal, 'foto.jpg');
        
        const response = await fetch(API_UPLOAD, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Erro ao enviar foto');
        
        const result = await response.json();
        
        dadosEdicao.fotoPath = result.foto_path;
        dadosEdicao.fotoThumbPath = result.foto_thumb_path;
        dadosEdicao.orientacao = result.orientacao;
        
        const preview = document.getElementById('edit-foto-preview');
        const previewImg = document.getElementById('edit-foto-preview-img');
        previewImg.src = URL.createObjectURL(blobOriginal);
        preview.style.display = 'block';
        
    } catch (error) {
        alert('Erro ao processar foto: ' + error.message);
    }
}

function removerFotoEdicao() {
    dadosEdicao.fotoPath = null;
    dadosEdicao.fotoThumbPath = null;
    document.getElementById('edit-foto-preview').style.display = 'none';
    document.getElementById('edit-foto-input').value = '';
}

async function salvarEdicaoDescoberta() {
    if (!descobertaEmEdicao) return;
    
    const notas = document.getElementById('edit-desc-notas').value.trim();
    
    try {
        const response = await fetch(API_DESCOBERTAS, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: descobertaEmEdicao.id,
                notas: notas,
                latitude: dadosEdicao.latitude,
                longitude: dadosEdicao.longitude,
                foto_path: dadosEdicao.fotoPath,
                foto_thumb_path: dadosEdicao.fotoThumbPath,
                orientacao: dadosEdicao.orientacao
            })
        });
        
        if (!response.ok) throw new Error('Erro ao atualizar descoberta');
        
        // Recarregar deriva
        const derivaResponse = await fetch(`${API_DERIVAS}?id=${derivaAtiva.id}`);
        derivaAtiva = await derivaResponse.json();
        
        renderDescobertas();
        renderMarcadores();
        
        fecharModalEditarDescoberta();
        
        await carregarDerivas();
    } catch (error) {
        alert('Erro ao atualizar: ' + error.message);
    }
}

// ============ FAVORITOS ============

async function toggleFavorita(descId, event) {
    event.stopPropagation();
    
    const desc = derivaAtiva.descobertas.find(d => d.id === descId);
    if (!desc) return;
    
    const novaFavorita = desc.favorita ? 0 : 1;
    
    try {
        const response = await fetch(API_DESCOBERTAS, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: descId,
                favorita: novaFavorita
            })
        });
        
        if (!response.ok) throw new Error('Erro ao atualizar favorito');
        
        // Atualizar localmente
        desc.favorita = novaFavorita;
        
        renderDescobertas();
        
        await carregarDerivas();
    } catch (error) {
        alert('Erro ao atualizar favorito: ' + error.message);
    }
}

// ============ EXPORTAR DERIVA ============

async function exportarDeriva() {
    if (!derivaAtiva) {
        alert('Nenhuma deriva ativa');
        return;
    }
    
    try {
        // Recarregar deriva completa
        const response = await fetch(`${API_DERIVAS}?id=${derivaAtiva.id}`);
        const derivaCompleta = await response.json();
        
        // Criar objeto para exportação
        const dadosExport = {
            versao: '2.0',
            data_exportacao: new Date().toISOString(),
            deriva: derivaCompleta
        };
        
        // Converter para JSON
        const jsonStr = JSON.stringify(dadosExport, null, 2);
        
        // Criar blob e download
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deriva_${derivaAtiva.id}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Deriva exportada com sucesso!');
    } catch (error) {
        alert('Erro ao exportar: ' + error.message);
    }
}

// ============ UTILITÁRIOS ============

function formatarData(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function formatarHora(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatarDataHora(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

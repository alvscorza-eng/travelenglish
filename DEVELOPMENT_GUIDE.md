# Development & Testing Guide - Travel English PWA

## Configuração Local

### Requisitos
- Editor: VS Code (recomendado)
- Node.js 12+ (opcional, apenas se usar npm)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Download & Setup
```bash
# 1. Clone ou baixe o projeto
git clone https://github.com/seu-usuario/travel-english-app.git
cd travel-english-app

# 2. Instale dependências (opcional)
npm install

# 3. Inicie servidor local
npm run serve
# Ou use:
http-server -p 8000

# Acesse: http://localhost:8000
```

---

## Editando o Projeto

### Estrutura de Pastas
```
travel-english-app/
├── index.html          ← Main file (HTML + CSS + JS inline)
├── sw.js              ← Service Worker (offline support)
├── manifest.json      ← PWA configuration
├── package.json       ← Project metadata
├── README.md          ← User documentation
├── DEPLOYMENT_GUIDE.md ← Deploy instructions
├── .htaccess          ← Apache config
├── web.config         ← IIS config
├── .gitignore         ← Git ignore rules
└── icons/            ← App icons (72 a 512px)
```

### Adicionar Novas Frases

1. **Editar `index.html`**
2. Encontrar a categoria desejada (buscar por `data-modal="modal-xxx"`)
3. Adicionar novo `phrase-item` dentro de `phrase-group`:

```html
<div class="phrase-item">
    <span class="en">Your English phrase here</span>
    <span class="phone">Pronunciation in phonetics</span>
    <span class="pt">Tradução em português</span>
</div>
```

### Criar Nova Categoria

1. **Adicionar card no grid**
```html
<button class="card" data-modal="modal-sua-categoria">
    <span class="card-icon">🎯</span>
    <div class="card-text">
        <h3>Sua Categoria</h3>
        <p>Descrição breve</p>
    </div>
</button>
```

2. **Adicionar modal**
```html
<div id="modal-sua-categoria" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2>🎯 Sua Categoria</h2>
            <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
            <div class="phrase-group">
                <h4>Subcategoria 1</h4>
                <!-- Adicione phrase-items aqui -->
            </div>
        </div>
    </div>
</div>
```

---

## Testing com DevTools

### Chrome DevTools
```
1. Abrir: F12
2. Ir para "Application" tab
3. Verificar:
   - Manifest: deve estar listado
   - Service Workers: status ativo
   - Cache Storage: conteúdo cacheado
   - Local Storage: dados salvos
```

### Testar Offline

```
1. DevTools → Network tab
2. Marcar checkbox "Offline"
3. Recarregar página (Ctrl+R)
4. Deve carregar do cache
5. Todas frases devem funcionar
```

### Simular Dispositivo Mobile
```
1. DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Selecionar dispositivo (iPhone, Pixel, etc.)
3. Testar responsividade
4. Testar touch events
```

### Performance Audit
```
1. DevTools → Lighthouse
2. Gerar Report
3. Verificar scores:
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90
```

---

## Editar Estilos

### Localização
Todos os estilos estão em `index.html` dentro de `<style>` tag

### Variáveis CSS
```css
:root {
    --primary: #2563eb;      /* Azul Forte */
    --secondary: #1e40af;    /* Azul Escuro */
    --accent: #f97316;       /* Laranja */
    --accent2: #10b981;      /* Verde */
    --bg: #f3f4f6;           /* Fundo */
    --card-bg: #ffffff;      /* Card */
    --text: #1f2937;         /* Texto */
}
```

### Exemplo: Mudar cores principais
```css
/* Antes */
--primary: #2563eb;

/* Depois */
--primary: #ff0000;  /* Vermelho */
```

---

## Editar Scripts

### Localização
JavaScript inline em `index.html` dentro de `<script>` tag

### Principais Funções
```javascript
// Abrir modal
openModal(modalId)

// Fechar modal
closeModal(modal)

// Fechar todos modais
closeAllModals()

// Manipuladores de eventos
handleCardClick()
handleCardTouchStart()
handleCardTouchEnd()
```

### Adicionar Funcionalidade
Exemplo: Busca por frase
```javascript
// No final da função DOMContentLoaded:
const searchBox = document.createElement('input');
searchBox.placeholder = 'Buscar frases...';
searchBox.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    // Lógica de busca aqui
});
```

---

## Editar Manifest

Arquivo `manifest.json` - importante para PWA

```json
{
    "name": "Nome completo do app",
    "short_name": "Nome curto",
    "description": "Descrição do app",
    "start_url": "./index.html",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#2563eb"
}
```

### Características
- `name`: Aparece ao instalar
- `short_name`: Exibido na home screen
- `description`: Texto em app stores
- `start_url`: Página inicial
- `display`: `standalone` = app completo
- `theme_color`: Cor da barra do navegador

---

## Service Worker (sw.js)

### Estratégia de Cache
- **Cache primeiro**: Se offline, usa cache; senão, faz requisição
- **Network first**: Tenta rede; se falhar, usa cache
- **Stale while revalidate**: Usa cache, mas atualiza em background

### Atualizar Service Worker
```javascript
// Incrementar versão
const CACHE_NAME = 'travel-english-v2.1';
```

Próxima vez que user abrir app, novo cache será usado.

---

## Geração de Ícones

### Localização esperada
```
icons/
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
└── icon-512x512.png
```

### Gerar Online
1. Ir para https://www.pwabuilder.com/
2. Colar URL do app
3. Baixar ícones gerados
4. Colocar em `/icons`

### Gerar Localmente (ImageMagick)
```bash
# Ter imagem base 512x512.png
for size in 72 96 128 144 152 192 384 512; do
  convert icon-512x512.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

---

## Testes Automáticos

### Testing Performance (Lite)
```bash
# Instalar Google Lighthouse
npm install -g lighthouse

# Testar local
lighthouse http://localhost:8000
```

### Testing PWA (Online)
- https://www.pwabuilder.com/
- https://web.dev/measure/
- https://lighthouse-dot-webdotdev.appspot.com/

---

## Debug

### Console Debugging
```javascript
// Adicionar logs
console.log('[Travel English] Evento disparado');

// Verificar erros
console.error('[Travel English] Erro:', error);
```

### Limpar Cache Forçadamente
```javascript
// Execute no console:
caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
});
```

### Desinstalar Service Worker
```javascript
// No console:
navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
});
```

---

## Troubleshooting Comum

### Frases não aparecem
```
1. Verificar console (F12 → Console)
2. Verificar se HTML está bem formado
3. Verificar indentação (importantes em HTML)
```

### Modal não abre
```
1. Verificar data-modal="modal-xxx" existe
2. Verificar id do modal corresponde
3. Console errors?
```

### App não funciona offline
```
1. Verificar Service Worker status em DevTools
2. Verificar se sw.js não tem erros
3. Limpar cache e reload
```

### Estilos não aplicam
```
1. CSS está no <style> tag?
2. Verificar especificidade CSS
3. DevTools → Elements, inspetar elemento
```

---

## Boas Práticas

### Commit Messages
```
git commit -m "Add [hotel] new reception phrases"
git commit -m "Fix modal closing on iOS"
git commit -m "Update service worker cache version"
```

### Testing Checklist
Antes de commitar:
- [ ] Testado no Chrome
- [ ] Testado no Firefox
- [ ] Testado no Safari
- [ ] Testado em mobile
- [ ] Testado offline
- [ ] Sem console errors
- [ ] Lighthouse score > 90

### Performance Tips
- Manter arquivo único (sem múltiplos requests)
- CSS e JS inline (já está assim)
- Comprimir imagens
- Usar format modernos (WebP, SVG)

---

## Recursos Úteis

- MDN Service Worker: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- PWA Checklist: https://web.dev/pwa-checklist/
- Lighthouse: https://developers.google.com/web/tools/lighthouse
- PWA Builder: https://www.pwabuilder.com/

---

**Precisando de ajuda?** Verifique a documentação oficial ou teste em DevTools!

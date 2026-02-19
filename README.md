# Travel English App

PWA para frases de viagem em inglês com pronúncia aproximada e tradução em português, otimizado para uso rápido no celular.

## Funcionalidades

- 15 categorias de frases (incluindo Imigração e Bagagem)
- Busca rápida por categoria na tela inicial
- Modais mobile-friendly com navegação por toque
- Botão de áudio com Text-to-Speech para frases em inglês
- Suporte offline com Service Worker
- Instalável como app (PWA) em Android/iOS/desktop

## Categorias

- Básico
- Aeroporto
- Imigração
- Transporte
- Hotel
- Restaurante
- Compras
- Emergência
- Comunicação
- Banco
- Turismo
- Saúde
- Social
- Clima
- Bagagem

## Execução local

Pré-requisito: Node.js 18+ (ou versão compatível com seu ambiente).

```bash
npm install
npm run serve
```

Abra em: `http://localhost:8000`

Para testar no celular (mesma rede Wi-Fi), use o IP local da máquina:

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet' -and $_.IPAddress -notlike '169.254*' } | Select-Object -First 1 -ExpandProperty IPAddress
```

Depois abra `http://SEU_IP:8000` no celular.

## Estrutura

- `index.html` interface, estilos e lógica principal
- `manifest.json` metadados e atalhos PWA
- `sw.js` cache/offline
- `icons/` ícones PWA

## Scripts

- `npm run serve`: inicia servidor HTTP local na porta 8000 com cache desabilitado

## Licença

MIT. Veja `LICENSE`.

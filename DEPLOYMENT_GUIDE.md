# Deployment Guide - Travel English PWA 🚀

## Preparação Anterior ao Deploy

### Checklist de Produção
- [ ] Todos os ícones gerados (72, 96, 128, 144, 152, 192, 384, 512)
- [ ] Testado em múltiplos navegadores (Chrome, Firefox, Safari, Edge)
- [ ] Testado offline com DevTools
- [ ] Testado em dispositivos reais (Android, iOS)
- [ ] Performance score acima de 90 (Lighthouse)
- [ ] SSL/HTTPS configurado
- [ ] Manifest.json validado
- [ ] Service Worker sem erros
- [ ] Sem console errors
- [ ] Acessibilidade verificada

### Validação
```bash
# Validar manifest.json
curl https://seu-dominio.com/manifest.json

# Validar com PWA Builder (Microsoft)
https://www.pwabuilder.com/

# Lighthouse test
chrome://lighthouse
```

---

## 1. Vercel (Recomendado - Grátis)

### Vantagens
✅ Deploy automático em HTTPS
✅ Sem configuração necessária
✅ CDN global
✅ Grátis para projetos estáticos
✅ Suporte a PWA nativo

### Passo a Passo
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Seguir as instruções

# URL gerada automaticamente
https://travel-english.vercel.app
```

### Sem CLI
1. Ir para https://vercel.com
2. Conectar GitHub / GitLab
3. Selecionar repositório
4. Deploy automático

---

## 2. Netlify (Recomendado - Grátis)

### Vantagens
✅ Deploy automático
✅ HTTPS incluído
✅ Sem limite de bandwidth
✅ Preview automático
✅ Perfeito para PWA

### Passo a Passo
```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy

# 4. Opção: Deploy contínuo
netlify init
```

### Configuração netlify.toml
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build]
  publish = "."

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"
```

---

## 3. GitHub Pages (Grátis, Simples)

### Vantagens
✅ Hospedagem grátis
✅ Integração GitHub
✅ Fácil manutenção
✅ Domínio custom opcional

### Passo a Passo
```bash
# 1. Criar repositório: travel-english-app
# 2. Push para GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/travel-english-app.git
git branch -M main
git push -u origin main

# 3. Ir para Settings → Pages
# 4. Selecionar branch "main"
# 5. Deploy automático

# URL: https://seu-usuario.github.io/travel-english-app
```

---

## 4. Servidor Apache/Linux (full.control)

### Requisitos
- Servidor com Apache 2.4+
- SSH access
- Domínio próprio

### Passo a Passo

1. **Conectar ao servidor**
```bash
ssh usuario@seu-dominio.com
```

2. **Uploaded arquivos**
```bash
# Via SCP
scp -r ./* usuario@seu-dominio.com:/var/www/travel-english/

# Ou usar FTP cliente (Filezilla)
```

3. **Configurar permissões**
```bash
chmod 755 /var/www/travel-english
find /var/www/travel-english -type f -exec chmod 644 {} \;
```

4. **Habilitar .htaccess**
```bash
# Editar /etc/apache2/apache2.conf
# Encontrar <Directory /var/www>
# Alterar AllowOverride None para AllowOverride All
```

5. **Enable mod_rewrite**
```bash
sudo a2enmod rewrite
sudo a2enmod deflate
sudo a2enmod expires
sudo systemctl restart apache2
```

6. **SSL com Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d seu-dominio.com
```

---

## 5. Digital Ocean / Linode (VPS - $5/mês)

### Passo a Passo
1. Criar Droplet Ubuntu 20.04+
2. SSH para servidor
3. Instalar Nginx:
```bash
sudo apt update
sudo apt install nginx
```

4. Configurar Nginx (/etc/nginx/sites-available/default):
```nginx
server {
    root /var/www/travel-english;
    index index.html;
    server_name seu-dominio.com;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location = /index.html {
        expires 1d;
    }
    
    location = /manifest.json {
        expires 1d;
    }
    
    location = /sw.js {
        expires 1h;
    }
}
```

5. SSL:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

---

## 6. AWS S3 + CloudFront

### Passo a Passo

1. **Criar bucket S3**
   - Nome: `travel-english-app`
   - Desabilitar "Block public access"

2. **Upload arquivos**
```bash
aws s3 sync . s3://travel-english-app --exclude ".git/*"
```

3. **Configurar bucket policy** (Allow public read)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::travel-english-app/*"
        }
    ]
}
```

4. **Criar CloudFront distribution**
   - Origin: seu bucket S3
   - Enable compression
   - Invalidate `/index.html`

---

## 7. Firebase Hosting (Google)

### Passo a Passo
```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar projeto
firebase init hosting

# 4. Deploy
firebase deploy

# URL gerada
https://seu-projeto.firebaseapp.com
```

---

## Pós-Deploy

### Validação
1. **Testar no navegador**
   - Verificar todas as frases carregam
   - Testar modais
   - Testar responsive design

2. **Lighthouse Score**
```
https://seu-dominio.com/ (testar com Lighthouse)
Meta mínimo: 90+ em todas categorias
```

3. **PWA Audit**
   - DevTools → Application
   - Verificar Service Worker
   - Verificar Cache
   - Verificar Manifest

4. **Testar Offline**
   - DevTools → Network → Offline
   - Recarregar página
   - Deve funcionar normalmente

### Monitorar
- Google Analytics (opcional)
- Sentry (error tracking - opcional)
- Uptime monitoring

---

## Domínio Customizado

### Depois de fazer deploy em plataforma
1. Ir à registradora de domínios (Namecheap, GoDaddy)
2. Configurar nameservers conforme instruções da plataforma
3. Aguardar propagação DNS (até 24h)
4. Testar acesso

---

## Troubleshooting

### "manifest.json não encontrado"
```
Verificar permissões de arquivo
Verificar caminho em index.html
```

### "Service Worker não registra"
```
Verificar HTTPS está ativo
Verificar console errors
Verificar sw.js existe e sem syntax errors
```

### "App não funciona offline"
```
1. Limpar cache (Ctrl+Shift+Delete)
2. Desinstalar app se instalado
3. Verificar Service Worker em DevTools
4. Verificar console errors
```

### "Não aparece botão de instalar"
```
Verificar HTTPS
Verificar manifest.json válido
Verificar ícones existem e corretos
Testar em Chrome (suporte melhor)
```

---

## Atualizações

### Após deploy inicial
```bash
# Editar arquivos localmente
# Testar em dev
# Commitar no Git
# Push para repositório

# Plataforma faz deploy automático
# Service Worker atualiza automaticamente
# (máximo algumas horas)
```

---

## Performance Otimização

### Verificar tamanho
```bash
ls -lh index.html manifest.json sw.js
```

### Comprimir imagens
```bash
# Usar TinyPNG online ou local
for f in icons/*.png; do
  pngquant --quality=65-80 "$f" --output "${f%.png}-opt.png"
done
```

---

**Dúvidas?** Consulte documentação oficial de cada plataforma.

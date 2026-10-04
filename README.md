# CPA FeMASS - Controle de Respostas

Frontend em React, Vite e Tailwind CSS para coleta de avaliações institucionais da FeMASS.

## Configuração

Crie um arquivo `.env` na raiz do projeto. Ele é ignorado pelo Git e não deve receber credenciais ou tokens — tudo que começa com `VITE_` é incorporado ao bundle público do navegador.

```env
# URL pública da API. Sem barra no fim.
VITE_API_BASE_URL=http://localhost:8080

# Código da campanha consultada no catálogo e no endpoint público
# /campanhas/{codigo}/disponibilidade.
VITE_CPA_CAMPAIGN=cpa-2026

# Mensagem padrão quando a campanha estiver indisponível.
VITE_CPA_CAMPAIGN_UNAVAILABLE_MESSAGE=A pesquisa está indisponível no momento. Tente novamente mais tarde.

# Porta HTTP do container Nginx ao executar Docker Compose.
FRONTEND_PORT=5173
```

Para desenvolvimento local, execute `npm run dev`. Para servir a imagem de produção, execute:

```bash
docker compose up -d --build
```

O `VITE_API_BASE_URL` é definido durante o build da imagem; reconstrua o container após alterá-lo.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Estrutura principal

- `src/app`: páginas da aplicação.
- `src/components/layout`: cabeçalho e rodapé.
- `src/components/survey`: fluxo de avaliação, etapas e componentes de UI.
- `src/lib`: tipos e dados base da pesquisa.
- `src/services`: ponto preparado para futura integração REST.

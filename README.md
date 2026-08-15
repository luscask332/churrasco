# Churrasco de 18 anos — convite + painel

## Estrutura
- `convite.html` — página pública que você manda pros convidados (rota `/`)
- `painel.html` — só sua, mostra confirmados/não vão (rota `/painel`)
- `api/rsvp.js` — função serverless que salva e lê as confirmações no Vercel KV

## Passo a passo pra colocar no ar

1. **Suba esses arquivos pra um repositório no GitHub** (ou use `vercel deploy` direto pela CLI, se preferir).

2. **Crie o projeto na Vercel** importando esse repositório em https://vercel.com/new

3. **Adicione um banco Vercel KV:**
   - No projeto, vá em **Storage → Create Database → KV** (hoje aparece como integração Upstash Redis).
   - Conecte o KV ao projeto. Isso cria automaticamente as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`.

4. **Adicione a variável do PIN do painel:**
   - Em **Settings → Environment Variables**, crie `ADMIN_PIN` com o valor que você quiser (ex: `1808`).
   - Essa é a única coisa que controla o acesso ao painel — não fica mais escrita no código.

5. **Configure a data do evento:**
   - Abra `convite.html`, procure por `CONFIG` no `<script>` e ajuste `data`, `hora`, `local` e `dataHoraEvento` (usada pro contador regressivo).

6. **Deploy.** Depois disso:
   - `seusite.vercel.app/` → convite
   - `seusite.vercel.app/painel` → painel (pede o PIN)

## Por que ficou assim
- O convite só faz um `POST /api/rsvp` quando alguém confirma — não precisa de PIN.
- O painel faz `GET /api/rsvp?pin=...` — o servidor confere o PIN contra `ADMIN_PIN` antes de devolver qualquer dado. Se alguém tentar acessar a API direto sem o PIN certo, recebe erro 401 e nada é revelado.

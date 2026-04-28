# PIX One Cent — Age Verify

Validação de maioridade usando um Pix de R$ 0,01 como prova de identidade bancária. Em vez de pedir upload de documento ou autodeclaração, o sistema gera uma cobrança Pix vinculada ao CPF/CNPJ informado e, após o pagamento, cruza os dados com fontes externas para confirmar a idade do titular.

## Como funciona

1. Usuário informa CPF ou CNPJ
2. Backend cria uma cobrança de R$ 0,01 na Woovi com `ensureSameTaxID: true` — a própria infraestrutura da Woovi bloqueia o pagamento se o CPF de quem paga for diferente do informado
3. QR Code é exibido na tela
4. Polling automático detecta o pagamento e avança o fluxo
5. *(Em breve)* CPF confirmado é consultado na BigBoost para obter data de nascimento
6. *(Em breve)* Idade calculada e acesso liberado ou bloqueado

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Woovi API** — geração de cobranças Pix
- **BigBoost** — consulta de dados cadastrais *(em breve)*
- **Vitest** — testes de integração das rotas de API
- **Tailwind CSS v4**

## Variáveis de ambiente

```env
# Woovi
WOOVI_AUTH=sua_chave_base64_aqui
WOOVI_API_URL=https://api.woovi-sandbox.com/api/v1/charge

# BigBoost (BigDataCorp)
BIGBOOST_ACCESS_TOKEN=seu_access_token
BIGBOOST_TOKEN_ID=seu_token_id
```

- `WOOVI_AUTH` — obtida no painel da Woovi em **Configurações → API** (formato `ClientId:ClientSecret` em base64)
- `WOOVI_API_URL` — use a URL sandbox para testes; troque pela URL de produção para ir ao ar
- `BIGBOOST_ACCESS_TOKEN` e `BIGBOOST_TOKEN_ID` — obtidas em [plataforma.bigdatacorp.com.br](https://plataforma.bigdatacorp.com.br); usadas para consultar o dataset `basic_data` e obter data de nascimento pelo CPF

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` para ver a landing page e `http://localhost:3000/validate` para o fluxo de validação.

## Testes

```bash
npm test
```

Os testes cobrem as rotas de webhook e um teste de integração que envia o payload de cobrança para `https://mateus.requestcatcher.com/charge` para inspeção visual do request.

## Estrutura

```
app/
├── page.tsx                  # Landing page
├── validate/page.tsx         # Fluxo de validação (CPF → QR → confirmação)
└── api/
    ├── charge/
    │   ├── route.ts          # POST — cria cobrança na Woovi
    │   ├── [id]/route.ts     # GET  — consulta status da cobrança
    │   ├── woovi.ts          # Auth e URL da Woovi
    │   └── charge.test.ts    # Teste de integração com requestcatcher
    └── webhook/
        ├── route.ts          # POST/GET — recebe eventos da Woovi
        └── webhook.test.ts   # Testes do webhook
```

## Motivação

A Lei nº 14.811/2024 (ECA Digital) obriga plataformas digitais a verificar maioridade, mas não define como. Autodeclaração não protege ninguém. Este projeto explora o Pix como mecanismo de KYC leve: o banco já verificou a identidade do titular — a plataforma apenas lê o resultado.
<<<<<<< HEAD
# Cabine do Glória FC — Bot Discord Copa 2026

Bot modular para servidor de torcida/comentários da Copa 2026. O MVP usa **Node.js**, **discord.js**, **slash commands**, **dotenv** e arquivos **JSON locais**.

## O que o bot faz

- Consulta jogos do dia e por data.
- Consulta jogos por seleção, grupo e fase.
- Mostra transmissão com fallback `Transmissão: a definir`.
- Envia lembretes automáticos 60, 30 e 10 minutos antes do jogo.
- Sistema de palpites/bolão com ranking.
- Ranking de atividade por mensagens, reações e voz.
- Enquetes rápidas com reações.

## Instalação local

```bash
npm install
cp .env.example .env
```

Edite o `.env`:

```env
DISCORD_TOKEN=token_do_bot
CLIENT_ID=id_da_aplicacao
GUILD_ID=id_do_servidor_de_teste
TIMEZONE=America/Sao_Paulo
REMINDER_CHECK_SECONDS=60
```

No portal do Discord Developer, ative os intents necessários:

- Server Members Intent, se quiser expandir atividade futuramente.
- Message Content Intent, necessário para pontuar mensagens.

## Registrar slash commands

Para registrar no servidor definido em `GUILD_ID`:

```bash
npm run deploy
```

Se remover `GUILD_ID`, o script registra comandos globalmente. Comandos globais podem demorar para aparecer.

## Rodar o bot

```bash
npm start
```

## Comandos principais

### Jogos

- `/jogos`
- `/jogos data:13/06`
- `/jogo time:Brasil`
- `/time nome:Brasil`
- `/brasil`
- `/argentina`
- `/proximos quantidade:10`
- `/grupo nome:C`
- `/fase nome:oitavas`
- `/transmissao time1:Brasil time2:Marrocos`

### Lembretes

- `/config-lembretes canal:#canal`
- `/config-cargo-lembrete cargo:@Torcedores`
- `/lembretes status`
- `/lembretes ligar`
- `/lembretes desligar`

Também é possível usar:

- `/config canal-lembretes canal:#canal`
- `/config cargo-torcedores cargo:@Torcedores`
- `/config ver`

Os lembretes são enviados 60, 30 e 10 minutos antes do horário da partida, respeitando o fuso `America/Sao_Paulo`.

## Como editar transmissões

Edite `src/data/transmissoes.json`:

```json
[
  {
    "matchId": "2026-06-13-grupo-c-brasil-marrocos",
    "transmissao": ["Globo", "SporTV", "CazéTV"],
    "observacoes": "Cobertura principal no Brasil"
  }
]
```

Se não existir transmissão para um jogo, o bot mostra `Transmissão: a definir`.

## Bolão e palpites

Comandos:

- `/palpite jogo:<autocomplete> vencedor:Brasil placar:2x0`
- `/meus-palpites`
- `/ranking-palpites`
- `/resultado jogo:<autocomplete> gols1:2 gols2:0`
- `/fechar-palpite jogo:<autocomplete>`
- `/abrir-palpite jogo:<autocomplete>`

### Regra de pontuação implementada

- Acertou vencedor ou empate: **+3 pontos**
- Acertou placar exato: **+5 pontos**
- Se não acertou placar exato, mas acertou o saldo de gols: **+1 ponto**

Pontuação máxima por jogo: **8 pontos**.

Por padrão, palpites fecham 10 minutos antes do jogo. Esse valor fica em `src/data/guild-configs.json`, por guild.

## Ranking de atividade

Comandos:

- `/ranking-atividade`
- `/atividade usuario:@nome`
- `/reset-atividade`

Regra anti-spam do MVP:

- Mensagem válida com 4+ caracteres: +1 ponto.
- Cooldown de 30 segundos por usuário para mensagens.
- Reação: +1 ponto com cooldown de 20 segundos.
- Voz: +1 ponto a cada 5 minutos completos, com limite de 12 pontos por sessão.
- Mensagens repetidas em curto período são ignoradas.

## Enquetes

- `/enquete pergunta:"Quem vence?" op1:"Brasil" op2:"Empate" op3:"Marrocos"`
- `/melhor-em-campo jogo:<autocomplete>`
- `/enquete-transmissao jogo:<autocomplete>`

O bot cria embed e adiciona reações automaticamente.

## Hospedagem

### Railway ou Render

1. Suba o projeto em um repositório Git.
2. Configure as variáveis de ambiente:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID` opcional
   - `TIMEZONE=America/Sao_Paulo`
3. Build command:

```bash
npm install
```

4. Start command:

```bash
npm start
```

Atenção: JSON local funciona bem no MVP, mas em hospedagens com filesystem efêmero você pode perder dados em redeploys. Para produção real, migre persistência para SQLite, PostgreSQL, Redis ou outro storage persistente.

### VPS

```bash
npm install
npm run deploy
npm start
```

Para manter online, use PM2:

```bash
npm i -g pm2
pm2 start src/index.js --name cabine-gloria-bot
pm2 save
```

## Dados da Copa

Os jogos estão em `src/data/jogos-copa-2026.json` e foram gerados a partir do DOCX anexado. O arquivo contém:

- 72 jogos de fase de grupos
- 16 jogos de 16 avos
- 8 jogos de oitavas
- 4 jogos de quartas
- 2 semifinais
- disputa de 3º lugar
- final

Total: **104 jogos**.

## Próximos passos recomendados

- Migrar JSON para SQLite/PostgreSQL.
- Criar painel web simples para editar transmissões.
- Integrar API externa de resultados ao vivo.
- Criar alertas de escalação e fim de jogo.
- Criar cargo automático para campeões do bolão.
=======
# CopaBot
>>>>>>> 78d5c8a4f61211a0c90b26e9d1999c3be617e431

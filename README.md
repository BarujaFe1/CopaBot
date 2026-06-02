<div align="center">
  <img src="./assets/icon.png" alt="Cabine do Glória FC Logo" width="120" height="120" />
  <h1>Cabine do Glória FC</h1>
  <p><strong>Bot Discord para a Copa do Mundo 2026 · World Cup 2026 Discord Bot</strong></p>

  <p>
    <a href="#-português-pt-br">Português</a> •
    <a href="#-english-en">English</a> •
    <a href="#-comandos-principais">Comandos</a> •
    <a href="#-local-setup">Setup</a> •
    <a href="#-roadmap">Roadmap</a> •
    <a href="#-autor--author">Autor</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-18+-339933.svg?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/discord.js-14-5865F2.svg?style=for-the-badge&logo=discord&logoColor=white" alt="discord.js" />
    <img src="https://img.shields.io/badge/JavaScript-ESM-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/World%20Cup-2026-0B5FFF.svg?style=for-the-badge" alt="World Cup 2026" />
    <img src="https://img.shields.io/badge/License-MIT-yellowgreen.svg?style=for-the-badge" alt="License MIT" />
  </p>
</div>

---

# 🇧🇷 Português PT-BR

## 📖 Sobre o projeto

**Cabine do Glória FC** é um bot modular para Discord criado para comunidades de torcida, comentários ao vivo e interação durante a **Copa do Mundo 2026**.

O MVP foi construído com **Node.js**, **discord.js**, **slash commands**, **dotenv** e persistência inicial em arquivos **JSON locais**. O projeto também pode ser chamado de **CopaBot**, funcionando como uma base extensível para calendário de jogos, transmissões, lembretes, palpites, ranking de atividade e enquetes dentro de um servidor Discord.

> Um bot pensado para transformar o servidor em uma verdadeira cabine de transmissão: informação, disputa, participação e resenha em tempo real.

---

## ✨ Funcionalidades

### ⚽ Jogos da Copa

- Consulta jogos do dia e por data.
- Consulta partidas por seleção, grupo ou fase.
- Exibe próximos jogos em lista rápida.
- Mostra transmissão com fallback automático: `Transmissão: a definir`.
- Base local com os **104 jogos da Copa 2026**.

### ⏰ Lembretes automáticos

- Alertas programados **60, 30 e 10 minutos** antes da partida.
- Canal de lembretes configurável por servidor.
- Cargo de torcedores configurável para menções.
- Respeita o fuso horário `America/Sao_Paulo`.

### 🏆 Bolão e palpites

- Palpites por jogo com placar e vencedor.
- Fechamento automático antes da partida.
- Ranking de palpites.
- Registro de resultado oficial.
- Abertura e fechamento manual de palpites por jogo.

### 📊 Ranking de atividade

- Pontuação por mensagens, reações e participação em voz.
- Cooldowns anti-spam.
- Consulta individual de atividade por usuário.
- Reset administrativo do ranking.

### 📣 Enquetes rápidas

- Enquetes com pergunta personalizada.
- Votação de melhor em campo.
- Enquete sobre transmissão.
- Criação automática de embed e reações.

### 🧩 Arquitetura modular

- Comandos separados por responsabilidade.
- Dados organizados em JSON.
- Configuração por guild/servidor.
- Estrutura preparada para migração futura para SQLite, PostgreSQL, Redis ou outro storage persistente.

---

## 🚀 Tecnologias utilizadas

- **Node.js** — runtime JavaScript.
- **discord.js** — integração com a API do Discord.
- **Slash Commands** — comandos modernos do Discord.
- **dotenv** — variáveis de ambiente.
- **JSON local** — persistência simples para MVP.
- **PM2** — recomendado para manter o bot online em VPS.
- **Railway / Render** — opções rápidas de hospedagem.

---

## 📁 Estrutura do projeto

```txt
cabine-gloria-fc-bot/
├── src/
│   ├── index.js                    # Entrada principal do bot
│   ├── commands/                    # Slash commands
│   │   ├── jogos/                   # Comandos de jogos e calendário
│   │   ├── lembretes/               # Configuração e status dos lembretes
│   │   ├── palpite/                 # Bolão, resultados e ranking
│   │   ├── atividade/               # Ranking de atividade
│   │   └── enquetes/                # Enquetes rápidas
│   ├── data/
│   │   ├── jogos-copa-2026.json     # Base de jogos da Copa 2026
│   │   ├── transmissoes.json        # Transmissões por partida
│   │   └── guild-configs.json       # Configurações por servidor
│   ├── services/                    # Serviços de domínio
│   ├── utils/                       # Funções utilitárias
│   └── deploy-commands.js           # Registro dos slash commands
├── .env.example                     # Exemplo de variáveis de ambiente
├── package.json
├── README.md
└── LICENSE
```

> A estrutura acima representa a organização recomendada. Ajuste os nomes conforme a estrutura real do seu repositório.

---

## ⚙️ Instalação local

### Pré-requisitos

- Node.js 18+
- NPM ou outro gerenciador compatível
- Aplicação criada no [Discord Developer Portal](https://discord.com/developers/applications)
- Servidor de teste no Discord

### Passos

```bash
npm install
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DISCORD_TOKEN=token_do_bot
CLIENT_ID=id_da_aplicacao
GUILD_ID=id_do_servidor_de_teste
TIMEZONE=America/Sao_Paulo
REMINDER_CHECK_SECONDS=60
```

No **Discord Developer Portal**, ative os intents necessários:

- **Server Members Intent** — útil para expandir recursos de atividade futuramente.
- **Message Content Intent** — necessário para pontuar mensagens no ranking de atividade.

---

## 🧾 Registrar slash commands

Para registrar os comandos no servidor definido em `GUILD_ID`:

```bash
npm run deploy
```

Se `GUILD_ID` for removido, o script poderá registrar comandos globalmente. Comandos globais podem demorar para aparecer no Discord.

---

## ▶️ Rodar o bot

```bash
npm start
```

Se tudo estiver configurado corretamente, o bot ficará online no servidor e os comandos aparecerão no Discord.

---

## 🤖 Comandos principais

### ⚽ Jogos

```txt
/jogos
/jogos data:13/06
/jogo time:Brasil
/time nome:Brasil
/brasil
/argentina
/proximos quantidade:10
/grupo nome:C
/fase nome:oitavas
/transmissao time1:Brasil time2:Marrocos
```

### ⏰ Lembretes

```txt
/config-lembretes canal:#canal
/config-cargo-lembrete cargo:@Torcedores
/lembretes status
/lembretes ligar
/lembretes desligar
```

Também é possível usar:

```txt
/config canal-lembretes canal:#canal
/config cargo-torcedores cargo:@Torcedores
/config ver
```

Os lembretes são enviados **60, 30 e 10 minutos** antes do horário da partida, respeitando o fuso `America/Sao_Paulo`.

### 🏆 Bolão e palpites

```txt
/palpite jogo:<autocomplete> vencedor:Brasil placar:2x0
/meus-palpites
/ranking-palpites
/resultado jogo:<autocomplete> gols1:2 gols2:0
/fechar-palpite jogo:<autocomplete>
/abrir-palpite jogo:<autocomplete>
```

### 📊 Ranking de atividade

```txt
/ranking-atividade
/atividade usuario:@nome
/reset-atividade
```

### 📣 Enquetes

```txt
/enquete pergunta:"Quem vence?" op1:"Brasil" op2:"Empate" op3:"Marrocos"
/melhor-em-campo jogo:<autocomplete>
/enquete-transmissao jogo:<autocomplete>
```

---

## 📡 Como editar transmissões

Edite o arquivo `src/data/transmissoes.json`:

```json
[
  {
    "matchId": "2026-06-13-grupo-c-brasil-marrocos",
    "transmissao": ["Globo", "SporTV", "CazéTV"],
    "observacoes": "Cobertura principal no Brasil"
  }
]
```

Se não existir transmissão cadastrada para um jogo, o bot mostra:

```txt
Transmissão: a definir
```

---

## 🧮 Regras de pontuação

### Bolão

| Evento | Pontos |
|---|---:|
| Acertou vencedor ou empate | +3 |
| Acertou placar exato | +5 |
| Acertou saldo de gols, sem placar exato | +1 |

Pontuação máxima por jogo: **8 pontos**.

Por padrão, os palpites fecham **10 minutos antes do jogo**. Esse valor fica em `src/data/guild-configs.json`, por guild.

### Atividade

| Ação | Pontuação |
|---|---:|
| Mensagem válida com 4+ caracteres | +1 |
| Reação válida | +1 |
| Voz a cada 5 minutos completos | +1 |

Regras anti-spam do MVP:

- Cooldown de **30 segundos** por usuário para mensagens.
- Cooldown de **20 segundos** para reações.
- Limite de **12 pontos por sessão** em voz.
- Mensagens repetidas em curto período são ignoradas.

---

## ☁️ Hospedagem

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

> Atenção: JSON local funciona bem no MVP, mas hospedagens com filesystem efêmero podem perder dados em redeploys. Para produção real, migre a persistência para SQLite, PostgreSQL, Redis ou outro storage persistente.

### VPS com PM2

```bash
npm install
npm run deploy
npm start
```

Para manter o bot online:

```bash
npm i -g pm2
pm2 start src/index.js --name cabine-gloria-bot
pm2 save
```

---

## 🗂️ Dados da Copa

Os jogos estão em `src/data/jogos-copa-2026.json`. O arquivo contém:

- 72 jogos de fase de grupos
- 16 jogos de 16 avos
- 8 jogos de oitavas
- 4 jogos de quartas
- 2 semifinais
- disputa de 3º lugar
- final

Total: **104 jogos**.

---

## 🛡️ Segurança

- Nunca commite `.env`, tokens ou secrets.
- Use `.env.example` apenas como modelo.
- Use `GUILD_ID` em desenvolvimento para evitar deploy global acidental.
- Restrinja comandos administrativos a cargos confiáveis.
- Para produção, substitua JSON local por storage persistente.

---

## 🚧 Roadmap

- [ ] Migrar JSON para SQLite/PostgreSQL.
- [ ] Criar painel web simples para editar transmissões.
- [ ] Integrar API externa de resultados ao vivo.
- [ ] Criar alertas de escalação, início e fim de jogo.
- [ ] Criar cargo automático para campeões do bolão.
- [ ] Histórico de campeões por edição.
- [ ] Cards compartilháveis de ranking e pódio.

---

# 🇺🇸 English EN

## 📖 About the project

**Cabine do Glória FC** is a modular Discord bot built for football communities, live match discussions and fan engagement during the **2026 FIFA World Cup**.

The MVP uses **Node.js**, **discord.js**, **slash commands**, **dotenv** and local **JSON files** for persistence. The project can also be referred to as **CopaBot**, serving as an extensible foundation for match schedules, broadcast information, reminders, predictions, activity rankings and quick polls inside a Discord server.

> A bot designed to turn your Discord server into a real match booth: information, competition, engagement and live football talk.

---

## ✨ Features

### ⚽ World Cup matches

- Search today's matches and matches by date.
- Search games by national team, group or stage.
- Display upcoming matches in a quick list.
- Show broadcast information with automatic fallback: `Broadcast: to be announced`.
- Local database with all **104 World Cup 2026 matches**.

### ⏰ Automatic reminders

- Scheduled alerts **60, 30 and 10 minutes** before each match.
- Configurable reminder channel per server.
- Configurable supporter role mentions.
- Uses `America/Sao_Paulo` timezone.

### 🏆 Predictions system

- Match predictions with score and winner.
- Automatic prediction closing before kick-off.
- Prediction ranking.
- Official result registration.
- Manual prediction opening and closing per match.

### 📊 Activity ranking

- Points for messages, reactions and voice activity.
- Anti-spam cooldowns.
- Individual user activity lookup.
- Administrative ranking reset.

### 📣 Quick polls

- Custom question polls.
- Man of the match polls.
- Broadcast-related polls.
- Automatic embed creation and reaction setup.

---

## 🚀 Tech stack

- **Node.js** — JavaScript runtime.
- **discord.js** — Discord API integration.
- **Slash Commands** — modern Discord commands.
- **dotenv** — environment variables.
- **Local JSON** — simple MVP persistence.
- **PM2** — recommended for VPS uptime.
- **Railway / Render** — quick hosting options.

---

## ⚙️ Local setup

### Requirements

- Node.js 18+
- NPM or compatible package manager
- Application created in the [Discord Developer Portal](https://discord.com/developers/applications)
- A Discord test server

### Steps

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_test_server_id
TIMEZONE=America/Sao_Paulo
REMINDER_CHECK_SECONDS=60
```

In the **Discord Developer Portal**, enable the required intents:

- **Server Members Intent** — useful for future activity features.
- **Message Content Intent** — required to score messages in the activity ranking.

---

## 🧾 Register slash commands

To register commands in the server defined by `GUILD_ID`:

```bash
npm run deploy
```

If `GUILD_ID` is removed, commands may be registered globally. Global commands can take longer to appear in Discord.

---

## ▶️ Run the bot

```bash
npm start
```

Once configured correctly, the bot will come online and the commands will be available in Discord.

---

## 🤖 Main commands

### ⚽ Matches

```txt
/jogos
/jogos data:13/06
/jogo time:Brasil
/time nome:Brasil
/brasil
/argentina
/proximos quantidade:10
/grupo nome:C
/fase nome:oitavas
/transmissao time1:Brasil time2:Marrocos
```

### ⏰ Reminders

```txt
/config-lembretes canal:#channel
/config-cargo-lembrete cargo:@Supporters
/lembretes status
/lembretes ligar
/lembretes desligar
```

Alternative configuration commands:

```txt
/config canal-lembretes canal:#channel
/config cargo-torcedores cargo:@Supporters
/config ver
```

Reminders are sent **60, 30 and 10 minutes** before each match, using the `America/Sao_Paulo` timezone.

### 🏆 Predictions

```txt
/palpite jogo:<autocomplete> vencedor:Brasil placar:2x0
/meus-palpites
/ranking-palpites
/resultado jogo:<autocomplete> gols1:2 gols2:0
/fechar-palpite jogo:<autocomplete>
/abrir-palpite jogo:<autocomplete>
```

### 📊 Activity ranking

```txt
/ranking-atividade
/atividade usuario:@name
/reset-atividade
```

### 📣 Polls

```txt
/enquete pergunta:"Who wins?" op1:"Brazil" op2:"Draw" op3:"Morocco"
/melhor-em-campo jogo:<autocomplete>
/enquete-transmissao jogo:<autocomplete>
```

---

## 📡 Editing broadcast data

Edit `src/data/transmissoes.json`:

```json
[
  {
    "matchId": "2026-06-13-grupo-c-brasil-marrocos",
    "transmissao": ["Globo", "SporTV", "CazéTV"],
    "observacoes": "Main coverage in Brazil"
  }
]
```

If no broadcast data exists for a match, the bot displays:

```txt
Broadcast: to be announced
```

---

## 🧮 Scoring rules

### Predictions

| Event | Points |
|---|---:|
| Correct winner or draw | +3 |
| Exact score | +5 |
| Correct goal difference without exact score | +1 |

Maximum score per match: **8 points**.

By default, predictions close **10 minutes before the match**. This value is stored in `src/data/guild-configs.json`, per guild.

### Activity

| Action | Points |
|---|---:|
| Valid message with 4+ characters | +1 |
| Valid reaction | +1 |
| Every completed 5 minutes in voice | +1 |

MVP anti-spam rules:

- **30-second** cooldown per user for messages.
- **20-second** cooldown for reactions.
- Maximum of **12 points per voice session**.
- Repeated messages in a short time window are ignored.

---

## ☁️ Hosting

### Railway or Render

1. Push the project to a Git repository.
2. Configure environment variables:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID` optional
   - `TIMEZONE=America/Sao_Paulo`
3. Build command:

```bash
npm install
```

4. Start command:

```bash
npm start
```

> Warning: local JSON works well for an MVP, but platforms with ephemeral filesystems may lose data on redeploys. For real production use, migrate persistence to SQLite, PostgreSQL, Redis or another persistent storage solution.

### VPS with PM2

```bash
npm install
npm run deploy
npm start
```

Keep the bot online with PM2:

```bash
npm i -g pm2
pm2 start src/index.js --name cabine-gloria-bot
pm2 save
```

---

## 🗂️ World Cup data

Matches are stored in `src/data/jogos-copa-2026.json`. The file contains:

- 72 group stage matches
- 16 round of 32 matches
- 8 round of 16 matches
- 4 quarter-finals
- 2 semi-finals
- third-place match
- final

Total: **104 matches**.

---

## 🛡️ Security

- Never commit `.env`, tokens or secrets.
- Use `.env.example` only as a template.
- Use `GUILD_ID` during development to avoid accidental global deployment.
- Restrict administrative commands to trusted roles.
- Replace local JSON with persistent storage for production.

---

## 🚧 Roadmap

- [ ] Migrate JSON persistence to SQLite/PostgreSQL.
- [ ] Build a simple web panel to edit broadcast data.
- [ ] Integrate an external live results API.
- [ ] Add lineup, kick-off and full-time alerts.
- [ ] Automatically assign roles to prediction winners.
- [ ] Add champion history by edition.
- [ ] Generate shareable ranking and podium cards.

---

## 🤝 Contribuição / Contributing

Contribuições são bem-vindas. Abra uma **issue** ou envie um **pull request** com melhorias, correções ou novas features.

Contributions are welcome. Open an **issue** or submit a **pull request** with improvements, fixes or new features.

```bash
git checkout -b feature/nova-feature
git commit -m "feat: adiciona nova feature"
git push origin feature/nova-feature
```

---

## 📄 Licença / License

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Autor / Author

Desenvolvido por **BarujaFe**.

- Portfólio: [barujafe.vercel.app](https://barujafe.vercel.app/)
- GitHub: [BarujaFe1](https://github.com/BarujaFe1)

---

<p align="center">
  <strong>Feito com ❤️ para a Copa do Mundo 2026.</strong><br />
  <strong>Made with ❤️ for the 2026 World Cup.</strong>
</p>

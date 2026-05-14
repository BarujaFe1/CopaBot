# Código completo — Cabine do Glória FC


## .env.example

```
DISCORD_TOKEN=cole_o_token_do_bot_aqui
CLIENT_ID=id_da_aplicacao_do_bot
GUILD_ID=id_do_servidor_para_registro_rapido
TIMEZONE=America/Sao_Paulo
REMINDER_CHECK_SECONDS=60

```


## .gitignore

```
node_modules/
.env
*.log
.DS_Store
src/data/*.tmp
src/data/*.bak

```


## README.md

```
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

```


## RELATORIO_EXTRACAO.md

```
# Relatório de extração — Copa 2026

Fonte: `Tabela Copa 2026 - Ordem cronológica.docx`.

## Campos identificados

- Grupos A a L com 4 seleções cada.
- Jogos da fase de grupos com data, hora, grupo, time1 e time2.
- Mata-mata com número do jogo, data, hora, time1/placeholder e time2/placeholder.

## Padrões encontrados

- Datas no formato `DD/MM`, normalizadas para `YYYY-MM-DD` com ano fixo 2026.
- Horários no formato `HH:MM`, preservados e normalizados para dois dígitos.
- Fase de grupos com grupos `Grupo A` a `Grupo L`.
- Mata-mata com placeholders como `Venc. Jogo 1`, `2º A`, `3º ABCDF`.

## Inconsistências tratadas

- O texto do DOCX está majoritariamente em tabelas, não em parágrafos.
- Há células vazias ao redor do `x`; elas foram ignoradas.
- `BRASIL` foi normalizado para `Brasil` para exibição e busca.
- Disputa de 3º lugar e final estavam sem times definidos; foram salvos como `A definir x A definir`.

## Resultado

- Grupos: 12
- Jogos extraídos: 104
- Arquivo gerado: `src/data/jogos-copa-2026.json`

```


## package.json

```json
{
  "name": "cabine-gloria-bot",
  "version": "1.0.0",
  "description": "Bot Discord modular para acompanhar a Copa 2026 na Cabine do Glória FC.",
  "main": "src/index.js",
  "type": "commonjs",
  "scripts": {
    "start": "node src/index.js",
    "deploy": "node src/deploy-commands.js",
    "validate:data": "node scripts/validate-data.js",
    "export:code": "node scripts/export-code-to-md.js"
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "dependencies": {
    "discord.js": "^14.16.3",
    "dotenv": "^16.4.5",
    "luxon": "^3.5.0"
  }
}

```


## scripts/export-code-to-md.js

```javascript
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const output = path.join(root, 'CODIGO_COMPLETO.md');
const ignore = new Set(['node_modules', '.git', 'CODIGO_COMPLETO.md']);
const exts = new Set(['.js', '.json', '.md', '.example', '']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    if (ignore.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

const parts = ['# Código completo — Cabine do Glória FC\n'];
for (const file of walk(root).sort()) {
  const rel = path.relative(root, file);
  const ext = path.extname(file);
  if (!exts.has(ext) && !rel.endsWith('.env.example')) continue;
  const lang = ext === '.js' ? 'javascript' : ext === '.json' ? 'json' : '';
  parts.push(`\n## ${rel}\n\n\`\`\`${lang}\n${fs.readFileSync(file, 'utf8')}\n\`\`\`\n`);
}
fs.writeFileSync(output, parts.join('\n'));
console.log(`Gerado: ${output}`);

```


## scripts/validate-data.js

```javascript
const jogos = require('../src/data/jogos-copa-2026.json');
const ids = new Set();
let errors = 0;
for (const game of jogos) {
  for (const key of ['id', 'data', 'hora', 'fase', 'time1', 'time2']) {
    if (!game[key]) { console.error(`Jogo sem ${key}:`, game); errors += 1; }
  }
  if (ids.has(game.id)) { console.error(`ID duplicado: ${game.id}`); errors += 1; }
  ids.add(game.id);
  if (!/^2026-\d{2}-\d{2}$/.test(game.data)) { console.error(`Data inválida: ${game.id}`); errors += 1; }
  if (!/^\d{2}:\d{2}$/.test(game.hora)) { console.error(`Hora inválida: ${game.id}`); errors += 1; }
}
console.log(`Jogos validados: ${jogos.length}`);
if (errors) process.exit(1);
console.log('✅ Dados OK.');

```


## src/commands/abrir-palpite.js

```javascript
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setBetLock } = require('../services/palpitesService');
const { autocompleteMatches } = require('../services/jogosService');
const { successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('abrir-palpite')
    .setDescription('Abre manualmente os palpites de um jogo.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt => opt.setName('jogo').setDescription('Jogo').setRequired(true).setAutocomplete(true)),
  async autocomplete(interaction) { await interaction.respond(autocompleteMatches(interaction.options.getFocused())); },
  async execute(interaction) {
    const result = setBetLock(interaction.guildId, interaction.options.getString('jogo'), 'open');
    if (!result.ok) return interaction.reply({ embeds: [errorEmbed('Erro', result.error)], ephemeral: true });
    await interaction.reply({ embeds: [successEmbed('Palpites abertos', `${result.match.time1} x ${result.match.time2}`)], ephemeral: true });
  }
};

```


## src/commands/argentina.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { getByTeam } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('argentina').setDescription('Mostra os próximos jogos da Argentina.'),
  async execute(interaction) {
    const games = getByTeam('Argentina', true);
    await interaction.reply({ embeds: gamesEmbeds('Próximos jogos da Argentina', 'Agenda da Argentina na Copa 2026.', games, match => getTransmission(match.id).text) });
  }
};

```


## src/commands/atividade.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { getUserActivity } = require('../services/atividadeService');
const { baseEmbed, warningEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('atividade')
    .setDescription('Mostra atividade de um usuário.')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const data = getUserActivity(interaction.guildId, user.id);
    if (!data) return interaction.reply({ embeds: [warningEmbed('Sem atividade', `${user} ainda não possui atividade registrada.`)], ephemeral: true });
    const embed = baseEmbed('📈 Atividade da torcida', `${user}`)
      .addFields(
        { name: 'Pontos', value: String(data.points), inline: true },
        { name: 'Mensagens', value: String(data.messages), inline: true },
        { name: 'Reações', value: String(data.reactions), inline: true },
        { name: 'Voz', value: `${data.voiceMinutes} min`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
};

```


## src/commands/brasil.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { getByTeam } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('brasil').setDescription('Mostra os próximos jogos do Brasil.'),
  async execute(interaction) {
    const games = getByTeam('Brasil', true);
    await interaction.reply({ embeds: gamesEmbeds('Próximo compromisso do Brasil', 'Agenda da Seleção Brasileira na Copa 2026.', games, match => getTransmission(match.id).text) });
  }
};

```


## src/commands/config-cargo-lembrete.js

```javascript
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setRole } = require('../services/configService');
const { successEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config-cargo-lembrete')
    .setDescription('Define o cargo marcado nos lembretes.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addRoleOption(opt => opt.setName('cargo').setDescription('Cargo a mencionar').setRequired(true)),
  async execute(interaction) {
    const role = interaction.options.getRole('cargo');
    setRole(interaction.guildId, 'torcedores', role.id);
    await interaction.reply({ embeds: [successEmbed('Cargo configurado', `Lembretes poderão marcar ${role}.`)], ephemeral: true });
  }
};

```


## src/commands/config-lembretes.js

```javascript
const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { setChannel } = require('../services/configService');
const { successEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config-lembretes')
    .setDescription('Define o canal de lembretes automáticos.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(opt => opt.setName('canal').setDescription('Canal de lembretes').addChannelTypes(ChannelType.GuildText).setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('canal');
    setChannel(interaction.guildId, 'lembretes', channel.id);
    await interaction.reply({ embeds: [successEmbed('Canal configurado', `Lembretes serão enviados em ${channel}.`)], ephemeral: true });
  }
};

```


## src/commands/config.js

```javascript
const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig, setChannel, setRole, setModule } = require('../services/configService');
const { successEmbed, baseEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configura canais, cargos e módulos do bot.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub => sub.setName('ver').setDescription('Mostra a configuração atual.'))
    .addSubcommand(sub => sub.setName('canal-jogos').setDescription('Define o canal padrão de jogos.').addChannelOption(opt => opt.setName('canal').setDescription('Canal').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(sub => sub.setName('canal-lembretes').setDescription('Define o canal de lembretes.').addChannelOption(opt => opt.setName('canal').setDescription('Canal').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(sub => sub.setName('canal-enquetes').setDescription('Define o canal de enquetes.').addChannelOption(opt => opt.setName('canal').setDescription('Canal').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(sub => sub.setName('cargo-torcedores').setDescription('Define o cargo marcado nos lembretes.').addRoleOption(opt => opt.setName('cargo').setDescription('Cargo').setRequired(true)))
    .addSubcommand(sub => sub.setName('modulo').setDescription('Liga ou desliga um módulo.').addStringOption(opt => opt.setName('nome').setDescription('jogos, lembretes, palpites, atividade, enquetes').setRequired(true)).addStringOption(opt => opt.setName('status').setDescription('on/off').setRequired(true).addChoices({ name: 'on', value: 'on' }, { name: 'off', value: 'off' }))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    if (sub === 'ver') {
      const c = getGuildConfig(guildId);
      const embed = baseEmbed('⚙️ Configuração da Cabine', 'Configuração atual deste servidor.')
        .addFields(
          { name: 'Canais', value: `Jogos: ${c.canais.jogos ? `<#${c.canais.jogos}>` : 'não definido'}\nLembretes: ${c.canais.lembretes ? `<#${c.canais.lembretes}>` : 'não definido'}\nEnquetes: ${c.canais.enquetes ? `<#${c.canais.enquetes}>` : 'não definido'}` },
          { name: 'Cargos', value: `Torcedores: ${c.cargos.torcedores ? `<@&${c.cargos.torcedores}>` : 'não definido'}` },
          { name: 'Módulos', value: Object.entries(c.modulos).map(([k, v]) => `${k}: ${v ? 'on' : 'off'}`).join('\n') },
          { name: 'Palpites', value: `Bloqueio: ${c.palpites.bloqueioMinutos} min antes do jogo` }
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (sub.startsWith('canal-')) {
      const channel = interaction.options.getChannel('canal');
      const key = sub.replace('canal-', '') === 'jogos' ? 'jogos' : sub.replace('canal-', '');
      setChannel(guildId, key, channel.id);
      return interaction.reply({ embeds: [successEmbed('Configuração salva', `Canal de ${key} definido como ${channel}.`)], ephemeral: true });
    }
    if (sub === 'cargo-torcedores') {
      const role = interaction.options.getRole('cargo');
      setRole(guildId, 'torcedores', role.id);
      return interaction.reply({ embeds: [successEmbed('Configuração salva', `Cargo de torcedores definido como ${role}.`)], ephemeral: true });
    }
    if (sub === 'modulo') {
      const moduleName = interaction.options.getString('nome');
      const status = interaction.options.getString('status') === 'on';
      const allowed = ['jogos', 'lembretes', 'palpites', 'atividade', 'enquetes'];
      if (!allowed.includes(moduleName)) return interaction.reply({ embeds: [errorEmbed('Módulo inválido', `Use: ${allowed.join(', ')}`)], ephemeral: true });
      setModule(guildId, moduleName, status);
      return interaction.reply({ embeds: [successEmbed('Módulo atualizado', `${moduleName}: ${status ? 'on' : 'off'}`)], ephemeral: true });
    }
  }
};

```


## src/commands/enquete-transmissao.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { findMatch, autocompleteMatches } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { createReactionPoll } = require('../services/enqueteService');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('enquete-transmissao')
    .setDescription('Cria enquete para escolher onde assistir a um jogo.')
    .addStringOption(opt => opt.setName('jogo').setDescription('Jogo').setRequired(true).setAutocomplete(true)),
  async autocomplete(interaction) { await interaction.respond(autocompleteMatches(interaction.options.getFocused())); },
  async execute(interaction) {
    const match = findMatch(interaction.options.getString('jogo'));
    if (!match) return interaction.reply({ embeds: [errorEmbed('Jogo não encontrado', 'Use o autocomplete para escolher um jogo válido.')], ephemeral: true });
    const t = getTransmission(match.id).list;
    const options = t.length && t[0] !== 'A definir' ? t : ['A definir', 'Vamos decidir no dia'];
    await createReactionPoll(interaction, `Qual transmissão vamos assistir? ${match.time1} x ${match.time2}`, options);
  }
};

```


## src/commands/enquete.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { createReactionPoll } = require('../services/enqueteService');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('enquete')
    .setDescription('Cria uma enquete rápida com reações.')
    .addStringOption(opt => opt.setName('pergunta').setDescription('Pergunta da enquete').setRequired(true))
    .addStringOption(opt => opt.setName('op1').setDescription('Opção 1').setRequired(true))
    .addStringOption(opt => opt.setName('op2').setDescription('Opção 2').setRequired(true))
    .addStringOption(opt => opt.setName('op3').setDescription('Opção 3').setRequired(false))
    .addStringOption(opt => opt.setName('op4').setDescription('Opção 4').setRequired(false))
    .addStringOption(opt => opt.setName('op5').setDescription('Opção 5').setRequired(false)),
  async execute(interaction) {
    const question = interaction.options.getString('pergunta');
    const options = ['op1', 'op2', 'op3', 'op4', 'op5'].map(name => interaction.options.getString(name)).filter(Boolean);
    if (options.length < 2) return interaction.reply({ embeds: [errorEmbed('Enquete inválida', 'Informe pelo menos duas opções.')], ephemeral: true });
    await createReactionPoll(interaction, question, options);
  }
};

```


## src/commands/fase.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { getByPhase } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fase')
    .setDescription('Mostra jogos por fase.')
    .addStringOption(option => option.setName('nome').setDescription('grupos, 16avos, oitavas, quartas, semifinal, final').setRequired(true)),
  async execute(interaction) {
    const name = interaction.options.getString('nome');
    const { phaseSlug, games } = getByPhase(name);
    if (!phaseSlug) return interaction.reply({ embeds: [errorEmbed('Fase não encontrada', 'Use: grupos, 16avos, oitavas, quartas, semifinal, final.')], ephemeral: true });
    await interaction.reply({ embeds: gamesEmbeds(`Fase: ${name}`, 'Jogos encontrados para a fase selecionada.', games, match => getTransmission(match.id).text) });
  }
};

```


## src/commands/fechar-palpite.js

```javascript
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setBetLock } = require('../services/palpitesService');
const { autocompleteMatches } = require('../services/jogosService');
const { successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fechar-palpite')
    .setDescription('Fecha manualmente os palpites de um jogo.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt => opt.setName('jogo').setDescription('Jogo').setRequired(true).setAutocomplete(true)),
  async autocomplete(interaction) { await interaction.respond(autocompleteMatches(interaction.options.getFocused())); },
  async execute(interaction) {
    const result = setBetLock(interaction.guildId, interaction.options.getString('jogo'), 'closed');
    if (!result.ok) return interaction.reply({ embeds: [errorEmbed('Erro', result.error)], ephemeral: true });
    await interaction.reply({ embeds: [successEmbed('Palpites fechados', `${result.match.time1} x ${result.match.time2}`)], ephemeral: true });
  }
};

```


## src/commands/grupo.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { getByGroup } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('grupo')
    .setDescription('Mostra informações e jogos de um grupo.')
    .addStringOption(option => option.setName('nome').setDescription('Letra do grupo. Exemplo: C').setRequired(true)),
  async execute(interaction) {
    const name = interaction.options.getString('nome');
    const { group, games } = getByGroup(name);
    if (!group) return interaction.reply({ embeds: [errorEmbed('Grupo não encontrado', 'Use uma letra de A a L. Exemplo: /grupo nome:C')], ephemeral: true });
    const embeds = gamesEmbeds(`${group.nome} — Copa 2026`, `Seleções: **${group.times.join(', ')}**`, games, match => getTransmission(match.id).text);
    await interaction.reply({ embeds });
  }
};

```


## src/commands/jogo.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { getByTeam, autocompleteTeams } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jogo')
    .setDescription('Mostra os próximos jogos de uma seleção.')
    .addStringOption(option => option.setName('time').setDescription('Nome da seleção. Exemplo: Brasil').setRequired(true).setAutocomplete(true)),
  async autocomplete(interaction) {
    await interaction.respond(autocompleteTeams(interaction.options.getFocused()));
  },
  async execute(interaction) {
    const team = interaction.options.getString('time');
    const games = getByTeam(team, true);
    if (!games.length) return interaction.reply({ embeds: [errorEmbed('Time não encontrado', `Não encontrei próximos jogos para “${team}”.`)], ephemeral: true });
    const embeds = gamesEmbeds(`Próximos jogos de ${team}`, 'Consulta sem depender de acentos ou letras maiúsculas.', games, match => getTransmission(match.id).text);
    await interaction.reply({ embeds });
  }
};

```


## src/commands/jogos.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { parseDateInput, getByDate } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds, errorEmbed } = require('../utils/embeds');
const { formatDateBR } = require('../utils/date');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jogos')
    .setDescription('Mostra os jogos do dia ou de uma data específica.')
    .addStringOption(option => option.setName('data').setDescription('Data no formato DD/MM. Exemplo: 13/06').setRequired(false)),
  async execute(interaction) {
    const input = interaction.options.getString('data');
    const parsed = parseDateInput(input);
    if (!parsed.ok) return interaction.reply({ embeds: [errorEmbed('Data inválida', parsed.error)], ephemeral: true });
    const games = getByDate(parsed.value);
    const title = input ? `Jogos de ${formatDateBR(parsed.value)} na Cabine` : 'Jogos de hoje na Cabine do Glória FC';
    const embeds = gamesEmbeds(title, games.length ? 'Agenda oficial da tabela carregada para a Copa 2026.' : 'Nenhuma partida encontrada para esta data.', games, match => getTransmission(match.id).text);
    await interaction.reply({ embeds });
  }
};

```


## src/commands/lembretes.js

```javascript
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig, setModule } = require('../services/configService');
const { baseEmbed, successEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lembretes')
    .setDescription('Gerencia lembretes automáticos.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub => sub.setName('status').setDescription('Mostra o status dos lembretes.'))
    .addSubcommand(sub => sub.setName('ligar').setDescription('Ativa lembretes.'))
    .addSubcommand(sub => sub.setName('desligar').setDescription('Desativa lembretes.')),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'ligar') {
      setModule(interaction.guildId, 'lembretes', true);
      return interaction.reply({ embeds: [successEmbed('Lembretes ligados', 'A Cabine vai avisar 1h, 30min e 10min antes das partidas.')], ephemeral: true });
    }
    if (sub === 'desligar') {
      setModule(interaction.guildId, 'lembretes', false);
      return interaction.reply({ embeds: [successEmbed('Lembretes desligados', 'Os avisos automáticos foram pausados.')], ephemeral: true });
    }
    const config = getGuildConfig(interaction.guildId);
    const embed = baseEmbed('⏰ Status dos lembretes', config.modulos.lembretes ? 'Lembretes ativos.' : 'Lembretes desativados.')
      .addFields(
        { name: 'Canal', value: config.canais.lembretes ? `<#${config.canais.lembretes}>` : 'Não definido', inline: true },
        { name: 'Cargo', value: config.cargos.torcedores ? `<@&${config.cargos.torcedores}>` : 'Não definido', inline: true },
        { name: 'Avisos', value: '60, 30 e 10 minutos antes do jogo', inline: false }
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

```


## src/commands/melhor-em-campo.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { findMatch, autocompleteMatches } = require('../services/jogosService');
const { createReactionPoll } = require('../services/enqueteService');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('melhor-em-campo')
    .setDescription('Cria enquete de melhor em campo para um jogo.')
    .addStringOption(opt => opt.setName('jogo').setDescription('Jogo').setRequired(true).setAutocomplete(true)),
  async autocomplete(interaction) { await interaction.respond(autocompleteMatches(interaction.options.getFocused())); },
  async execute(interaction) {
    const match = findMatch(interaction.options.getString('jogo'));
    if (!match) return interaction.reply({ embeds: [errorEmbed('Jogo não encontrado', 'Use o autocomplete para escolher um jogo válido.')], ephemeral: true });
    await createReactionPoll(interaction, `Melhor em campo: ${match.time1} x ${match.time2}`, [match.time1, match.time2, 'Outro jogador']);
  }
};

```


## src/commands/meus-palpites.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { getUserBets } = require('../services/palpitesService');
const { baseEmbed, warningEmbed } = require('../utils/embeds');
const { formatDateShort } = require('../utils/date');

module.exports = {
  data: new SlashCommandBuilder().setName('meus-palpites').setDescription('Mostra seus palpites registrados.'),
  async execute(interaction) {
    const bets = getUserBets(interaction.guildId, interaction.user.id);
    if (!bets.length) return interaction.reply({ embeds: [warningEmbed('Sem palpites', 'Você ainda não registrou palpites.')], ephemeral: true });
    const embed = baseEmbed('🎯 Meus palpites', 'Seus palpites cadastrados na Cabine.');
    embed.addFields(bets.slice(0, 25).map(({ match, bet }) => ({
      name: `${formatDateShort(match.data)} ${match.hora} — ${match.time1} x ${match.time2}`,
      value: `Vencedor: **${bet.winner}** • Placar: **${bet.score ? `${bet.score.gols1}x${bet.score.gols2}` : 'não informado'}**`
    })));
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

```


## src/commands/palpite.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { placeBet } = require('../services/palpitesService');
const { autocompleteMatches } = require('../services/jogosService');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { formatDateBR } = require('../utils/date');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('palpite')
    .setDescription('Registra seu palpite para um jogo.')
    .addStringOption(opt => opt.setName('jogo').setDescription('Jogo. Use o autocomplete.').setRequired(true).setAutocomplete(true))
    .addStringOption(opt => opt.setName('vencedor').setDescription('Time vencedor ou Empate').setRequired(true))
    .addStringOption(opt => opt.setName('placar').setDescription('Opcional. Exemplo: 2x0').setRequired(false)),
  async autocomplete(interaction) {
    await interaction.respond(autocompleteMatches(interaction.options.getFocused()));
  },
  async execute(interaction) {
    const result = placeBet({
      guildId: interaction.guildId,
      userId: interaction.user.id,
      matchQuery: interaction.options.getString('jogo'),
      winner: interaction.options.getString('vencedor'),
      score: interaction.options.getString('placar')
    });
    if (!result.ok) return interaction.reply({ embeds: [errorEmbed('Palpite não registrado', result.error)], ephemeral: true });
    const score = result.bet.score ? `${result.bet.score.gols1}x${result.bet.score.gols2}` : 'sem placar exato';
    const embed = successEmbed('Palpite registrado', `**${result.match.time1} x ${result.match.time2}**\n📅 ${formatDateBR(result.match.data)} às ${result.match.hora}\n🏁 Vencedor: **${result.bet.winner}**\n🎯 Placar: **${score}**`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

```


## src/commands/proximos.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { getUpcoming } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('proximos')
    .setDescription('Mostra os próximos jogos da tabela.')
    .addIntegerOption(option => option.setName('quantidade').setDescription('Quantidade de jogos, até 20.').setMinValue(1).setMaxValue(20)),
  async execute(interaction) {
    const limit = interaction.options.getInteger('quantidade') || 10;
    const games = getUpcoming(limit);
    await interaction.reply({ embeds: gamesEmbeds('Próximos jogos da Copa 2026', `Mostrando até ${limit} partidas.`, games, match => getTransmission(match.id).text) });
  }
};

```


## src/commands/ranking-atividade.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { getRanking } = require('../services/atividadeService');
const { baseEmbed, warningEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('ranking-atividade').setDescription('Mostra o ranking de atividade da torcida.'),
  async execute(interaction) {
    const ranking = getRanking(interaction.guildId, 10);
    if (!ranking.length) return interaction.reply({ embeds: [warningEmbed('Ranking vazio', 'Ainda não há atividade registrada neste servidor.')], ephemeral: true });
    const description = ranking.map((u, i) => `**${i + 1}.** <@${u.userId}> — **${u.points} pts** (${u.messages} msg, ${u.reactions} reações, ${u.voiceMinutes} min voz)`).join('\n');
    await interaction.reply({ embeds: [baseEmbed('🔥 Atividade da torcida', description)] });
  }
};

```


## src/commands/ranking-palpites.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { calculateRanking } = require('../services/palpitesService');
const { baseEmbed, warningEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('ranking-palpites').setDescription('Mostra o ranking do bolão.'),
  async execute(interaction) {
    const ranking = calculateRanking(interaction.guildId).slice(0, 10);
    if (!ranking.length) return interaction.reply({ embeds: [warningEmbed('Ranking vazio', 'Ainda não há jogos apurados com palpites pontuados.')], ephemeral: true });
    const description = ranking.map((item, index) => `**${index + 1}.** <@${item.userId}> — **${item.points} pts** (${item.bets} jogos, ${item.exact} placares exatos)`).join('\n');
    await interaction.reply({ embeds: [baseEmbed('🏆 Ranking do bolão', description)] });
  }
};

```


## src/commands/reset-atividade.js

```javascript
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { resetActivity } = require('../services/atividadeService');
const { successEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset-atividade')
    .setDescription('Zera o ranking de atividade deste servidor.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    resetActivity(interaction.guildId);
    await interaction.reply({ embeds: [successEmbed('Atividade zerada', 'O ranking de atividade foi reiniciado para este servidor.')], ephemeral: true });
  }
};

```


## src/commands/resultado.js

```javascript
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { registerResult } = require('../services/palpitesService');
const { autocompleteMatches } = require('../services/jogosService');
const { successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resultado')
    .setDescription('Cadastra o resultado de um jogo e libera a pontuação do bolão.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt => opt.setName('jogo').setDescription('Jogo').setRequired(true).setAutocomplete(true))
    .addIntegerOption(opt => opt.setName('gols1').setDescription('Gols do time 1').setRequired(true).setMinValue(0))
    .addIntegerOption(opt => opt.setName('gols2').setDescription('Gols do time 2').setRequired(true).setMinValue(0)),
  async autocomplete(interaction) { await interaction.respond(autocompleteMatches(interaction.options.getFocused())); },
  async execute(interaction) {
    const result = registerResult({
      matchQuery: interaction.options.getString('jogo'),
      gols1: interaction.options.getInteger('gols1'),
      gols2: interaction.options.getInteger('gols2'),
      userId: interaction.user.id
    });
    if (!result.ok) return interaction.reply({ embeds: [errorEmbed('Resultado não cadastrado', result.error)], ephemeral: true });
    await interaction.reply({ embeds: [successEmbed('Resultado cadastrado', `**${result.match.time1} ${result.result.gols1} x ${result.result.gols2} ${result.match.time2}**\nResultado usado no cálculo do ranking do bolão.`)] });
  }
};

```


## src/commands/time.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { getByTeam, autocompleteTeams } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Consulta próximos jogos por seleção.')
    .addStringOption(option => option.setName('nome').setDescription('Nome da seleção. Exemplo: Brasil').setRequired(true).setAutocomplete(true)),
  async autocomplete(interaction) { await interaction.respond(autocompleteTeams(interaction.options.getFocused())); },
  async execute(interaction) {
    const team = interaction.options.getString('nome');
    const games = getByTeam(team, true);
    if (!games.length) return interaction.reply({ embeds: [errorEmbed('Time não encontrado', `Não encontrei próximos jogos para “${team}”.`)], ephemeral: true });
    const embeds = gamesEmbeds(`Próximos jogos de ${team}`, 'Busca normalizada: ignora acentos e maiúsculas.', games, match => getTransmission(match.id).text);
    await interaction.reply({ embeds });
  }
};

```


## src/commands/transmissao.js

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { allGames } = require('../services/jogosService');
const { findTransmissionByTeams } = require('../services/transmissaoService');
const { baseEmbed, errorEmbed } = require('../utils/embeds');
const { formatDateBR } = require('../utils/date');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transmissao')
    .setDescription('Mostra onde vai passar um confronto.')
    .addStringOption(option => option.setName('time1').setDescription('Primeiro time. Exemplo: Brasil').setRequired(true))
    .addStringOption(option => option.setName('time2').setDescription('Segundo time. Exemplo: Marrocos').setRequired(true)),
  async execute(interaction) {
    const time1 = interaction.options.getString('time1');
    const time2 = interaction.options.getString('time2');
    const found = findTransmissionByTeams(allGames(), time1, time2);
    if (!found) return interaction.reply({ embeds: [errorEmbed('Confronto não encontrado', 'Não encontrei esse jogo na tabela carregada.')], ephemeral: true });
    const { match, transmission } = found;
    const embed = baseEmbed('📺 Transmissão do confronto', `**${match.time1} x ${match.time2}**`)
      .addFields(
        { name: 'Data e horário', value: `${formatDateBR(match.data)} às ${match.hora}`, inline: true },
        { name: 'Fase', value: match.grupo ? `${match.fase} • ${match.grupo}` : match.fase, inline: true },
        { name: 'Onde vai passar', value: transmission.text, inline: false }
      );
    if (transmission.observacoes) embed.addFields({ name: 'Observações', value: transmission.observacoes });
    await interaction.reply({ embeds: [embed] });
  }
};

```


## src/config/theme.js

```javascript
module.exports = {
  colors: {
    gold: 0xD4AF37,
    dark: 0x0B0B0D,
    success: 0x2ECC71,
    error: 0xE74C3C,
    warning: 0xF1C40F
  },
  footer: 'Cabine do Glória FC • Copa 2026',
  timezone: process.env.TIMEZONE || 'America/Sao_Paulo'
};

```


## src/data/atividade.json

```json
{}

```


## src/data/enquetes.json

```json
{}

```


## src/data/grupos-copa-2026.json

```json
[
  {
    "nome": "Grupo A",
    "times": [
      "México",
      "África do Sul",
      "Coreia do Sul",
      "Tchéquia"
    ]
  },
  {
    "nome": "Grupo B",
    "times": [
      "Canadá",
      "Bósnia",
      "Catar",
      "Suíça"
    ]
  },
  {
    "nome": "Grupo C",
    "times": [
      "Brasil",
      "Marrocos",
      "Haiti",
      "Escócia"
    ]
  },
  {
    "nome": "Grupo D",
    "times": [
      "Estados Unidos",
      "Paraguai",
      "Austrália",
      "Turquia"
    ]
  },
  {
    "nome": "Grupo E",
    "times": [
      "Alemanha",
      "Curaçao",
      "Costa do Marfim",
      "Equador"
    ]
  },
  {
    "nome": "Grupo F",
    "times": [
      "Holanda",
      "Japão",
      "Suécia",
      "Tunísia"
    ]
  },
  {
    "nome": "Grupo G",
    "times": [
      "Bélgica",
      "Egito",
      "Irã",
      "Nova Zelândia"
    ]
  },
  {
    "nome": "Grupo H",
    "times": [
      "Espanha",
      "Cabo Verde",
      "Arábia Saudita",
      "Uruguai"
    ]
  },
  {
    "nome": "Grupo I",
    "times": [
      "França",
      "Senegal",
      "Iraque",
      "Noruega"
    ]
  },
  {
    "nome": "Grupo J",
    "times": [
      "Argentina",
      "Argélia",
      "Áustria",
      "Jordânia"
    ]
  },
  {
    "nome": "Grupo K",
    "times": [
      "Portugal",
      "RD Congo",
      "Uzbequistão",
      "Colômbia"
    ]
  },
  {
    "nome": "Grupo L",
    "times": [
      "Inglaterra",
      "Croácia",
      "Gana",
      "Panamá"
    ]
  }
]

```


## src/data/guild-configs.json

```json
{}

```


## src/data/jogos-copa-2026.json

```json
[
  {
    "id": "2026-06-11-grupo-a-mexico-africa-do-sul",
    "ordem": 1,
    "data": "2026-06-11",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo A",
    "jogo": null,
    "time1": "México",
    "time2": "África do Sul"
  },
  {
    "id": "2026-06-11-grupo-a-coreia-do-sul-tchequia",
    "ordem": 2,
    "data": "2026-06-11",
    "hora": "23:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo A",
    "jogo": null,
    "time1": "Coreia do Sul",
    "time2": "Tchéquia"
  },
  {
    "id": "2026-06-12-grupo-b-canada-bosnia",
    "ordem": 3,
    "data": "2026-06-12",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo B",
    "jogo": null,
    "time1": "Canadá",
    "time2": "Bósnia"
  },
  {
    "id": "2026-06-12-grupo-d-estados-unidos-paraguai",
    "ordem": 4,
    "data": "2026-06-12",
    "hora": "22:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo D",
    "jogo": null,
    "time1": "Estados Unidos",
    "time2": "Paraguai"
  },
  {
    "id": "2026-06-13-grupo-b-catar-suica",
    "ordem": 5,
    "data": "2026-06-13",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo B",
    "jogo": null,
    "time1": "Catar",
    "time2": "Suíça"
  },
  {
    "id": "2026-06-13-grupo-c-brasil-marrocos",
    "ordem": 6,
    "data": "2026-06-13",
    "hora": "19:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo C",
    "jogo": null,
    "time1": "Brasil",
    "time2": "Marrocos"
  },
  {
    "id": "2026-06-13-grupo-c-haiti-escocia",
    "ordem": 7,
    "data": "2026-06-13",
    "hora": "22:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo C",
    "jogo": null,
    "time1": "Haiti",
    "time2": "Escócia"
  },
  {
    "id": "2026-06-14-grupo-d-australia-turquia",
    "ordem": 8,
    "data": "2026-06-14",
    "hora": "01:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo D",
    "jogo": null,
    "time1": "Austrália",
    "time2": "Turquia"
  },
  {
    "id": "2026-06-14-grupo-e-alemanha-curacao",
    "ordem": 9,
    "data": "2026-06-14",
    "hora": "14:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo E",
    "jogo": null,
    "time1": "Alemanha",
    "time2": "Curaçao"
  },
  {
    "id": "2026-06-14-grupo-f-holanda-japao",
    "ordem": 10,
    "data": "2026-06-14",
    "hora": "17:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo F",
    "jogo": null,
    "time1": "Holanda",
    "time2": "Japão"
  },
  {
    "id": "2026-06-14-grupo-e-costa-do-marfim-equador",
    "ordem": 11,
    "data": "2026-06-14",
    "hora": "20:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo E",
    "jogo": null,
    "time1": "Costa do Marfim",
    "time2": "Equador"
  },
  {
    "id": "2026-06-14-grupo-f-suecia-tunisia",
    "ordem": 12,
    "data": "2026-06-14",
    "hora": "23:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo F",
    "jogo": null,
    "time1": "Suécia",
    "time2": "Tunísia"
  },
  {
    "id": "2026-06-15-grupo-h-espanha-cabo-verde",
    "ordem": 13,
    "data": "2026-06-15",
    "hora": "13:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo H",
    "jogo": null,
    "time1": "Espanha",
    "time2": "Cabo Verde"
  },
  {
    "id": "2026-06-15-grupo-g-belgica-egito",
    "ordem": 14,
    "data": "2026-06-15",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo G",
    "jogo": null,
    "time1": "Bélgica",
    "time2": "Egito"
  },
  {
    "id": "2026-06-15-grupo-h-arabia-saudita-uruguai",
    "ordem": 15,
    "data": "2026-06-15",
    "hora": "19:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo H",
    "jogo": null,
    "time1": "Arábia Saudita",
    "time2": "Uruguai"
  },
  {
    "id": "2026-06-15-grupo-g-ira-nova-zelandia",
    "ordem": 16,
    "data": "2026-06-15",
    "hora": "22:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo G",
    "jogo": null,
    "time1": "Irã",
    "time2": "Nova Zelândia"
  },
  {
    "id": "2026-06-16-grupo-i-franca-senegal",
    "ordem": 17,
    "data": "2026-06-16",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo I",
    "jogo": null,
    "time1": "França",
    "time2": "Senegal"
  },
  {
    "id": "2026-06-16-grupo-i-iraque-noruega",
    "ordem": 18,
    "data": "2026-06-16",
    "hora": "19:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo I",
    "jogo": null,
    "time1": "Iraque",
    "time2": "Noruega"
  },
  {
    "id": "2026-06-16-grupo-j-argentina-argelia",
    "ordem": 19,
    "data": "2026-06-16",
    "hora": "22:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo J",
    "jogo": null,
    "time1": "Argentina",
    "time2": "Argélia"
  },
  {
    "id": "2026-06-17-grupo-j-austria-jordania",
    "ordem": 20,
    "data": "2026-06-17",
    "hora": "01:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo J",
    "jogo": null,
    "time1": "Áustria",
    "time2": "Jordânia"
  },
  {
    "id": "2026-06-17-grupo-k-portugal-rd-congo",
    "ordem": 21,
    "data": "2026-06-17",
    "hora": "14:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo K",
    "jogo": null,
    "time1": "Portugal",
    "time2": "RD Congo"
  },
  {
    "id": "2026-06-17-grupo-l-inglaterra-croacia",
    "ordem": 22,
    "data": "2026-06-17",
    "hora": "17:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo L",
    "jogo": null,
    "time1": "Inglaterra",
    "time2": "Croácia"
  },
  {
    "id": "2026-06-17-grupo-l-gana-panama",
    "ordem": 23,
    "data": "2026-06-17",
    "hora": "20:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo L",
    "jogo": null,
    "time1": "Gana",
    "time2": "Panamá"
  },
  {
    "id": "2026-06-17-grupo-k-uzbequistao-colombia",
    "ordem": 24,
    "data": "2026-06-17",
    "hora": "23:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo K",
    "jogo": null,
    "time1": "Uzbequistão",
    "time2": "Colômbia"
  },
  {
    "id": "2026-06-18-grupo-a-tchequia-africa-do-sul",
    "ordem": 25,
    "data": "2026-06-18",
    "hora": "13:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo A",
    "jogo": null,
    "time1": "Tchéquia",
    "time2": "África do Sul"
  },
  {
    "id": "2026-06-18-grupo-b-suica-bosnia",
    "ordem": 26,
    "data": "2026-06-18",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo B",
    "jogo": null,
    "time1": "Suíça",
    "time2": "Bósnia"
  },
  {
    "id": "2026-06-18-grupo-b-canada-catar",
    "ordem": 27,
    "data": "2026-06-18",
    "hora": "19:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo B",
    "jogo": null,
    "time1": "Canadá",
    "time2": "Catar"
  },
  {
    "id": "2026-06-18-grupo-a-mexico-coreia-do-sul",
    "ordem": 28,
    "data": "2026-06-18",
    "hora": "22:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo A",
    "jogo": null,
    "time1": "México",
    "time2": "Coreia do Sul"
  },
  {
    "id": "2026-06-19-grupo-d-estados-unidos-australia",
    "ordem": 29,
    "data": "2026-06-19",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo D",
    "jogo": null,
    "time1": "Estados Unidos",
    "time2": "Austrália"
  },
  {
    "id": "2026-06-19-grupo-c-escocia-marrocos",
    "ordem": 30,
    "data": "2026-06-19",
    "hora": "19:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo C",
    "jogo": null,
    "time1": "Escócia",
    "time2": "Marrocos"
  },
  {
    "id": "2026-06-19-grupo-c-brasil-haiti",
    "ordem": 31,
    "data": "2026-06-19",
    "hora": "21:30",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo C",
    "jogo": null,
    "time1": "Brasil",
    "time2": "Haiti"
  },
  {
    "id": "2026-06-20-grupo-d-turquia-paraguai",
    "ordem": 32,
    "data": "2026-06-20",
    "hora": "00:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo D",
    "jogo": null,
    "time1": "Turquia",
    "time2": "Paraguai"
  },
  {
    "id": "2026-06-20-grupo-f-holanda-suecia",
    "ordem": 33,
    "data": "2026-06-20",
    "hora": "14:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo F",
    "jogo": null,
    "time1": "Holanda",
    "time2": "Suécia"
  },
  {
    "id": "2026-06-20-grupo-e-alemanha-costa-do-marfim",
    "ordem": 34,
    "data": "2026-06-20",
    "hora": "17:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo E",
    "jogo": null,
    "time1": "Alemanha",
    "time2": "Costa do Marfim"
  },
  {
    "id": "2026-06-20-grupo-e-equador-curacao",
    "ordem": 35,
    "data": "2026-06-20",
    "hora": "21:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo E",
    "jogo": null,
    "time1": "Equador",
    "time2": "Curaçao"
  },
  {
    "id": "2026-06-21-grupo-f-tunisia-japao",
    "ordem": 36,
    "data": "2026-06-21",
    "hora": "01:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo F",
    "jogo": null,
    "time1": "Tunísia",
    "time2": "Japão"
  },
  {
    "id": "2026-06-21-grupo-h-espanha-arabia-saudita",
    "ordem": 37,
    "data": "2026-06-21",
    "hora": "13:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo H",
    "jogo": null,
    "time1": "Espanha",
    "time2": "Arábia Saudita"
  },
  {
    "id": "2026-06-21-grupo-g-belgica-ira",
    "ordem": 38,
    "data": "2026-06-21",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo G",
    "jogo": null,
    "time1": "Bélgica",
    "time2": "Irã"
  },
  {
    "id": "2026-06-21-grupo-h-uruguai-cabo-verde",
    "ordem": 39,
    "data": "2026-06-21",
    "hora": "19:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo H",
    "jogo": null,
    "time1": "Uruguai",
    "time2": "Cabo Verde"
  },
  {
    "id": "2026-06-21-grupo-g-nova-zelandia-egito",
    "ordem": 40,
    "data": "2026-06-21",
    "hora": "22:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo G",
    "jogo": null,
    "time1": "Nova Zelândia",
    "time2": "Egito"
  },
  {
    "id": "2026-06-22-grupo-j-argentina-austria",
    "ordem": 41,
    "data": "2026-06-22",
    "hora": "14:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo J",
    "jogo": null,
    "time1": "Argentina",
    "time2": "Áustria"
  },
  {
    "id": "2026-06-22-grupo-i-franca-iraque",
    "ordem": 42,
    "data": "2026-06-22",
    "hora": "18:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo I",
    "jogo": null,
    "time1": "França",
    "time2": "Iraque"
  },
  {
    "id": "2026-06-22-grupo-i-noruega-senegal",
    "ordem": 43,
    "data": "2026-06-22",
    "hora": "21:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo I",
    "jogo": null,
    "time1": "Noruega",
    "time2": "Senegal"
  },
  {
    "id": "2026-06-23-grupo-j-jordania-argelia",
    "ordem": 44,
    "data": "2026-06-23",
    "hora": "00:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo J",
    "jogo": null,
    "time1": "Jordânia",
    "time2": "Argélia"
  },
  {
    "id": "2026-06-23-grupo-k-portugal-uzbequistao",
    "ordem": 45,
    "data": "2026-06-23",
    "hora": "14:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo K",
    "jogo": null,
    "time1": "Portugal",
    "time2": "Uzbequistão"
  },
  {
    "id": "2026-06-23-grupo-l-inglaterra-gana",
    "ordem": 46,
    "data": "2026-06-23",
    "hora": "17:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo L",
    "jogo": null,
    "time1": "Inglaterra",
    "time2": "Gana"
  },
  {
    "id": "2026-06-23-grupo-l-panama-croacia",
    "ordem": 47,
    "data": "2026-06-23",
    "hora": "20:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo L",
    "jogo": null,
    "time1": "Panamá",
    "time2": "Croácia"
  },
  {
    "id": "2026-06-23-grupo-k-colombia-rd-congo",
    "ordem": 48,
    "data": "2026-06-23",
    "hora": "23:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo K",
    "jogo": null,
    "time1": "Colômbia",
    "time2": "RD Congo"
  },
  {
    "id": "2026-06-24-grupo-b-suica-canada",
    "ordem": 49,
    "data": "2026-06-24",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo B",
    "jogo": null,
    "time1": "Suíça",
    "time2": "Canadá"
  },
  {
    "id": "2026-06-24-grupo-b-bosnia-catar",
    "ordem": 50,
    "data": "2026-06-24",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo B",
    "jogo": null,
    "time1": "Bósnia",
    "time2": "Catar"
  },
  {
    "id": "2026-06-24-grupo-c-escocia-brasil",
    "ordem": 51,
    "data": "2026-06-24",
    "hora": "19:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo C",
    "jogo": null,
    "time1": "Escócia",
    "time2": "Brasil"
  },
  {
    "id": "2026-06-24-grupo-c-marrocos-haiti",
    "ordem": 52,
    "data": "2026-06-24",
    "hora": "19:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo C",
    "jogo": null,
    "time1": "Marrocos",
    "time2": "Haiti"
  },
  {
    "id": "2026-06-24-grupo-a-tchequia-mexico",
    "ordem": 53,
    "data": "2026-06-24",
    "hora": "22:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo A",
    "jogo": null,
    "time1": "Tchéquia",
    "time2": "México"
  },
  {
    "id": "2026-06-24-grupo-a-africa-do-sul-coreia-do-sul",
    "ordem": 54,
    "data": "2026-06-24",
    "hora": "22:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo A",
    "jogo": null,
    "time1": "África do Sul",
    "time2": "Coreia do Sul"
  },
  {
    "id": "2026-06-25-grupo-e-curacao-costa-do-marfim",
    "ordem": 55,
    "data": "2026-06-25",
    "hora": "17:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo E",
    "jogo": null,
    "time1": "Curaçao",
    "time2": "Costa do Marfim"
  },
  {
    "id": "2026-06-25-grupo-e-equador-alemanha",
    "ordem": 56,
    "data": "2026-06-25",
    "hora": "17:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo E",
    "jogo": null,
    "time1": "Equador",
    "time2": "Alemanha"
  },
  {
    "id": "2026-06-25-grupo-f-japao-suecia",
    "ordem": 57,
    "data": "2026-06-25",
    "hora": "20:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo F",
    "jogo": null,
    "time1": "Japão",
    "time2": "Suécia"
  },
  {
    "id": "2026-06-25-grupo-f-tunisia-holanda",
    "ordem": 58,
    "data": "2026-06-25",
    "hora": "20:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo F",
    "jogo": null,
    "time1": "Tunísia",
    "time2": "Holanda"
  },
  {
    "id": "2026-06-25-grupo-d-turquia-estados-unidos",
    "ordem": 59,
    "data": "2026-06-25",
    "hora": "23:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo D",
    "jogo": null,
    "time1": "Turquia",
    "time2": "Estados Unidos"
  },
  {
    "id": "2026-06-25-grupo-d-paraguai-australia",
    "ordem": 60,
    "data": "2026-06-25",
    "hora": "23:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo D",
    "jogo": null,
    "time1": "Paraguai",
    "time2": "Austrália"
  },
  {
    "id": "2026-06-26-grupo-i-noruega-franca",
    "ordem": 61,
    "data": "2026-06-26",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo I",
    "jogo": null,
    "time1": "Noruega",
    "time2": "França"
  },
  {
    "id": "2026-06-26-grupo-i-senegal-iraque",
    "ordem": 62,
    "data": "2026-06-26",
    "hora": "16:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo I",
    "jogo": null,
    "time1": "Senegal",
    "time2": "Iraque"
  },
  {
    "id": "2026-06-26-grupo-h-cabo-verde-arabia-saudita",
    "ordem": 63,
    "data": "2026-06-26",
    "hora": "21:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo H",
    "jogo": null,
    "time1": "Cabo Verde",
    "time2": "Arábia Saudita"
  },
  {
    "id": "2026-06-26-grupo-h-uruguai-espanha",
    "ordem": 64,
    "data": "2026-06-26",
    "hora": "21:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo H",
    "jogo": null,
    "time1": "Uruguai",
    "time2": "Espanha"
  },
  {
    "id": "2026-06-27-grupo-g-egito-ira",
    "ordem": 65,
    "data": "2026-06-27",
    "hora": "00:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo G",
    "jogo": null,
    "time1": "Egito",
    "time2": "Irã"
  },
  {
    "id": "2026-06-27-grupo-g-nova-zelandia-belgica",
    "ordem": 66,
    "data": "2026-06-27",
    "hora": "00:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo G",
    "jogo": null,
    "time1": "Nova Zelândia",
    "time2": "Bélgica"
  },
  {
    "id": "2026-06-27-grupo-l-panama-inglaterra",
    "ordem": 67,
    "data": "2026-06-27",
    "hora": "18:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo L",
    "jogo": null,
    "time1": "Panamá",
    "time2": "Inglaterra"
  },
  {
    "id": "2026-06-27-grupo-l-croacia-gana",
    "ordem": 68,
    "data": "2026-06-27",
    "hora": "18:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo L",
    "jogo": null,
    "time1": "Croácia",
    "time2": "Gana"
  },
  {
    "id": "2026-06-27-grupo-k-colombia-portugal",
    "ordem": 69,
    "data": "2026-06-27",
    "hora": "20:30",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo K",
    "jogo": null,
    "time1": "Colômbia",
    "time2": "Portugal"
  },
  {
    "id": "2026-06-27-grupo-k-rd-congo-uzbequistao",
    "ordem": 70,
    "data": "2026-06-27",
    "hora": "20:30",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo K",
    "jogo": null,
    "time1": "RD Congo",
    "time2": "Uzbequistão"
  },
  {
    "id": "2026-06-27-grupo-j-argelia-austria",
    "ordem": 71,
    "data": "2026-06-27",
    "hora": "23:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo J",
    "jogo": null,
    "time1": "Argélia",
    "time2": "Áustria"
  },
  {
    "id": "2026-06-27-grupo-j-jordania-argentina",
    "ordem": 72,
    "data": "2026-06-27",
    "hora": "23:00",
    "fase": "Fase de Grupos",
    "faseSlug": "grupos",
    "grupo": "Grupo J",
    "jogo": null,
    "time1": "Jordânia",
    "time2": "Argentina"
  },
  {
    "id": "2026-06-28-16avos-jogo-1-2-a-2-b",
    "ordem": 73,
    "data": "2026-06-28",
    "hora": "16:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 1",
    "time1": "2º A",
    "time2": "2º B"
  },
  {
    "id": "2026-06-29-16avos-jogo-2-1-c-2-f",
    "ordem": 74,
    "data": "2026-06-29",
    "hora": "14:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 2",
    "time1": "1º C",
    "time2": "2º F"
  },
  {
    "id": "2026-06-29-16avos-jogo-3-1-e-3-abcdf",
    "ordem": 75,
    "data": "2026-06-29",
    "hora": "17:30",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 3",
    "time1": "1º E",
    "time2": "3º ABCDF"
  },
  {
    "id": "2026-06-29-16avos-jogo-4-1-f-2-c",
    "ordem": 76,
    "data": "2026-06-29",
    "hora": "22:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 4",
    "time1": "1º F",
    "time2": "2º C"
  },
  {
    "id": "2026-06-30-16avos-jogo-5-2-e-2-i",
    "ordem": 77,
    "data": "2026-06-30",
    "hora": "14:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 5",
    "time1": "2º E",
    "time2": "2º I"
  },
  {
    "id": "2026-06-30-16avos-jogo-6-1-i-3-cdfgh",
    "ordem": 78,
    "data": "2026-06-30",
    "hora": "18:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 6",
    "time1": "1º I",
    "time2": "3º CDFGH"
  },
  {
    "id": "2026-06-30-16avos-jogo-7-1-a-3-cefhi",
    "ordem": 79,
    "data": "2026-06-30",
    "hora": "22:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 7",
    "time1": "1º A",
    "time2": "3º CEFHI"
  },
  {
    "id": "2026-07-01-16avos-jogo-8-1-l-3-ehijk",
    "ordem": 80,
    "data": "2026-07-01",
    "hora": "13:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 8",
    "time1": "1º L",
    "time2": "3º EHIJK"
  },
  {
    "id": "2026-07-01-16avos-jogo-9-1-g-3-aehij",
    "ordem": 81,
    "data": "2026-07-01",
    "hora": "17:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 9",
    "time1": "1º G",
    "time2": "3º AEHIJ"
  },
  {
    "id": "2026-07-01-16avos-jogo-10-1-d-3-befij",
    "ordem": 82,
    "data": "2026-07-01",
    "hora": "21:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 10",
    "time1": "1º D",
    "time2": "3º BEFIJ"
  },
  {
    "id": "2026-07-02-16avos-jogo-11-1-h-2-j",
    "ordem": 83,
    "data": "2026-07-02",
    "hora": "16:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 11",
    "time1": "1º H",
    "time2": "2º J"
  },
  {
    "id": "2026-07-02-16avos-jogo-12-2-k-2-l",
    "ordem": 84,
    "data": "2026-07-02",
    "hora": "20:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 12",
    "time1": "2º K",
    "time2": "2º L"
  },
  {
    "id": "2026-07-03-16avos-jogo-13-1-b-3-efgij",
    "ordem": 85,
    "data": "2026-07-03",
    "hora": "00:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 13",
    "time1": "1º B",
    "time2": "3º EFGIJ"
  },
  {
    "id": "2026-07-03-16avos-jogo-14-2-d-2-g",
    "ordem": 86,
    "data": "2026-07-03",
    "hora": "15:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 14",
    "time1": "2º D",
    "time2": "2º G"
  },
  {
    "id": "2026-07-03-16avos-jogo-15-1-j-2-h",
    "ordem": 87,
    "data": "2026-07-03",
    "hora": "19:00",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 15",
    "time1": "1º J",
    "time2": "2º H"
  },
  {
    "id": "2026-07-03-16avos-jogo-16-1-k-3-deijl",
    "ordem": 88,
    "data": "2026-07-03",
    "hora": "22:30",
    "fase": "16 Avos de Final",
    "faseSlug": "16avos",
    "grupo": null,
    "jogo": "Jogo 16",
    "time1": "1º K",
    "time2": "3º DEIJL"
  },
  {
    "id": "2026-07-04-oitavas-jogo-1-venc-jogo-1-venc-jogo-4",
    "ordem": 89,
    "data": "2026-07-04",
    "hora": "14:00",
    "fase": "Oitavas de Final",
    "faseSlug": "oitavas",
    "grupo": null,
    "jogo": "Jogo 1",
    "time1": "Venc. Jogo 1",
    "time2": "Venc. Jogo 4"
  },
  {
    "id": "2026-07-04-oitavas-jogo-2-venc-jogo-3-venc-jogo-6",
    "ordem": 90,
    "data": "2026-07-04",
    "hora": "18:00",
    "fase": "Oitavas de Final",
    "faseSlug": "oitavas",
    "grupo": null,
    "jogo": "Jogo 2",
    "time1": "Venc. Jogo 3",
    "time2": "Venc. Jogo 6"
  },
  {
    "id": "2026-07-05-oitavas-jogo-3-venc-jogo-2-venc-jogo-5",
    "ordem": 91,
    "data": "2026-07-05",
    "hora": "17:00",
    "fase": "Oitavas de Final",
    "faseSlug": "oitavas",
    "grupo": null,
    "jogo": "Jogo 3",
    "time1": "Venc. Jogo 2",
    "time2": "Venc. Jogo 5"
  },
  {
    "id": "2026-07-05-oitavas-jogo-4-venc-jogo-7-venc-jogo-8",
    "ordem": 92,
    "data": "2026-07-05",
    "hora": "21:00",
    "fase": "Oitavas de Final",
    "faseSlug": "oitavas",
    "grupo": null,
    "jogo": "Jogo 4",
    "time1": "Venc. Jogo 7",
    "time2": "Venc. Jogo 8"
  },
  {
    "id": "2026-07-06-oitavas-jogo-5-venc-jogo-12-venc-jogo-11",
    "ordem": 93,
    "data": "2026-07-06",
    "hora": "16:00",
    "fase": "Oitavas de Final",
    "faseSlug": "oitavas",
    "grupo": null,
    "jogo": "Jogo 5",
    "time1": "Venc. Jogo 12",
    "time2": "Venc. Jogo 11"
  },
  {
    "id": "2026-07-06-oitavas-jogo-6-venc-jogo-10-venc-jogo-9",
    "ordem": 94,
    "data": "2026-07-06",
    "hora": "21:00",
    "fase": "Oitavas de Final",
    "faseSlug": "oitavas",
    "grupo": null,
    "jogo": "Jogo 6",
    "time1": "Venc. Jogo 10",
    "time2": "Venc. Jogo 9"
  },
  {
    "id": "2026-07-07-oitavas-jogo-7-venc-jogo-15-venc-jogo-14",
    "ordem": 95,
    "data": "2026-07-07",
    "hora": "13:00",
    "fase": "Oitavas de Final",
    "faseSlug": "oitavas",
    "grupo": null,
    "jogo": "Jogo 7",
    "time1": "Venc. Jogo 15",
    "time2": "Venc. Jogo 14"
  },
  {
    "id": "2026-07-07-oitavas-jogo-8-venc-jogo-13-venc-jogo-16",
    "ordem": 96,
    "data": "2026-07-07",
    "hora": "17:00",
    "fase": "Oitavas de Final",
    "faseSlug": "oitavas",
    "grupo": null,
    "jogo": "Jogo 8",
    "time1": "Venc. Jogo 13",
    "time2": "Venc. Jogo 16"
  },
  {
    "id": "2026-07-09-quartas-jogo-1-venc-jogo-2-venc-jogo-1",
    "ordem": 97,
    "data": "2026-07-09",
    "hora": "17:00",
    "fase": "Quartas de Final",
    "faseSlug": "quartas",
    "grupo": null,
    "jogo": "Jogo 1",
    "time1": "Venc. Jogo 2",
    "time2": "Venc. Jogo 1"
  },
  {
    "id": "2026-07-10-quartas-jogo-2-venc-jogo-5-venc-jogo-6",
    "ordem": 98,
    "data": "2026-07-10",
    "hora": "16:00",
    "fase": "Quartas de Final",
    "faseSlug": "quartas",
    "grupo": null,
    "jogo": "Jogo 2",
    "time1": "Venc. Jogo 5",
    "time2": "Venc. Jogo 6"
  },
  {
    "id": "2026-07-11-quartas-jogo-3-venc-jogo-3-venc-jogo-4",
    "ordem": 99,
    "data": "2026-07-11",
    "hora": "18:00",
    "fase": "Quartas de Final",
    "faseSlug": "quartas",
    "grupo": null,
    "jogo": "Jogo 3",
    "time1": "Venc. Jogo 3",
    "time2": "Venc. Jogo 4"
  },
  {
    "id": "2026-07-11-quartas-jogo-4-venc-jogo-7-venc-jogo-8",
    "ordem": 100,
    "data": "2026-07-11",
    "hora": "22:00",
    "fase": "Quartas de Final",
    "faseSlug": "quartas",
    "grupo": null,
    "jogo": "Jogo 4",
    "time1": "Venc. Jogo 7",
    "time2": "Venc. Jogo 8"
  },
  {
    "id": "2026-07-14-semifinais-jogo-1-venc-jogo-1-venc-jogo-2",
    "ordem": 101,
    "data": "2026-07-14",
    "hora": "16:00",
    "fase": "Semifinais",
    "faseSlug": "semifinais",
    "grupo": null,
    "jogo": "Jogo 1",
    "time1": "Venc. Jogo 1",
    "time2": "Venc. Jogo 2"
  },
  {
    "id": "2026-07-15-semifinais-jogo-2-venc-jogo-3-venc-jogo-4",
    "ordem": 102,
    "data": "2026-07-15",
    "hora": "16:00",
    "fase": "Semifinais",
    "faseSlug": "semifinais",
    "grupo": null,
    "jogo": "Jogo 2",
    "time1": "Venc. Jogo 3",
    "time2": "Venc. Jogo 4"
  },
  {
    "id": "2026-07-18-terceiro-lugar-a-definir-a-definir",
    "ordem": 103,
    "data": "2026-07-18",
    "hora": "18:00",
    "fase": "Disputa de 3º Lugar",
    "faseSlug": "terceiro-lugar",
    "grupo": null,
    "jogo": null,
    "time1": "A definir",
    "time2": "A definir"
  },
  {
    "id": "2026-07-19-final-a-definir-a-definir",
    "ordem": 104,
    "data": "2026-07-19",
    "hora": "16:00",
    "fase": "Final",
    "faseSlug": "final",
    "grupo": null,
    "jogo": null,
    "time1": "A definir",
    "time2": "A definir"
  }
]

```


## src/data/lembretes-enviados.json

```json
{}

```


## src/data/palpite-locks.json

```json
{}

```


## src/data/palpites.json

```json
{}

```


## src/data/resultados.json

```json
{}

```


## src/data/transmissoes.json

```json
[
  {
    "matchId": "2026-06-13-grupo-c-brasil-marrocos",
    "transmissao": [
      "Globo",
      "SporTV",
      "CazéTV"
    ],
    "observacoes": "Exemplo editável. Confirme a grade oficial antes do jogo."
  },
  {
    "matchId": "2026-06-19-grupo-c-brasil-haiti",
    "transmissao": [
      "Globo",
      "SporTV"
    ],
    "observacoes": "Exemplo editável."
  },
  {
    "matchId": "2026-06-24-grupo-c-escocia-brasil",
    "transmissao": [
      "Globo",
      "SporTV",
      "Globoplay"
    ],
    "observacoes": "Exemplo editável."
  }
]

```


## src/deploy-commands.js

```javascript
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId) {
  console.error('Configure DISCORD_TOKEN e CLIENT_ID no .env.');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    if (guildId) {
      console.log(`Registrando ${commands.length} comandos no servidor ${guildId}...`);
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    } else {
      console.log(`Registrando ${commands.length} comandos globalmente...`);
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
    }
    console.log('✅ Comandos registrados com sucesso.');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
    process.exit(1);
  }
})();

```


## src/events/interactionCreate.js

```javascript
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (command?.autocomplete) {
        try { await command.autocomplete(interaction); } catch (error) { console.error(error); }
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`[command:${interaction.commandName}]`, error);
      const payload = { embeds: [errorEmbed('Erro inesperado', 'Algo deu errado ao executar este comando. Verifique os logs do bot.')] };
      if (interaction.deferred || interaction.replied) await interaction.followUp({ ...payload, ephemeral: true });
      else await interaction.reply({ ...payload, ephemeral: true });
    }
  }
};

```


## src/events/messageCreate.js

```javascript
const { addMessage } = require('../services/atividadeService');
const { getGuildConfig } = require('../services/configService');

module.exports = {
  name: 'messageCreate',
  execute(message) {
    if (!message.guild || message.author.bot) return;
    const config = getGuildConfig(message.guild.id);
    if (!config.modulos?.atividade) return;
    addMessage(message);
  }
};

```


## src/events/messageReactionAdd.js

```javascript
const { addReaction } = require('../services/atividadeService');
const { getGuildConfig } = require('../services/configService');

module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user) {
    if (reaction.partial) await reaction.fetch().catch(() => null);
    if (!reaction.message?.guildId || user.bot) return;
    const config = getGuildConfig(reaction.message.guildId);
    if (!config.modulos?.atividade) return;
    addReaction(reaction, user);
  }
};

```


## src/events/ready.js

```javascript
const { startReminderScheduler } = require('../services/reminderService');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Cabine do Glória FC online como ${client.user.tag}`);
    startReminderScheduler(client);
  }
};

```


## src/events/voiceStateUpdate.js

```javascript
const { voiceJoin, voiceLeave } = require('../services/atividadeService');
const { getGuildConfig } = require('../services/configService');

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    const guildId = oldState.guild.id;
    const config = getGuildConfig(guildId);
    if (!config.modulos?.atividade) return;
    if (!oldState.channelId && newState.channelId) voiceJoin(guildId, newState.id);
    if (oldState.channelId && !newState.channelId) voiceLeave(guildId, oldState.id);
    if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      voiceLeave(guildId, oldState.id);
      voiceJoin(guildId, newState.id);
    }
  }
};

```


## src/index.js

```javascript
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  if (command.data && command.execute) client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))) {
  const event = require(path.join(eventsPath, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
}

if (!process.env.DISCORD_TOKEN) {
  console.error('DISCORD_TOKEN não configurado. Copie .env.example para .env e preencha o token.');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);

```


## src/services/atividadeService.js

```javascript
const path = require('path');
const { readJson, writeJson } = require('../storage/jsonStore');
const { normalizeText } = require('../utils/normalize');

const filePath = path.join(__dirname, '..', 'data', 'atividade.json');
const messageCooldownMs = 30_000;
const reactionCooldownMs = 20_000;

function getData() { return readJson(filePath, {}); }
function saveData(data) { writeJson(filePath, data); }

function ensureUser(data, guildId, userId) {
  data[guildId] ||= { users: {} };
  data[guildId].users[userId] ||= {
    userId,
    points: 0,
    messages: 0,
    reactions: 0,
    voiceMinutes: 0,
    lastMessageAt: null,
    lastMessageKey: null,
    lastReactionAt: null,
    voiceJoinAt: null
  };
  return data[guildId].users[userId];
}

function addMessage(message) {
  if (!message.guild || message.author.bot) return;
  const content = normalizeText(message.content || '');
  if (content.length < 4) return;
  const now = Date.now();
  const data = getData();
  const user = ensureUser(data, message.guild.id, message.author.id);
  const lastMessageAt = user.lastMessageAt ? Date.parse(user.lastMessageAt) : 0;
  if (now - lastMessageAt < messageCooldownMs) return;
  if (user.lastMessageKey === content && now - lastMessageAt < 5 * 60_000) return;
  user.messages += 1;
  user.points += 1;
  user.lastMessageAt = new Date(now).toISOString();
  user.lastMessageKey = content;
  saveData(data);
}

function addReaction(reaction, userObj) {
  const guildId = reaction.message.guildId;
  if (!guildId || userObj.bot) return;
  const now = Date.now();
  const data = getData();
  const user = ensureUser(data, guildId, userObj.id);
  const lastReactionAt = user.lastReactionAt ? Date.parse(user.lastReactionAt) : 0;
  if (now - lastReactionAt < reactionCooldownMs) return;
  user.reactions += 1;
  user.points += 1;
  user.lastReactionAt = new Date(now).toISOString();
  saveData(data);
}

function voiceJoin(guildId, userId) {
  const data = getData();
  const user = ensureUser(data, guildId, userId);
  user.voiceJoinAt = new Date().toISOString();
  saveData(data);
}

function voiceLeave(guildId, userId) {
  const data = getData();
  const user = ensureUser(data, guildId, userId);
  if (!user.voiceJoinAt) return;
  const minutes = Math.floor((Date.now() - Date.parse(user.voiceJoinAt)) / 60000);
  if (minutes >= 5) {
    const points = Math.min(Math.floor(minutes / 5), 12);
    user.voiceMinutes += minutes;
    user.points += points;
  }
  user.voiceJoinAt = null;
  saveData(data);
}

function getRanking(guildId, limit = 10) {
  const users = Object.values(getData()[guildId]?.users || {});
  return users.sort((a, b) => b.points - a.points).slice(0, limit);
}

function getUserActivity(guildId, userId) {
  const data = getData();
  return data[guildId]?.users?.[userId] || null;
}

function resetActivity(guildId) {
  const data = getData();
  data[guildId] = { users: {} };
  saveData(data);
}

module.exports = { addMessage, addReaction, voiceJoin, voiceLeave, getRanking, getUserActivity, resetActivity };

```


## src/services/configService.js

```javascript
const path = require('path');
const { readJson, writeJson } = require('../storage/jsonStore');
const { timezone } = require('../config/theme');

const filePath = path.join(__dirname, '..', 'data', 'guild-configs.json');

const defaultGuildConfig = {
  timezone,
  canais: {
    jogos: null,
    lembretes: null,
    enquetes: null
  },
  cargos: {
    torcedores: null
  },
  modulos: {
    jogos: true,
    lembretes: false,
    palpites: true,
    atividade: true,
    enquetes: true
  },
  palpites: {
    bloqueioMinutos: 10
  }
};

function getAllConfigs() {
  return readJson(filePath, {});
}

function getGuildConfig(guildId) {
  const all = getAllConfigs();
  return { ...defaultGuildConfig, ...(all[guildId] || {}), canais: { ...defaultGuildConfig.canais, ...((all[guildId] || {}).canais || {}) }, cargos: { ...defaultGuildConfig.cargos, ...((all[guildId] || {}).cargos || {}) }, modulos: { ...defaultGuildConfig.modulos, ...((all[guildId] || {}).modulos || {}) }, palpites: { ...defaultGuildConfig.palpites, ...((all[guildId] || {}).palpites || {}) } };
}

function saveGuildConfig(guildId, config) {
  const all = getAllConfigs();
  all[guildId] = config;
  writeJson(filePath, all);
  return config;
}

function updateGuildConfig(guildId, updater) {
  const current = getGuildConfig(guildId);
  const next = updater(current) || current;
  return saveGuildConfig(guildId, next);
}

function setChannel(guildId, key, channelId) {
  return updateGuildConfig(guildId, config => {
    config.canais[key] = channelId;
    return config;
  });
}

function setRole(guildId, key, roleId) {
  return updateGuildConfig(guildId, config => {
    config.cargos[key] = roleId;
    return config;
  });
}

function setModule(guildId, moduleName, enabled) {
  return updateGuildConfig(guildId, config => {
    config.modulos[moduleName] = Boolean(enabled);
    return config;
  });
}

module.exports = { defaultGuildConfig, getAllConfigs, getGuildConfig, saveGuildConfig, updateGuildConfig, setChannel, setRole, setModule };

```


## src/services/enqueteService.js

```javascript
const path = require('path');
const { readJson, writeJson } = require('../storage/jsonStore');
const { baseEmbed } = require('../utils/embeds');
const { colors } = require('../config/theme');

const filePath = path.join(__dirname, '..', 'data', 'enquetes.json');
const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];

function getPolls() { return readJson(filePath, {}); }
function savePolls(data) { writeJson(filePath, data); }

function buildPollEmbed(question, options, authorTag) {
  const description = options.map((option, index) => `${emojis[index]} ${option}`).join('\n');
  return baseEmbed('📊 Enquete no ar', `**${question}**\n\n${description}`, colors.gold)
    .addFields({ name: 'Como votar', value: 'Clique na reação correspondente à sua escolha.', inline: false })
    .setFooter({ text: `Cabine do Glória FC • criada por ${authorTag}` });
}

async function createReactionPoll(interaction, question, options) {
  const embed = buildPollEmbed(question, options, interaction.user.tag);
  await interaction.reply({ embeds: [embed], fetchReply: true });
  const message = await interaction.fetchReply();
  for (let i = 0; i < options.length; i += 1) {
    await message.react(emojis[i]).catch(() => null);
  }
  const data = getPolls();
  data[message.id] = {
    guildId: interaction.guildId,
    channelId: interaction.channelId,
    messageId: message.id,
    question,
    options,
    emojis: emojis.slice(0, options.length),
    createdBy: interaction.user.id,
    createdAt: new Date().toISOString()
  };
  savePolls(data);
  return message;
}

module.exports = { createReactionPoll, buildPollEmbed, emojis };

```


## src/services/jogosService.js

```javascript
const jogos = require('../data/jogos-copa-2026.json');
const grupos = require('../data/grupos-copa-2026.json');
const { normalizeText } = require('../utils/normalize');
const { todayISO, parseDateInput, matchDateTime, isFutureOrToday } = require('../utils/date');
const { buildMatchLabel } = require('../utils/ids');

function allGames() {
  return [...jogos].sort((a, b) => matchDateTime(a).toMillis() - matchDateTime(b).toMillis() || a.ordem - b.ordem);
}

function getByDate(dateISO) {
  return allGames().filter(game => game.data === dateISO);
}

function getTodayGames() {
  return getByDate(todayISO());
}

function getUpcoming(limit = 10) {
  return allGames().filter(isFutureOrToday).slice(0, limit);
}

function getByTeam(teamName, onlyUpcoming = true) {
  const needle = normalizeText(teamName);
  return allGames().filter(game => {
    const matches = normalizeText(game.time1).includes(needle) || normalizeText(game.time2).includes(needle);
    return matches && (!onlyUpcoming || isFutureOrToday(game));
  });
}

function getAllTeams() {
  const set = new Set();
  for (const game of allGames()) {
    if (!/^a definir$/i.test(game.time1) && !normalizeText(game.time1).includes('venc') && !normalizeText(game.time1).includes('º')) set.add(game.time1);
    if (!/^a definir$/i.test(game.time2) && !normalizeText(game.time2).includes('venc') && !normalizeText(game.time2).includes('º')) set.add(game.time2);
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function getGroup(groupName) {
  const needle = normalizeText(groupName).replace(/^grupo\s+/, '');
  return grupos.find(group => normalizeText(group.nome).endsWith(needle) || normalizeText(group.nome) === `grupo ${needle}`) || null;
}

function getByGroup(groupName) {
  const group = getGroup(groupName);
  if (!group) return { group: null, games: [] };
  return { group, games: allGames().filter(game => normalizeText(game.grupo || '') === normalizeText(group.nome)) };
}

function normalizePhaseInput(input = '') {
  const n = normalizeText(input).replace(/\s+/g, '');
  if (['grupos', 'fasegrupos', 'fasedegrupos'].includes(n)) return 'grupos';
  if (['16avos', 'dezesseisavos', '16avosdefinal', '16'].includes(n)) return '16avos';
  if (['oitavas', 'oitavasdefinal'].includes(n)) return 'oitavas';
  if (['quartas', 'quartasdefinal'].includes(n)) return 'quartas';
  if (['semi', 'semifinal', 'semifinais'].includes(n)) return 'semifinais';
  if (['terceirolugar', '3lugar', '3ºlugar', 'disputade3lugar', 'disputade3ºlugar'].includes(n)) return 'terceiro-lugar';
  if (['final'].includes(n)) return 'final';
  return null;
}

function getByPhase(phaseName) {
  const phaseSlug = normalizePhaseInput(phaseName);
  if (!phaseSlug) return { phaseSlug: null, games: [] };
  return { phaseSlug, games: allGames().filter(game => game.faseSlug === phaseSlug) };
}

function findMatch(query) {
  if (!query) return null;
  const input = String(query).trim();
  const normalized = normalizeText(input);
  const exactId = allGames().find(game => normalizeText(game.id) === normalized);
  if (exactId) return exactId;

  const byLabel = allGames().find(game => normalizeText(buildMatchLabel(game)).includes(normalized));
  if (byLabel) return byLabel;

  const split = normalized.split(/\s+x\s+|\s+vs\s+|\s+versus\s+/).map(v => v.trim()).filter(Boolean);
  if (split.length >= 2) {
    const [a, b] = split;
    return allGames().find(game => {
      const t1 = normalizeText(game.time1);
      const t2 = normalizeText(game.time2);
      return (t1.includes(a) && t2.includes(b)) || (t1.includes(b) && t2.includes(a));
    }) || null;
  }

  return allGames().find(game => normalizeText(game.time1).includes(normalized) || normalizeText(game.time2).includes(normalized)) || null;
}

function autocompleteMatches(value, limit = 25) {
  const needle = normalizeText(value || '');
  return allGames()
    .filter(game => !needle || normalizeText(buildMatchLabel(game)).includes(needle) || normalizeText(game.id).includes(needle))
    .slice(0, limit)
    .map(game => ({ name: buildMatchLabel(game).slice(0, 100), value: game.id }));
}

function autocompleteTeams(value, limit = 25) {
  const needle = normalizeText(value || '');
  return getAllTeams()
    .filter(team => !needle || normalizeText(team).includes(needle))
    .slice(0, limit)
    .map(team => ({ name: team, value: team }));
}

module.exports = {
  allGames,
  getByDate,
  getTodayGames,
  getUpcoming,
  getByTeam,
  getAllTeams,
  getByGroup,
  getGroup,
  getByPhase,
  normalizePhaseInput,
  findMatch,
  parseDateInput,
  autocompleteMatches,
  autocompleteTeams
};

```


## src/services/palpitesService.js

```javascript
const path = require('path');
const { readJson, writeJson } = require('../storage/jsonStore');
const { findMatch } = require('./jogosService');
const { getGuildConfig } = require('./configService');
const { matchDateTime, nowBR } = require('../utils/date');
const { normalizeText } = require('../utils/normalize');

const palpitesPath = path.join(__dirname, '..', 'data', 'palpites.json');
const resultadosPath = path.join(__dirname, '..', 'data', 'resultados.json');
const locksPath = path.join(__dirname, '..', 'data', 'palpite-locks.json');

function getPalpites() { return readJson(palpitesPath, {}); }
function savePalpites(data) { writeJson(palpitesPath, data); }
function getResultados() { return readJson(resultadosPath, {}); }
function saveResultados(data) { writeJson(resultadosPath, data); }
function getLocks() { return readJson(locksPath, {}); }
function saveLocks(data) { writeJson(locksPath, data); }

function parseScore(score) {
  if (!score) return null;
  const match = String(score).trim().match(/^(\d{1,2})\s*[xX-]\s*(\d{1,2})$/);
  if (!match) return null;
  return { gols1: Number(match[1]), gols2: Number(match[2]) };
}

function getOutcomeFromScore(match, gols1, gols2) {
  if (gols1 === gols2) return 'Empate';
  return gols1 > gols2 ? match.time1 : match.time2;
}

function normalizeWinner(match, winner) {
  const n = normalizeText(winner);
  if (['empate', 'x', 'draw'].includes(n)) return 'Empate';
  if (normalizeText(match.time1).includes(n) || n.includes(normalizeText(match.time1))) return match.time1;
  if (normalizeText(match.time2).includes(n) || n.includes(normalizeText(match.time2))) return match.time2;
  return null;
}

function isBetOpen(guildId, match) {
  const locks = getLocks();
  const lock = locks[guildId]?.[match.id];
  if (lock === 'closed') return { open: false, reason: 'Os palpites foram fechados manualmente para este jogo.' };
  if (lock === 'open') return { open: true };
  const config = getGuildConfig(guildId);
  const minutes = Number(config.palpites?.bloqueioMinutos ?? 10);
  const limit = matchDateTime(match).minus({ minutes });
  if (nowBR() >= limit) return { open: false, reason: `O prazo de palpites encerrou ${minutes} minutos antes da partida.` };
  return { open: true };
}

function placeBet({ guildId, userId, matchQuery, winner, score }) {
  const match = findMatch(matchQuery);
  if (!match) return { ok: false, error: 'Jogo não encontrado. Tente usar o autocomplete ou escreva “Brasil x Marrocos”.' };
  const open = isBetOpen(guildId, match);
  if (!open.open) return { ok: false, error: open.reason, match };
  const normalizedWinner = normalizeWinner(match, winner);
  if (!normalizedWinner) return { ok: false, error: `Vencedor inválido. Use “${match.time1}”, “${match.time2}” ou “Empate”.`, match };
  const parsedScore = score ? parseScore(score) : null;
  if (score && !parsedScore) return { ok: false, error: 'Placar inválido. Use o formato 2x0, 1x1 etc.', match };

  const data = getPalpites();
  data[guildId] ||= {};
  data[guildId][match.id] ||= {};
  data[guildId][match.id][userId] = {
    winner: normalizedWinner,
    score: parsedScore,
    createdAt: data[guildId][match.id][userId]?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  savePalpites(data);
  return { ok: true, match, bet: data[guildId][match.id][userId] };
}

function registerResult({ matchQuery, gols1, gols2, userId }) {
  const match = findMatch(matchQuery);
  if (!match) return { ok: false, error: 'Jogo não encontrado.' };
  const result = {
    matchId: match.id,
    gols1: Number(gols1),
    gols2: Number(gols2),
    outcome: getOutcomeFromScore(match, Number(gols1), Number(gols2)),
    registeredBy: userId,
    updatedAt: new Date().toISOString()
  };
  const data = getResultados();
  data[match.id] = result;
  saveResultados(data);
  return { ok: true, match, result };
}

function scoreBet(match, bet, result) {
  let points = 0;
  const details = [];
  if (normalizeText(bet.winner) === normalizeText(result.outcome)) {
    points += 3;
    details.push('+3 vencedor/empate');
  }
  if (bet.score) {
    const exact = bet.score.gols1 === result.gols1 && bet.score.gols2 === result.gols2;
    const betDiff = bet.score.gols1 - bet.score.gols2;
    const resultDiff = result.gols1 - result.gols2;
    if (exact) {
      points += 5;
      details.push('+5 placar exato');
    } else if (betDiff === resultDiff) {
      points += 1;
      details.push('+1 saldo correto');
    }
  }
  return { points, details };
}

function calculateRanking(guildId) {
  const palpites = getPalpites()[guildId] || {};
  const resultados = getResultados();
  const ranking = {};
  for (const [matchId, users] of Object.entries(palpites)) {
    const result = resultados[matchId];
    const match = findMatch(matchId);
    if (!result || !match) continue;
    for (const [userId, bet] of Object.entries(users)) {
      const scored = scoreBet(match, bet, result);
      ranking[userId] ||= { userId, points: 0, bets: 0, exact: 0 };
      ranking[userId].points += scored.points;
      ranking[userId].bets += 1;
      if (bet.score?.gols1 === result.gols1 && bet.score?.gols2 === result.gols2) ranking[userId].exact += 1;
    }
  }
  return Object.values(ranking).sort((a, b) => b.points - a.points || b.exact - a.exact || b.bets - a.bets);
}

function getUserBets(guildId, userId) {
  const palpites = getPalpites()[guildId] || {};
  const list = [];
  for (const [matchId, users] of Object.entries(palpites)) {
    if (users[userId]) {
      const match = findMatch(matchId);
      if (match) list.push({ match, bet: users[userId] });
    }
  }
  return list.sort((a, b) => matchDateTime(a.match).toMillis() - matchDateTime(b.match).toMillis());
}

function setBetLock(guildId, matchQuery, status) {
  const match = findMatch(matchQuery);
  if (!match) return { ok: false, error: 'Jogo não encontrado.' };
  const locks = getLocks();
  locks[guildId] ||= {};
  locks[guildId][match.id] = status;
  saveLocks(locks);
  return { ok: true, match, status };
}

module.exports = {
  placeBet,
  registerResult,
  calculateRanking,
  getUserBets,
  setBetLock,
  parseScore,
  getResultados,
  scoreBet,
  isBetOpen
};

```


## src/services/reminderService.js

```javascript
const path = require('path');
const { readJson, writeJson } = require('../storage/jsonStore');
const { allGames } = require('./jogosService');
const { getTransmission } = require('./transmissaoService');
const { getAllConfigs } = require('./configService');
const { baseEmbed } = require('../utils/embeds');
const { minutesUntil, formatDateBR } = require('../utils/date');
const { colors } = require('../config/theme');

const sentFilePath = path.join(__dirname, '..', 'data', 'lembretes-enviados.json');
const thresholds = [60, 30, 10];

function getSent() {
  return readJson(sentFilePath, {});
}

function markSent(key) {
  const sent = getSent();
  sent[key] = new Date().toISOString();
  writeJson(sentFilePath, sent);
}

function buildReminderEmbed(match, threshold) {
  const transmission = getTransmission(match.id);
  const fase = match.grupo ? `${match.fase} • ${match.grupo}` : match.fase;
  return baseEmbed('⏰ Lembrete da Cabine', `Faltam aproximadamente **${threshold} minutos** para a bola rolar.`, colors.gold)
    .addFields(
      { name: 'Confronto', value: `**${match.time1} x ${match.time2}**`, inline: false },
      { name: 'Data e horário', value: `${formatDateBR(match.data)} às ${match.hora}`, inline: true },
      { name: 'Fase', value: fase, inline: true },
      { name: 'Transmissão', value: transmission.text, inline: false }
    );
}

async function sendReminder(client, guildId, config, match, threshold) {
  const channelId = config.canais?.lembretes;
  if (!channelId) return;
  const channel = await client.channels.fetch(channelId).catch(() => null);
  if (!channel || !channel.isTextBased()) return;
  const roleId = config.cargos?.torcedores;
  const ping = roleId ? `<@&${roleId}> ` : '';
  await channel.send({ content: `${ping}📣 Partida chegando na Cabine!`, embeds: [buildReminderEmbed(match, threshold)] });
}

async function checkReminders(client) {
  const configs = getAllConfigs();
  const sent = getSent();
  const games = allGames();

  for (const [guildId, config] of Object.entries(configs)) {
    if (!config?.modulos?.lembretes || !config?.canais?.lembretes) continue;
    for (const match of games) {
      const diff = minutesUntil(match);
      if (diff <= 0 || diff > 61) continue;
      for (const threshold of thresholds) {
        const key = `${guildId}:${match.id}:${threshold}`;
        const inWindow = diff <= threshold && diff > threshold - 1.5;
        if (inWindow && !sent[key]) {
          try {
            await sendReminder(client, guildId, config, match, threshold);
            markSent(key);
          } catch (error) {
            console.error('[reminderService] Erro ao enviar lembrete:', error);
          }
        }
      }
    }
  }
}

function startReminderScheduler(client) {
  const seconds = Number(process.env.REMINDER_CHECK_SECONDS || 60);
  setInterval(() => checkReminders(client), Math.max(seconds, 15) * 1000);
  setTimeout(() => checkReminders(client), 5000);
  console.log(`[lembretes] Scheduler iniciado. Verificação a cada ${seconds}s.`);
}

module.exports = { startReminderScheduler, checkReminders, thresholds };

```


## src/services/transmissaoService.js

```javascript
const path = require('path');
const { readJson } = require('../storage/jsonStore');
const { normalizeText } = require('../utils/normalize');

const filePath = path.join(__dirname, '..', 'data', 'transmissoes.json');

function allTransmissoes() {
  return readJson(filePath, []);
}

function getTransmissionRecord(matchId) {
  return allTransmissoes().find(item => item.matchId === matchId) || null;
}

function getTransmission(matchId) {
  const record = getTransmissionRecord(matchId);
  if (!record || !Array.isArray(record.transmissao) || record.transmissao.length === 0) {
    return { list: ['A definir'], text: 'Transmissão: a definir', observacoes: '' };
  }
  return {
    list: record.transmissao,
    text: record.transmissao.join(', '),
    observacoes: record.observacoes || ''
  };
}

function findTransmissionByTeams(games, time1, time2) {
  const n1 = normalizeText(time1);
  const n2 = normalizeText(time2);
  const match = games.find(game => {
    const g1 = normalizeText(game.time1);
    const g2 = normalizeText(game.time2);
    return (g1.includes(n1) && g2.includes(n2)) || (g1.includes(n2) && g2.includes(n1));
  });
  if (!match) return null;
  return { match, transmission: getTransmission(match.id) };
}

module.exports = { allTransmissoes, getTransmissionRecord, getTransmission, findTransmissionByTeams };

```


## src/storage/jsonStore.js

```javascript
const fs = require('fs');
const path = require('path');

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function cloneDefault(defaultValue) {
  return JSON.parse(JSON.stringify(defaultValue));
}

function readJson(filePath, defaultValue = {}) {
  ensureDir(filePath);
  if (!fs.existsSync(filePath)) {
    writeJson(filePath, defaultValue);
    return cloneDefault(defaultValue);
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) return cloneDefault(defaultValue);
    return JSON.parse(raw);
  } catch (error) {
    const backupPath = `${filePath}.${Date.now()}.bak`;
    try { fs.copyFileSync(filePath, backupPath); } catch (_) {}
    console.error(`[jsonStore] Falha ao ler ${filePath}. Backup: ${backupPath}`, error);
    writeJson(filePath, defaultValue);
    return cloneDefault(defaultValue);
  }
}

function writeJson(filePath, data) {
  ensureDir(filePath);
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  fs.renameSync(tmpPath, filePath);
}

function updateJson(filePath, defaultValue, updater) {
  const current = readJson(filePath, defaultValue);
  const next = updater(current) || current;
  writeJson(filePath, next);
  return next;
}

module.exports = { readJson, writeJson, updateJson };

```


## src/utils/date.js

```javascript
const { DateTime } = require('luxon');
const { timezone } = require('../config/theme');

function nowBR() {
  return DateTime.now().setZone(timezone);
}

function todayISO() {
  return nowBR().toISODate();
}

function parseDateInput(input) {
  if (!input) return { ok: true, value: todayISO() };
  const raw = String(input).trim();
  let match = raw.match(/^(\d{2})\/(\d{2})(?:\/(\d{4}))?$/);
  if (match) {
    const [, dd, mm, yyyy = '2026'] = match;
    const dt = DateTime.fromObject({ year: Number(yyyy), month: Number(mm), day: Number(dd) }, { zone: timezone });
    if (!dt.isValid) return { ok: false, error: 'Data inválida. Use o formato DD/MM, por exemplo: 13/06.' };
    return { ok: true, value: dt.toISODate() };
  }
  match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const dt = DateTime.fromISO(raw, { zone: timezone });
    if (!dt.isValid) return { ok: false, error: 'Data inválida. Use DD/MM ou AAAA-MM-DD.' };
    return { ok: true, value: dt.toISODate() };
  }
  return { ok: false, error: 'Formato de data inválido. Use DD/MM, por exemplo: 13/06.' };
}

function formatDateBR(isoDate) {
  const dt = DateTime.fromISO(isoDate, { zone: timezone });
  return dt.isValid ? dt.toFormat('dd/LL/yyyy') : isoDate;
}

function formatDateShort(isoDate) {
  const dt = DateTime.fromISO(isoDate, { zone: timezone });
  return dt.isValid ? dt.toFormat('dd/LL') : isoDate;
}

function matchDateTime(match) {
  return DateTime.fromISO(`${match.data}T${match.hora}:00`, { zone: timezone });
}

function isFutureOrToday(match) {
  return matchDateTime(match) >= nowBR().startOf('day');
}

function minutesUntil(match) {
  return matchDateTime(match).diff(nowBR(), 'minutes').minutes;
}

module.exports = { nowBR, todayISO, parseDateInput, formatDateBR, formatDateShort, matchDateTime, isFutureOrToday, minutesUntil };

```


## src/utils/embeds.js

```javascript
const { EmbedBuilder } = require('discord.js');
const { colors, footer } = require('../config/theme');
const { formatDateBR } = require('./date');

function baseEmbed(title, description = '', color = colors.gold) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description || null)
    .setFooter({ text: footer })
    .setTimestamp(new Date());
}

function errorEmbed(title, description) {
  return baseEmbed(`⚠️ ${title}`, description, colors.error);
}

function successEmbed(title, description) {
  return baseEmbed(`✅ ${title}`, description, colors.success);
}

function warningEmbed(title, description) {
  return baseEmbed(`📣 ${title}`, description, colors.warning);
}

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

function formatGameField(match, transmissaoText = 'Transmissão: a definir') {
  const fase = match.grupo ? `${match.fase} • ${match.grupo}` : match.fase;
  const codigo = match.jogo ? ` • ${match.jogo}` : '';
  return {
    name: `🕒 ${match.hora} — ${match.time1} x ${match.time2}`,
    value: `📅 ${formatDateBR(match.data)}\n🏆 ${fase}${codigo}\n📺 ${transmissaoText}`
  };
}

function gamesEmbeds(title, description, games, transmissaoResolver) {
  if (!games.length) return [warningEmbed(title, description || 'Nenhuma partida encontrada.')];
  const chunks = chunkArray(games, 10);
  return chunks.map((chunk, index) => {
    const embed = baseEmbed(index === 0 ? title : `${title} (${index + 1}/${chunks.length})`, description);
    embed.addFields(chunk.map(match => formatGameField(match, transmissaoResolver(match))));
    return embed;
  });
}

module.exports = { baseEmbed, errorEmbed, successEmbed, warningEmbed, gamesEmbeds, formatGameField };

```


## src/utils/ids.js

```javascript
const { compactKey } = require('./normalize');

function buildMatchLabel(match) {
  const fase = match.grupo || match.fase;
  const codigo = match.jogo ? `${match.jogo} • ` : '';
  return `${match.data} ${match.hora} • ${codigo}${match.time1} x ${match.time2} • ${fase}`;
}

function readableMatch(match) {
  return `${match.time1} x ${match.time2}`;
}

function simpleMatchKey(time1, time2) {
  return `${compactKey(time1)}-x-${compactKey(time2)}`;
}

module.exports = { buildMatchLabel, readableMatch, simpleMatchKey };

```


## src/utils/normalize.js

```javascript
function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9º\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesNormalized(source, query) {
  return normalizeText(source).includes(normalizeText(query));
}

function equalNormalized(a, b) {
  return normalizeText(a) === normalizeText(b);
}

function compactKey(value = '') {
  return normalizeText(value).replace(/\s+/g, '-');
}

module.exports = { normalizeText, includesNormalized, equalNormalized, compactKey };

```

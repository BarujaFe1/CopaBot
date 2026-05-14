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

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

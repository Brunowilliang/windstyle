# Benchmarks para `use-styled`

Este pacote contém testes de desempenho para a biblioteca `use-styled`, comparando-a com outras bibliotecas populares de estilização como Styled Components e Emotion.

## Benchmarks Disponíveis

Os seguintes benchmarks estão implementados:

1. **Renderização Básica** (`render-benchmark.js`): Compara o desempenho de renderização de componentes básicos estilizados.

2. **Variantes** (`variants-benchmark.js`): Testa o desempenho das implementações de variantes em cada biblioteca.

3. **Slots e Composição** (`slots-benchmark.js`): Compara a abordagem de composição do `use-styled` (slots) com abordagens manuais de composição em outras bibliotecas.

## Pré-requisitos

Antes de executar os benchmarks, certifique-se de que todas as dependências estão instaladas:

```bash
yarn install
```

## Como Executar

### Executar Todos os Benchmarks

```bash
# Executar todos os benchmarks e visualizar os resultados
yarn start
```

Este comando executará todos os benchmarks, salvará os resultados em arquivos de texto na pasta `results/` e exibirá tabelas comparativas no terminal.

### Executar Benchmarks Específicos

Você também pode executar benchmarks específicos:

```bash
# Benchmark de renderização básica
yarn render

# Benchmark de variantes
yarn variants

# Benchmark de slots e composição
yarn slots

# Apenas visualizar resultados existentes
yarn visualize
```

## Resultados

Os resultados dos benchmarks serão:

1. Exibidos no terminal em tabelas coloridas
2. Salvos como arquivos de texto em `results/`
3. Resumidos em um arquivo `results/summary.txt`

## Metodologia

Cada benchmark:

1. Cria componentes equivalentes usando cada biblioteca
2. Mede o tempo de renderização do componente para string (usando ReactDOMServer.renderToString)
3. Executa múltiplas vezes para garantir resultados estatisticamente significativos
4. Salva os resultados (operações por segundo)

## Interpretação dos Resultados

Valores mais altos (mais operações por segundo) indicam melhor desempenho. A biblioteca que puder renderizar mais componentes por segundo é considerada mais rápida para o caso de uso específico do benchmark.

O resultado é exibido com cores para facilitar a leitura:
- 🟢 Verde: A biblioteca mais rápida (100%)
- 🟡 Amarelo: Bibliotecas com desempenho próximo ao mais rápido (> 80%)
- ⚪ Branco: Bibliotecas com desempenho abaixo de 80% do mais rápido 
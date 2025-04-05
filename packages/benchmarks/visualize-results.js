const fs = require('node:fs')
const path = require('node:path')
const { table } = require('table')
const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	bold: '\x1b[1m',
}

// Função para analisar os resultados do benchmark
function parseResults(filePath) {
	const content = fs.readFileSync(filePath, 'utf8')
	const lines = content.split('\n')

	const results = []
	for (const line of lines) {
		const match = line.match(/^([^x]+) x ([0-9,.]+) ops\/sec/)
		if (match) {
			results.push({
				name: match[1].trim(),
				opsPerSec: Number.parseFloat(match[2].replace(/,/g, '')),
			})
		}
	}

	// Ordenar os resultados por desempenho (do mais rápido para o mais lento)
	return results.sort((a, b) => b.opsPerSec - a.opsPerSec)
}

// Processar e exibir resultados em uma tabela
function visualizeResults() {
	console.log(
		`\n${colors.bold}Resultados dos Benchmarks de use-styled${colors.reset}\n`,
	)

	const resultFiles = [
		{
			file: path.join(__dirname, 'results', 'render-benchmark-results.txt'),
			title: 'Renderização de Componentes Básicos',
		},
		{
			file: path.join(__dirname, 'results', 'variants-benchmark-results.txt'),
			title: 'Renderização com Variantes',
		},
		{
			file: path.join(__dirname, 'results', 'slots-benchmark-results.txt'),
			title: 'Componentes com Slots',
		},
	]

	// Criar um resumo dos resultados
	const summary = []

	for (const { file, title } of resultFiles) {
		if (fs.existsSync(file)) {
			const results = parseResults(file)

			// Exibir o título do benchmark
			console.log(`${colors.cyan}${colors.bold}${title}${colors.reset}`)

			// Preparar dados da tabela
			const tableData = [['Biblioteca', 'Operações/seg', 'Comparação']]

			// Valor de referência (o mais rápido)
			const fastestOps = results[0].opsPerSec

			results.forEach((result, index) => {
				const ratio = result.opsPerSec / fastestOps
				const percentage = (ratio * 100).toFixed(2)
				const color =
					index === 0
						? colors.green
						: ratio > 0.8
							? colors.yellow
							: colors.reset

				tableData.push([
					`${color}${result.name}${colors.reset}`,
					`${color}${result.opsPerSec.toFixed(2)}${colors.reset}`,
					`${color}${index === 0 ? '100% (mais rápido)' : `${percentage}%`}${
						colors.reset
					}`,
				])
			})

			// Exibir a tabela
			console.log(table(tableData))
			console.log('\n')

			// Adicionar ao resumo
			summary.push({
				test: title,
				winner: results[0].name,
				winnerOps: results[0].opsPerSec,
				secondPlace: results[1]?.name || 'N/A',
				ratio: results[1]
					? `${(results[0].opsPerSec / results[1].opsPerSec).toFixed(2)}x`
					: 'N/A',
			})
		} else {
			console.log(
				`${colors.yellow}Arquivo de resultados não encontrado: ${file}${colors.reset}\n`,
			)
		}
	}

	// Exibir resumo geral
	if (summary.length > 0) {
		console.log(
			`${colors.magenta}${colors.bold}RESUMO DOS BENCHMARKS${colors.reset}`,
		)

		const summaryTable = [
			['Benchmark', 'Vencedor', 'Ops/seg', 'Segundo Lugar', 'Diferença'],
		]

		for (const item of summary) {
			summaryTable.push([
				item.test,
				item.winner,
				item.winnerOps.toFixed(2),
				item.secondPlace,
				item.ratio,
			])
		}

		console.log(table(summaryTable))

		// Salvar o resumo em um arquivo
		const summaryFile = path.join(__dirname, 'results', 'summary.txt')
		const summaryContent = table(summaryTable)
		fs.writeFileSync(summaryFile, summaryContent)
		console.log(`${colors.blue}Resumo salvo em: ${summaryFile}${colors.reset}`)
	}
}

// Executar a visualização
visualizeResults()

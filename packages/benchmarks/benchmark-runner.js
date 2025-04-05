const { spawn } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

// Verifica se o diretório de resultados existe, senão cria
const resultsDir = path.join(__dirname, 'results')
if (!fs.existsSync(resultsDir)) {
	fs.mkdirSync(resultsDir, { recursive: true })
}

// Lista de benchmarks para executar
const benchmarks = [
	'render-benchmark.js',
	'variants-benchmark.js',
	'slots-benchmark.js',
	// Adicione aqui outros benchmarks quando criar
]

// Função para executar um benchmark e salvar o resultado
function runBenchmark(benchmarkFile) {
	return new Promise((resolve, reject) => {
		console.log(`Executando ${benchmarkFile}...`)

		const resultFile = path.join(
			resultsDir,
			`${path.basename(benchmarkFile, '.js')}-results.txt`,
		)

		const benchmarkProcess = spawn(
			'node',
			[path.join(__dirname, benchmarkFile)],
			{
				stdio: ['ignore', 'pipe', 'pipe'],
			},
		)

		let output = ''

		benchmarkProcess.stdout.on('data', data => {
			const dataStr = data.toString()
			output += dataStr
			process.stdout.write(dataStr) // Mostra o progresso no console
		})

		benchmarkProcess.stderr.on('data', data => {
			process.stderr.write(data.toString())
		})

		benchmarkProcess.on('close', code => {
			if (code === 0) {
				// Salva o resultado em um arquivo
				fs.writeFileSync(resultFile, output)
				console.log(`Resultado salvo em ${resultFile}`)
				resolve()
			} else {
				reject(
					new Error(`Benchmark ${benchmarkFile} falhou com código ${code}`),
				)
			}
		})
	})
}

// Executa todos os benchmarks em sequência
async function runAllBenchmarks() {
	console.log('Iniciando benchmarks...')

	for (const benchmark of benchmarks) {
		try {
			await runBenchmark(benchmark)
		} catch (error) {
			console.error(`Erro ao executar ${benchmark}:`, error)
		}
	}

	console.log('Todos os benchmarks foram concluídos!')
	console.log('Gerando gráficos...')

	// Executa o script de visualização para gerar os gráficos
	const visualizeProcess = spawn(
		'node',
		[path.join(__dirname, 'visualize-results.js')],
		{
			stdio: 'inherit',
		},
	)

	visualizeProcess.on('close', code => {
		if (code === 0) {
			console.log('Gráficos gerados com sucesso!')
		} else {
			console.error(`Falha ao gerar gráficos. Código de saída: ${code}`)
		}
	})
}

runAllBenchmarks().catch(console.error)

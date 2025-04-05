const Benchmark = require('benchmark')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const styled = require('styled-components').default
const emotion = require('@emotion/styled').default
const { useStyled } = require('use-styled')

// Componentes básicos para cada biblioteca
// Styled Components
const StyledButton = styled.button`
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
`

// Emotion
const EmotionButton = emotion.button`
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
`

// use-styled
const UseStyledButton = useStyled('button', {
	base: 'bg-blue-500 text-white px-4 py-2 rounded text-base',
})

// Configurar suite de benchmark
const suite = new Benchmark.Suite()

// Adicionar testes
suite
	.add('Styled Components - básico', function () {
		ReactDOMServer.renderToString(
			React.createElement(StyledButton, {}, 'Click me'),
		)
	})
	.add('Emotion - básico', function () {
		ReactDOMServer.renderToString(
			React.createElement(EmotionButton, {}, 'Click me'),
		)
	})
	.add('use-styled - básico', function () {
		ReactDOMServer.renderToString(
			React.createElement(UseStyledButton, {}, 'Click me'),
		)
	})
	// Adicione ouvintes de eventos
	.on('cycle', function (event) {
		console.log(String(event.target))
	})
	.on('complete', function () {
		console.log(`Mais rápido é ${this.filter('fastest').map('name')}`)
	})
	// Execute
	.run({ async: true })

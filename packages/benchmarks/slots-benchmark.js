const Benchmark = require('benchmark')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const styled = require('styled-components').default
const emotion = require('@emotion/styled').default
const { useStyled } = require('use-styled')
const { useStyledContext, useStyledSlots } = require('../use-styled/dist')

// Componentes complexos para cada biblioteca
// Styled Components
const SCButtonRoot = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: blue;
  color: white;
  border-radius: 4px;
`

const SCButtonText = styled.span`
  font-weight: bold;
`

const SCButtonIcon = styled.span`
  margin-right: 8px;
`

function SCButton({ children, icon, ...props }) {
	return React.createElement(
		SCButtonRoot,
		props,
		icon && React.createElement(SCButtonIcon, null, icon),
		React.createElement(SCButtonText, null, children),
	)
}

// Emotion
const EButtonRoot = emotion.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: blue;
  color: white;
  border-radius: 4px;
`

const EButtonText = emotion.span`
  font-weight: bold;
`

const EButtonIcon = emotion.span`
  margin-right: 8px;
`

function EButton({ children, icon, ...props }) {
	return React.createElement(
		EButtonRoot,
		props,
		icon && React.createElement(EButtonIcon, null, icon),
		React.createElement(EButtonText, null, children),
	)
}

// use-styled
const ButtonContext = useStyledContext({
	variant: Object.freeze(['primary', 'secondary']),
})

const USButtonFrame = useStyled('button', {
	context: ButtonContext,
	base: 'flex items-center justify-center px-4 py-2 rounded bg-blue-500 text-white',
})

const USButtonText = useStyled('span', {
	context: ButtonContext,
	base: 'font-bold',
})

const USButtonIcon = useStyled('span', {
	base: 'mr-2',
})

const USButton = useStyledSlots(USButtonFrame, {
	context: ButtonContext,
	slots: {
		Text: USButtonText,
		Icon: USButtonIcon,
	},
})

// Configurar suite de benchmark
const suite = new Benchmark.Suite()

// Adicionar testes
suite
	.add('Styled Components - composição', function () {
		ReactDOMServer.renderToString(
			React.createElement(SCButton, { icon: '🔔' }, 'Click me'),
		)
	})
	.add('Emotion - composição', function () {
		ReactDOMServer.renderToString(
			React.createElement(EButton, { icon: '🔔' }, 'Click me'),
		)
	})
	.add('use-styled - slots', function () {
		ReactDOMServer.renderToString(
			React.createElement(USButton, {}, [
				React.createElement(USButton.Icon, { key: 'icon' }, '🔔'),
				React.createElement(USButton.Text, { key: 'text' }, 'Click me'),
			]),
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

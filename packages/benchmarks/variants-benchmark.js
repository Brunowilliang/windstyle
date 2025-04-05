const Benchmark = require('benchmark')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const styled = require('styled-components').default
const { css } = require('styled-components')
const emotion = require('@emotion/styled').default
const { css: emotionCss } = require('@emotion/react')
const { useStyled } = require('use-styled')
const { useStyledContext } = require('../use-styled/dist')

// Styled Components com variantes
const StyledComponentsButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  
  ${props =>
		props.variant === 'primary' &&
		css`
    background-color: blue;
    color: white;
  `}
  
  ${props =>
		props.variant === 'secondary' &&
		css`
    background-color: gray;
    color: black;
  `}
  
  ${props =>
		props.size === 'sm' &&
		css`
    padding: 4px 8px;
    font-size: 14px;
  `}
  
  ${props =>
		props.size === 'lg' &&
		css`
    padding: 12px 24px;
    font-size: 18px;
  `}
`

// Emotion com variantes
const EmotionButton = emotion.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  
  ${props =>
		props.variant === 'primary' &&
		emotionCss`
    background-color: blue;
    color: white;
  `}
  
  ${props =>
		props.variant === 'secondary' &&
		emotionCss`
    background-color: gray;
    color: black;
  `}
  
  ${props =>
		props.size === 'sm' &&
		emotionCss`
    padding: 4px 8px;
    font-size: 14px;
  `}
  
  ${props =>
		props.size === 'lg' &&
		emotionCss`
    padding: 12px 24px;
    font-size: 18px;
  `}
`

// Use-Styled com variantes
const ButtonContext = useStyledContext({
	variant: Object.freeze(['primary', 'secondary']),
	size: Object.freeze(['sm', 'md', 'lg']),
})

const UseStyledButton = useStyled('button', {
	context: ButtonContext,
	base: 'rounded',
	variants: {
		variant: {
			primary: 'bg-blue-500 text-white',
			secondary: 'bg-gray-500 text-black',
		},
		size: {
			sm: 'px-2 py-1 text-sm',
			md: 'px-4 py-2 text-base',
			lg: 'px-6 py-3 text-lg',
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'md',
	},
})

// Configurar suite de benchmark
const suite = new Benchmark.Suite()

// Adicionar testes
suite
	.add('Styled Components - variantes', function () {
		ReactDOMServer.renderToString(
			React.createElement(
				StyledComponentsButton,
				{ variant: 'primary', size: 'lg' },
				'Click me',
			),
		)
	})
	.add('Emotion - variantes', function () {
		ReactDOMServer.renderToString(
			React.createElement(
				EmotionButton,
				{ variant: 'primary', size: 'lg' },
				'Click me',
			),
		)
	})
	.add('use-styled - variantes', function () {
		ReactDOMServer.renderToString(
			React.createElement(
				UseStyledButton,
				{ variant: 'primary', size: 'lg' },
				'Click me',
			),
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

import { useStyled, useStyledSlots } from 'use-styled'

// Exemplo sem useStyledProps para comparação
export const NoPropsButtonFrame = useStyled('button', {
	name: 'NoPropsButtonFrame',
	// Sem props: ButtonProps
	base: 'rounded-md focus:outline-none focus:ring-2 transition-all',
	variants: {
		variant: {
			primary: 'bg-blue-500 hover:bg-blue-600',
			secondary: 'bg-gray-200 hover:bg-gray-300',
			danger: 'bg-red-500 hover:bg-red-600',
		},
		size: {
			sm: 'h-10 px-4',
			md: 'h-12 px-6',
			lg: 'h-14 px-8',
		},
	},
	// transient: ['variant', 'size'],
})

export const NoPropsButtonText = useStyled('p', {
	name: 'NoPropsButtonText',
	// Sem props: ButtonProps
	base: 'font-medium text-amber-500',
	variants: {
		variant: {
			primary: 'text-white',
			secondary: 'text-gray-800',
			danger: 'text-white',
		},
		size: {
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
		},
	},
	compoundVariants: [],
})

export const NoPropsButton = useStyledSlots(NoPropsButtonFrame, {
	slots: {
		Text: NoPropsButtonText,
	},
})

export const ExempleNoProps = () => {
	return (
		<>
			{/* variant e size afetam o estilo deste texto */}
			<NoPropsButton variant='primary' size='sm'>
				<NoPropsButton.Text>No props</NoPropsButton.Text>
			</NoPropsButton>

			{/* defaultVariants */}
			<NoPropsButton>
				<NoPropsButton.Text>No props</NoPropsButton.Text>
			</NoPropsButton>
		</>
	)
}

import { Pressable, Text, View } from 'react-native'
import { useStyled, useStyledSlots, useStyledContext } from 'use-styled'

// mudar o nome "useStyledProps" para "useStyledContext"
const ButtonProps = useStyledContext({
	variant: ['blue', 'amber', 'red'] as const,
	size: ['sm', 'md', 'lg', 'large'] as const,
})

export const Box = useStyled(View, {})

export const ButtonFrame = useStyled(Pressable, {
	base: 'px-4 py-2 rounded-md transition-all active:scale-95 duration-200',
	context: ButtonProps,
	variants: {
		variant: {
			blue: 'bg-blue-600 hover:bg-blue-300',
			amber: 'bg-amber-600 hover:bg-amber-300',
			red: 'bg-red-600 hover:bg-red-300',
		},
		size: {
			sm: 'px-6 py-3',
			md: 'px-8 py-4',
			lg: 'px-10 py-5',
			large: 'px-12 py-6',
		},
	},
	defaultProps: {
		onPress: () => console.log('clicked'),
	},
	// defaultVariants: {
	// 	variant: 'blue',
	// 	size: 'md',
	// },
})

const ButtonTitle = useStyled(Text, {
	base: 'text-white',
	context: ButtonProps,
	variants: {
		variant: {
			blue: 'text-blue-400',
			amber: 'text-amber-400',
			red: 'text-red-400',
		},
		size: {
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
			large: 'text-3xl',
		},
	},
	defaultProps: {
		numberOfLines: 1,
	},
	defaultVariants: {
		variant: 'red',
		size: 'sm',
	},
})

const Button = useStyledSlots(ButtonFrame, {
	context: ButtonProps,
	slots: {
		Title: ButtonTitle,
	},
})

export const Example = () => {
	return (
		<Box>
			<Button variant='blue' size='large'>
				<Button.Title>Button</Button.Title>
			</Button>
		</Box>
	)
}

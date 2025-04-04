import { useStyled, useStyledProps, useStyledSlots } from 'use-styled'

const ButtonProps = useStyledProps({
	variant: ['blue', 'amber', 'red'] as const,
	size: ['sm', 'md', 'lg'] as const,
})

export const ButtonFrame = useStyled('button', {
	base: 'px-4 py-2 rounded-md transition-all cursor-pointer hover:scale-105 active:scale-95 duration-200',
	props: ButtonProps,
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
		},
	},
})

const ButtonTitle = useStyled('p', {
	base: 'text-white',
	props: ButtonProps,
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
		},
	},
})

const Button = useStyledSlots(ButtonFrame, {
	props: ButtonProps,
	slots: {
		Title: ButtonTitle,
	},
})

export function Exemple() {
	return (
		<>
			<div className='space-y-2'>
				<h2 className='text-2xl font-bold'>Examples with props</h2>
				<div className='flex gap-4'>
					<Button variant='blue' size='sm'>
						<Button.Title>Title asdf</Button.Title>
					</Button>

					<Button variant='blue' size='sm'>
						<Button.Title>Title</Button.Title>
					</Button>

					<Button variant='amber' size='sm'>
						<Button.Title>Title</Button.Title>
					</Button>
				</div>
			</div>
		</>
	)
}

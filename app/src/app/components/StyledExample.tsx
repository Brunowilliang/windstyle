'use client'

import { styled } from 'windstyle'

export const Button = styled('button', {
	base: 'px-4 py-2 rounded-md transition-all cursor-pointer hover:scale-105 active:scale-95 duration-200',
	variants: {
		intent: {
			primary: 'bg-blue-500 text-white hover:bg-blue-600',
			secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
			danger: 'bg-red-500 text-white hover:bg-red-600',
		},
		size: {
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg px-6 py-3',
		},
		outlined: {
			true: 'bg-transparent border border-current',
			false: '',
		},
	},
	defaultVariants: {
		intent: 'primary',
		size: 'md',
	},
	compoundVariants: [
		{
			intent: 'primary',
			outlined: true,
			class: 'text-blue-500 border-blue-500 hover:bg-blue-50',
		},
	],
	defaultProps: {
		onClick: () => alert('clicked'),
	},
})

export function StyledExample() {
	return (
		<div className='space-y-6'>
			<h2 className='text-2xl font-bold'>Windstyle Examples</h2>

			<div className='flex gap-4'>
				<Button>Default Button</Button>
				<Button intent='secondary'>Secondary</Button>
				<Button intent='danger'>Danger</Button>
			</div>

			<div className='flex gap-4'>
				<Button outlined>Outlined</Button>
				<Button intent='secondary' outlined>
					Secondary Outlined
				</Button>
			</div>
		</div>
	)
}

// Example of using the use-styled library
import { useStyled, useStyledContext, useStyledSlots } from '../index'

// 1. Define the variant context for the component
// Using the new syntax with arrays for union types and constructors for primitive types
export const ButtonContext = useStyledContext({
	// Array of strings = direct union type (with as const)
	variant: ['primary', 'secondary', 'danger'] as const,
	// Array of strings = direct union type (with as const)
	size: ['sm', 'md', 'lg'] as const,
	// Boolean constructor = boolean
	disabled: Boolean,
	// Number constructor = number
	count: Number,
	// Literal value = literal type
	shape: 'rounded' as const,
})

export const ButtonFrame = useStyled('button', {
	name: 'ButtonFrame',
	context: ButtonContext, // The type system now recognizes the types defined above
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
		disabled: {
			true: 'opacity-50 cursor-not-allowed',
			false: 'opacity-100',
		},
		count: {
			0: 'hidden',
			1: 'opacity-50',
			2: 'opacity-75',
			3: 'opacity-100',
		},
		shape: {
			rounded: 'rounded-full',
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'md',
		disabled: true,
		count: 0,
		shape: 'rounded',
	},
	compoundVariants: [
		{
			variant: 'primary',
			size: 'md',
			disabled: false,
			class: 'bg-blue-500 hover:bg-blue-600',
		},
	],
	defaultProps: {},
	// Props that are used only for styling and will not be passed to the DOM
	styleOnly: ['variant', 'size', 'count', 'shape'],
})

// 3. Create child components that will use the same context
export const ButtonText = useStyled('p', {
	name: 'ButtonText',
	context: ButtonContext, // Same context object
	base: 'font-medium',
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
		disabled: {
			true: 'text-opacity-70',
			false: 'text-opacity-100',
		},
	},
})

// Example of a component with different context
export const OtherButtonContext = useStyledContext({
	// Using arrays for union types with as const
	variant: ['blue', 'red', 'green'] as const,
	size: ['small', 'medium', 'large'] as const,
	// Using Boolean constructor
	rounded: Boolean,
})

export const ButtonIcon = useStyled('span', {
	name: 'ButtonIcon',
	context: OtherButtonContext, // Using a DIFFERENT context object
	base: 'inline-flex items-center justify-center mr-2',
	variants: {
		// Using the same approach with different context
		variant: {
			// Options are: 'blue' | 'red' | 'green'
			blue: 'text-blue-200',
			red: 'text-red-200',
			green: 'text-green-200',
		},
		size: {
			// Options are: 'small' | 'medium' | 'large'
			small: 'text-xs',
			medium: 'text-sm',
			large: 'text-base',
		},
		rounded: {
			// Options are: true | false
			true: 'rounded-full',
			false: 'rounded-none',
		},
	},
})

// Component without defined context
export const ButtonBadge = useStyled('span', {
	name: 'ButtonBadge',
	// NO context
	base: 'absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center',
})

// 4. Use useStyledSlots to create the final component with its slots
export const Button = useStyledSlots(ButtonFrame, {
	slots: {
		Text: ButtonText,
		Icon: ButtonIcon,
		Badge: ButtonBadge,
	},
	context: ButtonContext,
})

// 5. Final usage - Props are propagated only to components with the same context
const ExampleComponent = () => {
	return (
		<div className='space-y-6'>
			<Button variant='primary' size='lg' disabled count={2} shape='rounded'>
				{/* Grouping children to avoid TypeScript error */}
				<>
					{/* ✅ ButtonText will receive variant, size, disabled automatically */}
					<Button.Text>This text receives props from parent</Button.Text>

					{/* ❌ ButtonIcon will NOT receive props from Button */}
					<Button.Icon variant='blue' size='medium' rounded={true}>
						🔔
					</Button.Icon>

					{/* ❌ ButtonBadge will NOT receive props */}
					<Button.Badge>3</Button.Badge>
				</>
			</Button>
		</div>
	)
}

// Example without useStyledContext for comparison
export const NoContextButtonFrame = useStyled('button', {
	name: 'NoContextButtonFrame',
	// No context
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
})

export const NoContextButtonText = useStyled('p', {
	name: 'NoContextButtonText',
	// No context
	base: 'font-medium',
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
})

export const NoContextButton = useStyledSlots(NoContextButtonFrame, {
	slots: {
		Text: NoContextButtonText,
	},
	// No context
})

// Usage without useStyledContext - Props are propagated but not recognized
const ExampleWithoutContext = () => {
	return (
		<NoContextButton variant='primary' size='sm'>
			{/* Props are propagated by useStyledSlots, but NoContextButtonText 
			    cannot apply styles based on them because it doesn't use context */}
			<NoContextButton.Text>
				Click me (variant and size do not affect this text's style)
			</NoContextButton.Text>
		</NoContextButton>
	)
}

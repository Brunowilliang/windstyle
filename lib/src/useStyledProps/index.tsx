import { ReactNode } from 'react'

// Type to transform an object of definitions into a typed object
export type TransformProps<T> = {
	[K in keyof T]: T[K] extends readonly (infer U)[]
		? U
		: T[K] extends (infer V)[]
			? V
			: T[K] extends BooleanConstructor
				? boolean
				: T[K] extends NumberConstructor
					? number
					: T[K] extends StringConstructor
						? string
						: T[K]
}

// Helper type to extract original literal values
export type ExtractPropDefinition<T, K extends keyof T> = T[K] extends any[]
	? Readonly<T[K]>
	: T[K] extends BooleanConstructor
		? boolean
		: T[K] extends NumberConstructor
			? number
			: T[K] extends StringConstructor
				? string
				: T[K]

// Defines the type for props created by useStyledProps
export type Props<T> = TransformProps<T> & { __definition: T }

/**
 * useStyledProps: Creates variant props for a component
 *
 * Accepts union types directly in the object:
 * ```tsx
 * const ButtonProps = useStyledProps({
 *   // IMPORTANT: Always use 'as const' to preserve literal types!
 *   variant: ['primary', 'secondary', 'danger'] as const,  // String union
 *   size: ['sm', 'md', 'lg'] as const,                     // String union
 *   disabled: Boolean,                                     // Boolean
 *   count: Number,                                        // Number
 *   shape: 'rounded' as const,                            // String literal
 * })
 * ```
 *
 * The 'as const' is essential for TypeScript to preserve the literal values
 * and show them correctly in editor suggestions when you're defining
 * variants in useStyled.
 */
export const useStyledProps = <T extends Record<string, any>>(
	definitions: T,
): Props<T> => {
	// Converts type definitions into an object with default values
	const defaultValues = {} as Record<string, any>

	for (const key in definitions) {
		const def = definitions[key]

		// Process different types of definitions
		if (Array.isArray(def) && def.length > 0) {
			// For arrays (union of values), use the first one as default
			defaultValues[key] = def[0]
			// Freeze the array to ensure it's treated as readonly
			Object.freeze(def)
		} else if (def === Boolean) {
			defaultValues[key] = false
		} else if (def === Number) {
			defaultValues[key] = 0
		} else if (def === String) {
			defaultValues[key] = ''
		} else {
			// For other values (including primitives), use the value itself
			defaultValues[key] = def
		}
	}

	// Store the original definition as a non-enumerable property
	Object.defineProperty(defaultValues, '__definition', {
		value: definitions,
		enumerable: false,
		writable: false,
	})

	return defaultValues as unknown as Props<T>
}

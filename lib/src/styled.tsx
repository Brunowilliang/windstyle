import { createElement, forwardRef } from 'react'
import type { JSX, ElementType, ReactElement } from 'react'
import type * as Types from './types'
import { evaluateClassName, cn } from './utils'

type HTMLTagName = keyof JSX.IntrinsicElements
const domElements: HTMLTagName[] = []

export const styled: Types.Styled = function (
	component,
	{
		base: defaultClassName,
		variants,
		transient,
		defaultProps,
		compoundVariants,
		defaultVariants,
	},
) {
	const overrideVariantProps = variants
		? Object.fromEntries(Object.keys(variants).map(key => [key, undefined]))
		: {}
	const overrideTransientProps =
		transient && variants
			? Object.fromEntries(
					Object.keys(variants)
						.filter(key => transient.includes(key))
						.map(key => [key, undefined]),
				)
			: {}
	const Component = <As extends ElementType>(
		{
			as: asProp,
			className,
			...props
		}: Types.StyledProps<As, any, any> & { className?: string },
		ref: any,
	): ReactElement<any, any> => {
		const Tag = (asProp || component) as ElementType
		const isTag = typeof component === 'string'

		// Calculate variant classes without including the user's className
		const variantClasses =
			evaluateClassName(
				props,
				variants || {},
				defaultVariants,
				compoundVariants,
				defaultClassName,
			) || ''

		// Use cn to combine the classes correctly, ensuring that the user's className has priority
		const finalClassName = cn(variantClasses, className)

		// Usando createElement em vez de JSX
		return createElement(Tag, {
			...defaultProps,
			...props,
			...(isTag ? overrideVariantProps : overrideTransientProps),
			ref: isTag ? ref : undefined,
			className: finalClassName || undefined,
		})
	}

	if (typeof component === 'string') {
		return forwardRef(Component) as any
	}

	return Component
} as Types.Styled

for (const domElement of domElements) {
	styled[domElement as keyof typeof styled] = ((
		className: string,
		config?: Omit<Types.ComponentConfig<any, any, any>, 'base'>,
	) => styled(domElement as ElementType, { ...config, base: className })) as any
}

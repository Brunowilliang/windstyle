import { createElement, forwardRef, ElementType, ReactElement } from 'react'

import { evaluateClassName } from '../utils/evaluateClassName'
import { cn } from '../utils/cn'
import { PROPS_REF_KEY } from '../utils/constants'

import type {
	HTMLTagName,
	IStyled,
	StyledProps,
	ComponentConfig,
	VariantsRecord,
	GetDefaultVariants,
	StyledTagFunction,
	Component as StyledComponentType,
} from '../types'

const domElements: HTMLTagName[] = [
	'a',
	'button',
	'div',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'img',
	'input',
	'label',
	'li',
	'nav',
	'ol',
	'p',
	'span',
	'svg',
	'textarea',
	'ul',
]

export const useStyled: IStyled = function <
	ContextTypeParam extends Record<string, any> | undefined,
	DefaultAsParam extends ElementType,
	VariantsParam extends VariantsRecord = {},
	DefaultVariantsParam extends GetDefaultVariants<VariantsParam> = {},
>(
	component: DefaultAsParam,
	config: ComponentConfig<
		ContextTypeParam,
		VariantsParam,
		DefaultVariantsParam,
		DefaultAsParam
	>,
) {
	const {
		name,
		props: configProps,
		base: defaultClassName,
		variants: configVariants,
		styleOnly,
		defaultProps,
		compoundVariants,
		defaultVariants,
	} = config

	// Forçar tipagem direta a partir da definição original se disponível
	const variants = (configVariants || {}) as VariantsParam

	const typedDefaultVariants = defaultVariants as
		| DefaultVariantsParam
		| undefined

	const overrideVariantProps = variants
		? Object.fromEntries(Object.keys(variants).map(key => [key, undefined]))
		: {}
	const overrideStyleOnlyProps =
		styleOnly && variants
			? Object.fromEntries(
					Object.keys(variants)
						.filter(key => styleOnly.includes(key))
						.map(key => [key, undefined]),
				)
			: {}

	const ForwardedComponent = forwardRef<
		DefaultAsParam,
		StyledProps<
			DefaultAsParam,
			ContextTypeParam,
			VariantsParam,
			DefaultVariantsParam
		> & { className?: string }
	>((incomingProps, ref) => {
		const {
			as: asProp,
			className,
			...props
		} = incomingProps as StyledProps<
			DefaultAsParam,
			ContextTypeParam,
			VariantsParam,
			DefaultVariantsParam
		> & { as?: DefaultAsParam; className?: string }

		const Tag = (asProp || component) as ElementType
		const isTag = typeof component === 'string'

		const contextValues = {} as Partial<ContextTypeParam>

		const variantKeys = Object.keys(variants)
		const variantProps: Partial<Record<keyof VariantsParam, any>> = {}
		const restProps: Record<string, any> = {}

		for (const key in props) {
			const propValue = (props as Record<string, any>)[key]
			if (variantKeys.includes(key)) {
				variantProps[key as keyof VariantsParam] = propValue
			} else if (Object.prototype.hasOwnProperty.call(props, key)) {
				restProps[key] = propValue
			}
		}

		const finalVariantProps = {
			...typedDefaultVariants,
			...contextValues,
			...variantProps,
		}

		const variantClasses =
			evaluateClassName(
				finalVariantProps,
				variants,
				typedDefaultVariants || {},
				compoundVariants,
				defaultClassName,
			) || ''

		const finalClassName = cn(variantClasses, className)

		const finalElementProps = {
			...defaultProps,
			...restProps,
			...(isTag ? overrideVariantProps : overrideStyleOnlyProps),
			ref,
			className: finalClassName || undefined,
		}

		return createElement(Tag, finalElementProps) as ReactElement<
			any,
			DefaultAsParam
		>
	})

	// Armazenar a referência às props no componente
	if (configProps) {
		// @ts-ignore - Adicionar propriedade interna
		ForwardedComponent[PROPS_REF_KEY] = configProps
	}

	ForwardedComponent.displayName =
		name ||
		(typeof component === 'string'
			? `useStyled.${component}`
			: `useStyled(${
					(component as any).displayName ||
					(component as any).name ||
					'Component'
				})`)

	return ForwardedComponent as unknown as StyledComponentType<
		ContextTypeParam,
		DefaultAsParam,
		VariantsParam,
		DefaultVariantsParam
	>
} as IStyled

for (const domElement of domElements) {
	const typedDomElement = domElement as HTMLTagName
	useStyled[typedDomElement] = (<
		ContextTypeParam extends Record<string, any> | undefined,
		VariantsParam extends VariantsRecord = {},
		DefaultVariantsParam extends GetDefaultVariants<VariantsParam> = {},
	>(
		base: string,
		config?: Omit<
			ComponentConfig<
				ContextTypeParam,
				VariantsParam,
				DefaultVariantsParam,
				typeof typedDomElement
			>,
			'base'
		>,
	) =>
		useStyled<
			ContextTypeParam,
			typeof typedDomElement,
			VariantsParam,
			DefaultVariantsParam
		>(typedDomElement, { ...config, base: base })) as StyledTagFunction<
		typeof typedDomElement
	>
}

import { createElement, forwardRef, ElementType, ReactElement } from 'react'

// Importações condicionais em runtime
let Platform: { OS?: string } = { OS: 'web' }
try {
	// @ts-ignore - Importação dinâmica em runtime
	Platform = require('react-native').Platform || { OS: 'web' }
} catch (e) {
	// Se não conseguir importar react-native, assume que é web
}

// Função auxiliar para interoperar com NativeWind se disponível
const withNativeWindInterop = (Component: ElementType): ElementType => {
	try {
		// Se estamos no ambiente nativo e o nativewind está instalado
		if (Platform.OS !== 'web') {
			try {
				// @ts-ignore - Importação dinâmica em runtime
				const nativewind = require('nativewind')
				if (nativewind?.cssInterop) {
					return nativewind.cssInterop(Component, { className: 'style' })
				}
			} catch (e) {
				// NativeWind não disponível, apenas retorna o componente original
			}
		}
	} catch (e) {
		// Em caso de erro, retornar o componente original é seguro
	}
	return Component
}

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
		context: configContext,
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

		// Usar nossa função auxiliar para aplicar cssInterop se disponível
		const ComponentToRender = withNativeWindInterop(Tag)

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

		// Nova abordagem: Passar explicitamente apenas props externas, ref e className
		// As props originais (incluindo children) estão em restProps.
		const minimalProps = {
			...restProps, // Inclui props originais como 'children'
			ref,
			className: finalClassName || undefined,
		}

		// Adicionar defaultProps (se existirem) de forma segura
		const finalMinimalProps = { ...defaultProps, ...minimalProps }

		return <ComponentToRender {...finalMinimalProps} />
	})

	// Armazenar a referência ao contexto no componente
	if (configContext) {
		// @ts-ignore - Adicionar propriedade interna
		ForwardedComponent[PROPS_REF_KEY] = configContext
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

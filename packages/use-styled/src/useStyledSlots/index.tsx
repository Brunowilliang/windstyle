import React, { forwardRef } from 'react'
import type { ComponentProps, ElementType, ReactNode } from 'react'
import type {
	Component as StyledComponentType,
	GetStyledProps,
	VariantsRecord,
} from '../types' // Importar tipos necessários
import { PROPS_REF_KEY } from '../utils/constants' // Importar constante compartilhada

// Tipo para map de slots
type SlotMapType = Record<
	string,
	StyledComponentType<any, ElementType, any, any>
>

// Configuração para o useStyledSlots
type StyledSlotsConfig<
	ContextType extends Record<string, any> | undefined,
	SlotMap extends SlotMapType,
> = {
	slots: SlotMap // Map de slots
	context?: ContextType // Context opcional para tipagem
}

// Tipo para o componente final
type FinalComponent<FrameProps, SlotMap> = React.ForwardRefExoticComponent<
	FrameProps & React.RefAttributes<any>
> &
	SlotMap // Anexa os slots como propriedades estáticas

export function useStyledSlots<
	// ContextType pode ser undefined
	ContextType extends Record<string, any> | undefined,
	FrameComponent extends StyledComponentType<
		ContextType,
		ElementType,
		VariantsRecord,
		any
	>,
	SlotMap extends SlotMapType,
>(
	frameComponent: FrameComponent,
	config: StyledSlotsConfig<ContextType, SlotMap>,
): FinalComponent<GetStyledProps<FrameComponent>, SlotMap> {
	const { context, slots } = config

	// Armazenar as props do componente pai para repassar aos filhos
	let parentProps: Record<string, any> = {}

	// Armazenar a referência ao contexto no componente principal
	if (context) {
		// @ts-ignore - Adicionar propriedade interna
		frameComponent[PROPS_REF_KEY] = context
	}

	const FinalComponent = forwardRef<any, GetStyledProps<FrameComponent>>(
		(props, ref) => {
			const { children, ...frameProps } = props

			// Armazena as props do componente pai para repassar aos filhos
			parentProps = { ...frameProps }

			// Renderiza o FrameComponent diretamente com suas props
			const frameElement = React.createElement(
				frameComponent as ElementType,
				{ ...frameProps, ref } as ComponentProps<any>,
				children as ReactNode,
			)

			return frameElement
		},
	)

	// Anexar os slots como propriedades estáticas, mas agora com wrappers que repassam as props do pai
	for (const key in slots) {
		if (Object.prototype.hasOwnProperty.call(slots, key)) {
			const OriginalSlotComponent = slots[key]

			// Criar wrapper para o slot que captura as props do pai
			const SlotWrapper = (slotProps: any) => {
				let finalProps = { ...slotProps }

				// Verificar se o componente slot usa o mesmo contexto que o componente principal
				const slotHasSameContext =
					// @ts-ignore - Acessar propriedade interna
					context &&
					// @ts-ignore - Acessar propriedade interna
					OriginalSlotComponent[PROPS_REF_KEY] === context

				// Só propaga as props do pai se o slot tiver o mesmo contexto
				if (slotHasSameContext) {
					// Mescla as props do pai com as props específicas do slot (prioridade para as props do slot)
					finalProps = { ...parentProps, ...slotProps }
				}

				// Renderiza o componente original do slot com props mescladas
				return React.createElement(OriginalSlotComponent, finalProps)
			}

			// Define um displayName útil para debugging
			SlotWrapper.displayName = `${key}(${
				OriginalSlotComponent.displayName || 'Component'
			})`

			// Atribui o wrapper como propriedade do componente final
			;(FinalComponent as any)[key] = SlotWrapper
		}
	}

	// Definir displayName para debugging
	FinalComponent.displayName = `StyledSlots(${
		frameComponent.displayName || 'Frame'
	})`

	return FinalComponent as FinalComponent<
		GetStyledProps<FrameComponent>,
		SlotMap
	>
}

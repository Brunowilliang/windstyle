import type { ElementType, ReactElement, ComponentPropsWithRef } from 'react';
import type { Props, TransformProps, ExtractPropDefinition } from '../useStyledContext';

export type HTMLTagName = keyof JSX.IntrinsicElements

/**
 * Creates a Prop Types from a VariantRecord.
 * Function variants get the type inferred by the first argument type
 */
type EvaluateProps<Variants extends VariantsRecord> = {
  [Prop in keyof Variants]?: Variants[Prop] extends Record<infer K, string>
    ? K extends "true" | "false" | true | false
      ? boolean
      : K
    : Variants[Prop] extends (...args: any) => any
    ? Parameters<Variants[Prop]>[0]
    : never;
};

type EvaluateRecordProps<Variants extends VariantsRecord> = {
  [Prop in keyof Variants]: Variants[Prop] extends Record<string, string>
    ? keyof Variants[Prop]
    : Variants[Prop] extends (arg: any) => any
    ? any
    : never;
};

/**
 * Gets the keys that 2 types have in common
 * GetIntersectionKeys<{ x, y, z }, { h, x, z }> = 'x' | 'z'
 */
type GetIntersectionKeys<T, K extends keyof any> = {
  [k in keyof T]: K extends k ? K : never;
}[keyof T];

/**
 * Create Optional Props type.
 * CreateOptionalProps<{ x: string, y: number}, 'x'> = { x?: string }
 */
type CreateOptionalProps<Props, DefaultVariants> = Partial<
  Pick<Props, GetIntersectionKeys<Props, keyof DefaultVariants>>
>;

type EvaluatePropsWithDefaultVariants<
  Variants extends VariantsRecord,
  DefaultVariants
> = Omit<EvaluateProps<Variants>, keyof DefaultVariants> &
  CreateOptionalProps<EvaluateProps<Variants>, DefaultVariants>;

/**
 * Variants can receive records or functions. This is the function type of it.
 * It would be incredible if we could pass the types to it, but it would need to auto-infer
 * the variants as it's been written.
 */
type ClassNameFunction = (value: any, props: any, variants: any) => string;

export type VariantsRecord = Record<
  string,
  Record<string, string> | ClassNameFunction
>;

export type CompoundVariants<
  Variants extends VariantsRecord,
  Keys extends keyof Variants = keyof Variants
> = Partial<
  {
    [k in Keys]: Variants[k] extends Record<infer K, string>
      ? K extends "true" | "false" | true | false
        ? boolean | "true" | "false"
        : K
      : Variants[k] extends (arg: infer A) => any
        ? A
        : never;
  }
> & {
  defaultTo?: Partial<
    {
      [k in Keys]: (Variants[k] extends Record<infer K, string> 
        ? K extends "true" | "false" 
          ? boolean | "true" | "false" 
          : keyof Variants[k]
        : keyof Variants[k]);
    }
  >;
  class?: string;
};

// More direct definition of a variants map
type DirectVariantsMap<T extends Record<string, any>> = {
  [K in keyof T]?: 
    // Constant array (as const)
    T[K] extends readonly [infer F, ...infer R] 
      ? { [V in T[K][number] & (string | number | symbol)]?: string }
    // Normal array
    : T[K] extends (infer U)[] 
      ? Record<string, string>
      : T[K] extends boolean | BooleanConstructor
        ? { true?: string; false?: string; [key: `${boolean}`]: string }
        : T[K] extends number | NumberConstructor
          ? Record<string | number, string>
          : T[K] extends string
            ? { [V in T[K] & string]?: string }
            : Record<string, string>
};

/**
 * Configuration to create a Component with variants
 */
export interface ComponentConfig<
  ContextType extends Record<string, any> | undefined,
  Variants extends VariantsRecord,
  DefaultVariants,
  DefaultAs extends ElementType
> {
  name?: string;
  context?: ContextType extends TransformProps<any> ? ContextType : Record<string, any>;
  base?: string;
  variants?: ContextType extends Props<infer D> 
    ? DirectVariantsMap<D> 
    : Variants;
  styleOnly?: (keyof Variants)[]; // Properties that are used only for styling and should not be passed to the DOM
  defaultVariants?: DefaultVariants;
  compoundVariants?: Array<CompoundVariants<Variants>>;
  defaultProps?: Partial<
    InferAnyComponentProps<ToIntrinsicElementIfPossible<DefaultAs>>
  >;
}

/**
 * Get Default Values types.
 * It could be better, infering which values it could receive, like using
 * = Partial<Infer<DefaultAs, Variants, {}>>
 * But, that breaks `styled`, as it makes all props optional.
 */
type GetDefaultVariants<Variants extends VariantsRecord> = Partial<{
  [Prop in keyof Variants]: Variants[Prop] extends Record<infer K, string>
    ? K extends "true" | "false" | true | false
      ? boolean | "true" | "false"
      : K
    : Variants[Prop] extends (arg: any) => any
    ? any
    : never;
}>;

/**
 * Styled Component. Supports the As prop, which changes the prop types based on the component
 * it's rendering.
 */
export interface Component<
  ContextType extends Record<string, any> | undefined,
  DefaultAs extends ElementType,
  Variants extends VariantsRecord,
  DefaultVariants
> {
  <As extends ElementType = DefaultAs>(
    props: StyledProps<As, ContextType, Variants, DefaultVariants>
  ): ReactElement<any, any>;

  displayName?: string | undefined;
}

/**
 * Extract Props from a Component
 */
type InferAnyComponentProps<T> = T extends ElementType<infer Props> ? Props : T;

type ToIntrinsicElementIfPossible<As> = As extends keyof HTMLElementTagNameMap
  ? ComponentPropsWithRef<As>
  : As;

/**
 * Extract Props from a Component
 */
export type GetStyledProps<T> = T extends Component<
  infer ContextType,
  infer DefaultAs,
  infer Variants,
  infer DefaultVariants
>
  ? StyledProps<DefaultAs, ContextType, Variants, DefaultVariants>
  : InferAnyComponentProps<T>;

  
type GetPropsWithoutVariantsKeys<
  As extends ElementType,
  Variants extends VariantsRecord
> = Omit<
  InferAnyComponentProps<ToIntrinsicElementIfPossible<As>>,
  keyof Variants | 'as'
>;


/**
 * Evaluates props based on Variants. Variants that have a Default value become optional.
 * It also merges with the Component's Props, replacing the ones that are variants.
 */
export type StyledProps<
  As extends ElementType,
  ContextType extends Record<string, any> | undefined,
  Variants extends VariantsRecord,
  DefaultVariants
> = { as?: As } & GetPropsWithoutVariantsKeys<As, Variants> &
  // Using direct inference from variants instead of EvaluatePropsWithDefaultVariants for better typing
  (ContextType extends TransformProps<infer P>
    ? Partial<TransformProps<P>>  // Use TransformProps for the correct type
    : EvaluatePropsWithDefaultVariants<Variants, DefaultVariants>) & 
  (ContextType extends Record<string, any> ? Partial<ContextType> : {});

/**
 * Styled Function should infer the Component, the Variants object and the Default
 * Variants values so the created component has the right props.
 */
type StyledFunction = <
  ContextType extends Record<string, any> | undefined,
  DefaultAs extends ElementType,
  Variants extends VariantsRecord = {},
  DefaultVariants extends GetDefaultVariants<Variants> = {}
>(
  component: DefaultAs,
  config: ComponentConfig<ContextType, Variants, DefaultVariants, DefaultAs>
) => Component<ContextType, DefaultAs, Variants, DefaultVariants>;

/**
 * Styled should be callable by:
 *   styled('a', { className: 'text-sm', variants: { ... } })
 *   styled(Component, { className: '...', variants: { ... } })
 *   styled.a('text-sm', { variants: { ... } })
 *   styled.a('text-sm')
 */
export type IStyled = StyledFunction &
  {
    [DefaultAs in HTMLTagName]: StyledTagFunction<DefaultAs>;
  };

export type StyledTagFunction<DefaultAs extends HTMLTagName> = <
  ContextType extends Record<string, any> | undefined,
  Variants extends VariantsRecord = {},
  DefaultVariants extends GetDefaultVariants<Variants> = {}
>(
  cx: string,
  config?: Omit<
    ComponentConfig<ContextType, Variants, DefaultVariants, DefaultAs>,
    'base'
  >
) => Component<ContextType, DefaultAs, Variants, DefaultVariants>;
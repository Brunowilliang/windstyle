import { cn } from "./cn";
import type { VariantsRecord } from "../types";

/**
 *
 * @param props
 * @param variants
 * @param defaultClassName
 * @returns
 */
export const evaluateClassName = (
  props: Record<string, any>,
  variants: VariantsRecord,
  defaultVariants?: Record<string, any>,
  compoundVariants?: Record<string, any>[],
  defaultClassName = ''
): string => {
  const classNames = [defaultClassName, props.className || ''];
  let compoundedClassName = '';
  let compoundedDefaults: Record<string, any> = {};

  // get a variant value from props
  const getVariantValue = (key: string, selectFromCompounded = false) => {
    if (props[key] === undefined) {
      const defaultValue = defaultVariants?.[key];
      if (selectFromCompounded) {
        return (
          compoundedDefaults[key as keyof typeof compoundedDefaults] ||
          defaultValue
        );
      }

      return defaultValue;
    }

    return props[key];
  };

  if (compoundVariants) {
    let lastSelectorPrecision = 0;
    // We need to map variants first so we can use them in the next step
    compoundVariants?.some(({ defaultTo, class: className, ...selector }) => {
      const keys = Object.keys(selector);
      const selectorPrecision = keys.length;
      const selectorMatches = keys.every(key => {
        const propValue = getVariantValue(key);
        const selectorValue = selector[key];
        
        // Converter valores booleanos para strings se necessário
        if (typeof propValue === 'boolean' && typeof selectorValue === 'boolean') {
          return propValue === selectorValue;
        }
        
        if (typeof propValue === 'boolean' && typeof selectorValue === 'string') {
          return String(propValue) === selectorValue;
        }
        
        if (typeof selectorValue === 'boolean' && typeof propValue === 'string') {
          return propValue === String(selectorValue);
        }
        
        return propValue === selectorValue;
      });

      if (selectorMatches && selectorPrecision >= lastSelectorPrecision) {
        compoundedClassName = className || '';
        compoundedDefaults = defaultTo || {};
        lastSelectorPrecision = selectorPrecision;
      }
    });
  }

  for (const key of Object.keys(variants)) {
    const variant = variants[key];
    const value = getVariantValue(key, true);

    if (typeof variant === 'function') {
      classNames.push(variant(value, props, variants)?.trim());
    } else {
      // Converter valores booleanos para strings "true"/"false" para acessar o objeto de variantes
      const lookupValue = typeof value === 'boolean' ? String(value) : value;
      classNames.push(variant[lookupValue]?.trim());
    }
  }

  classNames.push(compoundedClassName);

  // Use cn to properly merge Tailwind classes
  return cn(...classNames.filter(Boolean));
};
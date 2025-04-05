import { cn } from "./cn";
import type { VariantsRecord } from "../types";

/**
 * Evaluates conditional classes based on props and variants
 * @param props Props passed to the component
 * @param variants Variants definition
 * @param defaultVariants Default values for variants
 * @param compoundVariants Combinations of variants
 * @param defaultClassName Base class
 * @returns String with concatenated classes
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

  // Normalizes boolean values to strings when needed
  const normalizeValue = (value: any): any => {
    return typeof value === 'boolean' ? String(value) : value;
  };

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
        
        // Normalizes values for comparison
        const normalizedPropValue = normalizeValue(propValue);
        const normalizedSelectorValue = normalizeValue(selectorValue);
        
        return normalizedPropValue === normalizedSelectorValue;
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
      // Normalizes boolean values to strings for variant object access
      const lookupValue = normalizeValue(value);
      classNames.push(variant[lookupValue]?.trim());
    }
  }

  classNames.push(compoundedClassName);

  // Use cn to properly merge Tailwind classes
  return cn(...classNames.filter(Boolean));
};
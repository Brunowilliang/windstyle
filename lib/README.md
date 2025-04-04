# use-styled

A lightweight library for creating styled components, optimized for use with Tailwind CSS and compatible with Server Components.

## Key Features

- 🔄 **Automatic prop propagation** between components
- 📦 **Zero dependency** on Context API - works in Server Components!
- 🎯 **Intelligent typing** with value inference for autocompletion
- 🧩 **Component composition** via slots
- 🔍 **Enhanced IntelliSense** with valid value suggestions
- 🛡️ **Native TypeScript** with perfect inference

## Installation

```bash
npm install use-styled
# or
yarn add use-styled
# or
pnpm add use-styled
```

## Usage Example

```tsx
import { useStyled, useStyledProps, useStyledSlots } from 'use-styled'

// Simplified syntax to define props with typing
export const ButtonProps = useStyledProps({
  // Array of strings = union type
  variant: ['primary', 'secondary', 'danger'] as const,
  // Array of strings = union type
  size: ['sm', 'md', 'lg'] as const,
  // Boolean constructor = boolean type
  disabled: Boolean,
})

// Create the main component using useStyled
export const ButtonFrame = useStyled('button', {
  name: 'ButtonFrame',
  props: ButtonProps, // The type system recognizes the types defined above
  variants: {
    // ✓ Autocomplete will suggest ButtonProps keys: variant, size, disabled
    variant: {
      // ✓ Autocomplete will suggest valid values: primary, secondary, danger
      primary: 'bg-blue-500 hover:bg-blue-600',
      secondary: 'bg-gray-200 hover:bg-gray-300',
      danger: 'bg-red-500 hover:bg-red-600',
    },
    size: {
      // ✓ Autocomplete will suggest valid values: sm, md, lg
      sm: 'h-10',
      md: 'h-12',
      lg: 'h-14',
    },
    disabled: {
      // ✓ Autocomplete will suggest true and false for boolean values
      true: 'opacity-50 cursor-not-allowed',
      false: 'opacity-100',
    }
  },
})

// Create child components that will use the same props
export const ButtonText = useStyled('p', {
  name: 'ButtonText',
  props: ButtonProps, // Same props object for inference and propagation
  variants: {
    // ✓ Same type inference here too
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
    }
  },
})

// Use useStyledSlots to create the final component with its slots
export const Button = useStyledSlots(ButtonFrame, {
  slots: {
    Text: ButtonText,
  },
  props: ButtonProps,
})

// Final usage
function App() {
  return (
    <Button variant="primary" size="sm" disabled={false}>
      <Button.Text>Click me</Button.Text>
    </Button>
  )
}
```

## API

### useStyledProps

Creates variant props for a component with simplified typing:

```tsx
// New type syntax - much cleaner!
const ComponentProps = useStyledProps({
  // Array = union type
  variant: ['default', 'primary', 'secondary'] as const,
  size: ['sm', 'md', 'lg'] as const,
  
  // Constructors = primitive types
  disabled: Boolean,
  count: Number,
  label: String,
  
  // Literal value = literal type
  shape: 'rounded',
})
```

This is equivalent to writing the following TypeScript type:

```tsx
type ComponentProps = {
  variant: 'default' | 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  count: number;
  label: string;
  shape: 'rounded';
}
```

### useStyled

Creates a styled component with variants. The variants are typed based on the `props` object provided:

```tsx
const StyledComponent = useStyled('div', {
  name: 'MyComponent', // Optional
  props: ComponentProps, // Props created with useStyledProps
  base: 'flex items-center justify-center',
  variants: {
    // The editor will show valid options based on ComponentProps
    variant: {
      // Autocomplete will only show 'default', 'primary', 'secondary'
      default: 'bg-white text-black',
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-800',
    },
    // Other variants are suggested based on ComponentProps
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    disabled: false,
  },
  styleOnly: ['variant', 'size'], // Props used only for styling and not passed to the DOM
})
```

#### `styleOnly` Property

The `styleOnly` property allows you to specify which variant props are used only to apply styles and should not be passed to the underlying DOM element:

```tsx
styleOnly: ['variant', 'size', 'shape'] // These props won't appear as HTML attributes
```

Benefits:
- Avoids React warnings about unknown props
- Keeps the DOM clean (without custom attributes)
- Improves accessibility and SEO

For example, with `styleOnly: ['variant']`, the generated element will be:
```html
<!-- With styleOnly -->
<button class="text-white bg-blue-500">Button</button>

<!-- Without styleOnly -->
<button variant="primary" class="text-white bg-blue-500">Button</button>
```

### useStyledSlots

Creates a composite component with slots:

```tsx
const FinalComponent = useStyledSlots(MainComponent, {
  slots: {
    // Components that will be accessible as FinalComponent.Slot
    Label: LabelComponent,
    Icon: IconComponent,
  },
  props: ComponentProps, // Optional, only for typing
})
```

## Intelligent Typing

The `use-styled` library offers a perfect developer experience with automatic type inference:

1. **Clear type definition**: Use arrays for union types and constructors for primitive types
   ```tsx
   const Props = useStyledProps({
     variant: ['primary', 'secondary'],  // union type
     disabled: Boolean,                  // boolean
   })
   ```

2. **IntelliSense in variants**: The editor suggests only valid keys and their possible values
   ```tsx
   variants: {
     // The editor only allows 'variant' and 'disabled' here
     variant: {
       // The editor only allows 'primary' and 'secondary' here
     }
   }
   ```

3. **Automatic typing in usage**: The editor shows valid values when using the component
   ```tsx
   <Button 
     variant="primary" // Only accepts 'primary' or 'secondary'
     disabled={false}  // Only accepts true or false
   />
   ```

## Prop Propagation Between Components

One of the main features of `use-styled` is the ability to automatically propagate props from the parent component to its child slots, without having to define them again.

### How it works:

1. **Define shared props with `useStyledProps`**:
```tsx
const ButtonProps = useStyledProps({
  variant: ['primary', 'secondary'],
  size: ['sm', 'md', 'lg'],
  disabled: Boolean,
})
```

2. **Use the same props in each component**:
```tsx
const ButtonFrame = useStyled('button', {
  props: ButtonProps, // ⚠️ This line is crucial!
  variants: {
    variant: { /* ... */ },
    size: { /* ... */ },
    disabled: { /* ... */ },
  },
})

const ButtonText = useStyled('p', {
  props: ButtonProps, // ⚠️ This line is crucial!
  variants: {
    variant: { /* ... */ },
    size: { /* ... */ },
    disabled: { /* ... */ },
  },
})
```

3. **Create the final component with `useStyledSlots`**:
```tsx
const Button = useStyledSlots(ButtonFrame, {
  slots: { Text: ButtonText },
  props: ButtonProps, // Optional, only for typing
})
```

4. **Use the component - props will be propagated automatically**:
```tsx
<Button variant="primary" size="lg" disabled={true}>
  <Button.Text>
    {/* variant="primary", size="lg", and disabled={true} are automatically applied here */}
    Text styled with the same props as Button
  </Button.Text>
</Button>
```

### Important:

For variant propagation to work correctly:

1. Create a props object with `useStyledProps`
2. Pass **exactly the same object** to the `props` parameter in each component that should share the variants
3. Use `useStyledSlots` to create the final component

### Fine-grained propagation control

Prop propagation only happens between components that share the **same props object**:

```tsx
// Props for the main button
const ButtonProps = useStyledProps({
  variant: ['primary', 'secondary'],
  disabled: Boolean,
})

// Different props for the icon
const IconProps = useStyledProps({
  color: ['blue', 'red'],
  rounded: Boolean,
})

const ButtonFrame = useStyled('button', { 
  props: ButtonProps, /* ... */ 
})
const ButtonText = useStyled('span', { 
  props: ButtonProps, /* ... */ // ✅ Will receive props from Button
})
const ButtonIcon = useStyled('i', { 
  props: IconProps, /* ... */   // ❌ Will NOT receive props from Button
})

const Button = useStyledSlots(ButtonFrame, {
  slots: { 
    Text: ButtonText, // Receives Button props
    Icon: ButtonIcon, // Does NOT receive Button props
  },
})
```

This allows you to control exactly which components should share props.

## Server Components Compatibility

The `use-styled` library is designed to work perfectly with React Server Components, without the need to use the `'use client'` directive. This is possible because the library doesn't use React Context or other hooks that only work on the client side.

## License

MIT 
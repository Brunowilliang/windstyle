# use-styled

A lightweight styled components library optimized for Tailwind CSS.

## Installation

```bash
npm install use-styled
# or
yarn add use-styled
```

## Basic Usage

```tsx
import { styled } from 'use-styled';

const Button = styled('button', {
  base: 'px-4 py-2 rounded-md',
  variants: {
    intent: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-800',
    }
  }
});

export default function App() {
  return (
    <div>
      <Button intent="primary">Primary Button</Button>
      <Button intent="secondary">Secondary Button</Button>
    </div>
  );
}
```

More documentation coming soon. 
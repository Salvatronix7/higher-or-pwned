# higher-or-pwned

## Codex file-structure rule

When creating any new component, hook, provider, or similar module in this project, always follow this file layout inside its folder:

```
file/
  file.ts
  file.types.ts
  file.css
  file.constants.ts
  file.utils.ts
  index.ts
```

### Notes

- Use the exact base name (`file`) for all sibling files in the folder.
- Use `.tsx` instead of `.ts` when the file contains JSX (e.g., React components).
- Keep each concern in its dedicated file (types, constants, utils, styles, exports).

## AsciiFireColor demo

```tsx
import { AsciiFireColor } from './app/components';

export const FireDemo = () => (
  <AsciiFireColor width={96} height={32} fps={24} className="fireDemo" />
);
```

```css
.fireDemo {
  max-width: 100%;
}
```

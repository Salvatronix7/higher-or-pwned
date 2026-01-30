# AsciiDoomFire

Minimal usage:

```tsx
import { AsciiDoomFire } from '@/components';

export const FirePanel = () => (
  <AsciiDoomFire width={80} height={40} fps={30} decayMax={2} driftRange={1} />
);
```

CSS notes (monospace + tight line height):

```css
.asciiDoomFire {
  font-family: 'Courier New', monospace;
  line-height: 1;
}
```

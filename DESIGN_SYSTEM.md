# The Home Pizza - Design System

Complete design system documentation with color tokens, typography scales, component utilities, and best practices.

## 📦 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts & metadata
│   ├── page.tsx            # Landing page (home)
│   ├── globals.css         # Tailwind + design tokens + custom utilities
│   ├── favicon.ico
│   ├── sitemap.ts          # Generated sitemap
│   ├── robots.ts           # Generated robots.txt
│   └── opengraph-image.tsx # OG image (future: dynamic)
├── components/
│   ├── layout/             # Header, Footer, Container
│   ├── sections/           # Hero, Menu, About, Testimonials, CTA, ...
│   │   └── hero/
│   │       ├── hero.tsx
│   │       ├── hero-video.tsx (client component if needed)
│   │       └── index.ts
│   ├── ui/                 # Button, Badge, Card, Input components
│   └── icons/              # SVG icon components
│       ├── icon.type.ts
│       ├── ic-arrow-down.tsx
│       ├── ic-arrow-right.tsx
│       ├── ic-facebook.tsx
│       ├── ic-instagram.tsx
│       ├── ic-file.tsx
│       ├── ic-globe.tsx
│       └── index.ts
├── lib/
│   ├── design-tokens.ts    # Color palette, spacing, typography scales
│   ├── tailwind-utils.ts   # Reusable Tailwind class collections
│   ├── constants.ts        # Navigation, social links, business info
│   ├── metadata.ts         # Metadata builders, JSON-LD schemas
│   └── utils.ts            # Common helper functions
└── hooks/                  # Client-only React hooks (future)
```

---

## 🎨 Color Palette

All colors defined as CSS custom properties in `src/app/globals.css`.

### Brand Colors

| Name    | Value    | CSS Variable         | Use Case                    |
| ------- | -------- | -------------------- | --------------------------- |
| Cream   | #EFE9DE  | `--palette-cream`    | Primary background          |
| Clay    | #CEA980  | `--palette-clay`     | Accent, hover states        |
| Umber   | #765032  | `--palette-umber`    | Deep accent, CTAs           |
| Ink     | #162F3E  | `--palette-ink`      | Text, dark elements         |
| Linen   | #E1D2B9  | `--palette-linen`    | Subtle surfaces, borders    |

### Semantic Aliases

| Variable            | Maps To          | Purpose            |
| ------------------- | ---------------- | ------------------ |
| `--background`      | `--palette-cream` | Page background    |
| `--foreground`      | `--palette-ink`   | Primary text       |
| `--surface`         | `--palette-linen` | Subtle backgrounds |
| `--accent`          | `--palette-clay`  | Interactive states |
| `--accent-deep`     | `--palette-umber` | Strong accents     |

### Tailwind Color Classes

Use these classes in your components:

```tsx
<div className="bg-cream">           {/* background */}
<div className="bg-clay">            {/* accent */}
<div className="bg-umber">           {/* accent-deep */}
<div className="bg-ink">             {/* foreground */}
<div className="bg-linen">           {/* surface */}
<div className="text-cream">         {/* text colors */}
```

---

## 🔤 Typography

### Fonts

- **Display**: `dfvn-abygaer` (custom) — headings
- **Body**: `Raleway` (Google Fonts) — body text
- **Mono**: System monospace — code blocks

### Font Weights

- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Text Scale & Tailwind Classes

| Class | Size          | Use Case          |
| ----- | ------------- | ----------------- |
| `.h1` | 3rem / 5rem   | Page hero title   |
| `.h2` | 2.25rem / 3rem | Section headings  |
| `.h3` | 1.875rem / 2.25rem | Subsection       |
| `.h4` | 1.5rem / 1.875rem | Component title   |
| `.h5` | 1.25rem       | Card titles       |
| `.body-md` | 1rem / 1.125rem | Body text        |
| `.body-sm` | 0.875rem / 1rem | Small text       |
| `.caption` | 0.75rem / 0.875rem | Labels, captions |
| `.label` | 0.875rem    | Form labels       |

**Usage:**

```tsx
<h1 className="h1">Welcome to The Home Pizza</h1>
<h2 className="h2">Our Menu</h2>
<p className="body-md">Delicious handmade pizzas...</p>
```

---

## 🎯 Spacing System

| Token | Size   | Tailwind Class |
| ----- | ------ | -------------- |
| xs    | 4px    | `gap-1`        |
| sm    | 8px    | `gap-2`        |
| md    | 16px   | `gap-4`        |
| lg    | 24px   | `gap-6`        |
| xl    | 32px   | `gap-8`        |
| 2xl   | 40px   | `gap-10`       |
| 3xl   | 48px   | `gap-12`       |
| 4xl   | 64px   | `gap-16`       |
| 5xl   | 96px   | `gap-24`       |

---

## 🧩 Reusable Component Classes

All defined in `src/app/globals.css` as Tailwind `@layer utilities` and available as presets in `src/lib/tailwind-utils.ts`.

### Buttons

```tsx
<button className="btn-primary btn-md">Primary Button</button>
<button className="btn-secondary btn-md">Secondary Button</button>
<button className="btn-ghost btn-md">Ghost Button</button>
```

| Class | Purpose |
| ----- | ------- |
| `.btn-base` | Base button styles |
| `.btn-primary` | Primary CTA button |
| `.btn-secondary` | Secondary button |
| `.btn-ghost` | Transparent button |
| `.btn-sm` / `.btn-md` / `.btn-lg` | Size variants |

### Cards

```tsx
<div className="card-base">Card content</div>
<div className="card-elevated">Elevated card</div>
<div className="card-bordered">Bordered card</div>
```

### Containers

```tsx
<div className="container-base">Main container</div>
<div className="container-narrow">Narrow container</div>
```

### Section Spacing

```tsx
<section className="section">Full section spacing</section>
<section className="section-sm">Small section</section>
<section className="section-lg">Large section</section>
```

### Typography Utilities

```tsx
<h1 className="h1">Main heading</h1>
<p className="body-md">Body text</p>
<span className="caption">Caption text</span>
```

### Links

```tsx
<a href="#" className="link-default">Regular link</a>
<a href="#" className="link-navigation">Navigation link</a>
```

### Animations

```tsx
<div className="animate-fade-in">Fade in</div>
<div className="animate-slide-up">Slide up</div>
<div className="animate-slide-down">Slide down</div>
<div className="animate-slide-left">Slide left</div>
<div className="animate-slide-right">Slide right</div>
```

### Responsive Display

```tsx
<div className="hide-mobile">Hidden on mobile</div>
<div className="show-mobile">Visible on mobile only</div>
<div className="hide-tablet">Hidden on tablet</div>
```

### Transitions

```tsx
<div className="transition-smooth">Smooth transition</div>
<div className="transition-smooth-slow">Slow transition</div>
<div className="transition-smooth-fast">Fast transition</div>
```

---

## 🎬 Animations

Defined in `src/app/globals.css`, all animations respect `prefers-reduced-motion`.

| Animation | Duration | Easing   |
| --------- | -------- | -------- |
| `fade-in` | 300ms    | ease-out |
| `slide-up` | 400ms   | ease-out |
| `slide-down` | 400ms | ease-out |
| `slide-left` | 400ms | ease-out |
| `slide-right` | 400ms | ease-out |

**Custom usage:**

```css
@keyframes custom-animation {
  from { opacity: 0; }
  to { opacity: 1; }
}

@layer utilities {
  .animate-custom {
    animation: custom-animation 0.3s ease-out;
  }
}
```

---

## 📦 Icons

Icon components located in `src/components/icons/`.

### Available Icons

- `IcArrowDown`
- `IcArrowRight`
- `IcFacebook`
- `IcInstagram`
- `IcFile`
- `IcGlobe`

### Icon Usage

```tsx
import { IcFacebook, IcArrowRight } from '@/components/icons';

<IcFacebook size="md" className="text-accent" />
<IcArrowRight size={24} color="currentColor" />
```

### Adding New Icons

1. Create `src/components/icons/ic-{name}.tsx`
2. Implement icon component using `IconProps` interface
3. Add to `src/components/icons/index.ts` export
4. Use size prop and `getIconSize()` utility

---

## 🛠️ Utility Functions

Common helpers in `src/lib/utils.ts`:

```typescript
// Class merging
cn('px-4', condition && 'py-2', false && 'hidden')
// → 'px-4 py-2'

// Formatting
formatPrice(14.99)           // → '$14.99'
formatPhoneNumber('5551234567') // → '(555) 123-4567'
formatDate(new Date())       // → 'January 15, 2024'

// String manipulation
capitalize('hello')          // → 'Hello'
truncate('Long text...', 10) // → 'Long text...'

// Validation
isValidEmail('test@example.com') // → true

// Timing
debounce(fn, 300)
throttle(fn, 500)
sleep(1000)

// ID generation
generateId('user-')          // → 'user-1a2b3c4d'

// Math
clamp(5, 0, 10)             // → 5
lerp(0, 100, 0.5)           // → 50
```

---

## 📐 Constants & Configuration

All business-related constants in `src/lib/constants.ts`:

```typescript
import { businessInfo, navigation, socialLinks } from '@/lib/constants';

businessInfo.name          // 'The Home Pizza'
businessInfo.phone         // '+1 (555) 123-4567'
navigation.main            // Array of nav items
socialLinks               // Array of social links
```

---

## 🔍 SEO & Metadata

Metadata utilities in `src/lib/metadata.ts`:

```typescript
import { rootMetadata, generatePageMetadata, generateRestaurantSchema } from '@/lib/metadata';

// Root layout
export const metadata = rootMetadata;

// Page-specific metadata
export const metadata = generatePageMetadata(
  'Menu | The Home Pizza',
  'Browse our handmade pizza menu...'
);

// JSON-LD Schema
<script type="application/ld+json" dangerouslySetInnerHTML={{
  __html: generateRestaurantSchema()
}} />
```

---

## ✅ Best Practices

### Component Structure

```tsx
// ✅ Good: Server component, split client parts
export function HeroSection() {
  return (
    <section className="section">
      <div className="container-base">
        {/* Server-rendered content */}
      </div>
    </section>
  );
}

// Client component for interactivity only
'use client';
export function HeroVideo() {
  // Video controls, state, etc.
}
```

### Using Tailwind Classes

```tsx
// ✅ Use semantic utility classes
<button className="btn-primary btn-md">Click me</button>

// ❌ Avoid hand-rolling
<button className="bg-clay px-6 py-3 rounded-lg hover:bg-amber-700">Click me</button>

// ✅ Use cn() for dynamic classes
<button className={cn('btn-primary', isLoading && 'opacity-50 cursor-not-allowed')}>
  {isLoading ? 'Loading...' : 'Click me'}
</button>
```

### Image Optimization

```tsx
// ✅ Always use next/image
import Image from 'next/image';

<Image
  src="/images/pizza.jpg"
  alt="Margherita pizza"
  width={400}
  height={300}
  className="rounded-lg"
/>

// ❌ Never use <img>
<img src="/images/pizza.jpg" />
```

### Animations

```tsx
// ✅ CSS-based animations (no JS)
<div className="animate-fade-in">Content</div>

// ✅ Respect prefers-reduced-motion automatically
// (handled in globals.css)

// ❌ Don't rely on heavy JS animation libraries
// unless absolutely necessary
```

---

## 📝 Adding New Design Tokens

1. **Colors**: Add to `src/app/globals.css` as CSS custom property
2. **Spacing**: Update `src/lib/design-tokens.ts`
3. **Typography**: Extend `.h1`, `.h2`, etc. in `globals.css`
4. **Component utilities**: Add to `@layer utilities` in `globals.css`
5. **Update Tailwind presets**: Add to `src/lib/tailwind-utils.ts`

---

## 🚀 Ready to Build

You now have:

✅ Comprehensive color system  
✅ Typography scales & font setup  
✅ Reusable component classes  
✅ Animation framework  
✅ Icon system  
✅ Utility functions  
✅ SEO & metadata helpers  
✅ Business constants  

Start building sections by importing from `@/lib/*` and `@/components/*`.

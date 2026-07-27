# Illustrations System

Decorative food & ingredient illustrations for The Home Pizza landing page.

## 📦 Available Illustrations

Located in `src/components/illustrations/`

### Pizza & Basics

- **`IlustPizza`** — Slice of pizza with cheese and toppings
- **`IlustMozzarella`** — Fresh mozzarella ball

### Vegetables & Produce

- **`IlustTomato`** — Whole tomato with ridges and stem
- **`IlustPepper`** — Bell pepper (red/green style)
- **`IlustMushroom`** — Mushroom with gills and stem
- **`IlustGarlic`** — Garlic bulb with cloves

### Herbs & Toppings

- **`IlustBasil`** — Fresh basil leaves on stem
- **`IlustOlive`** — Black olive with pit line

## 🎨 Usage

All illustrations accept the same props as the icon system:

```tsx
import { IlustPizza, IlustTomato, IlustBasil } from '@/components/illustrations';

// Basic usage
<IlustPizza />

// With size variants
<IlustTomato size="lg" />
<IlustBasil size="sm" />

// With custom color (uses currentColor)
<IlustPepper className="text-accent" />
<IlustMozzarella className="text-umber" />

// Custom width/height
<IlustGarlic width={48} height={48} />

// With accessibility
<IlustOlive title="Fresh olive topping" ariaLabel="Olive ingredient" />
```

## 📐 Size Variants

- **`xs`** — 16px (tiny accents)
- **`sm`** — 20px (inline use)
- **`md`** — 24px (default, section headers)
- **`lg`** — 32px (featured ingredients)
- **`xl`** — 48px (hero/featured sections)
- **Custom** — Pass any number: `size={64}`

## 🎯 Common Use Cases

### Ingredient List Section

```tsx
<div className="grid grid-cols-3 gap-6">
  <div className="flex flex-col items-center gap-2">
    <IlustPizza size="lg" className="text-accent" />
    <span className="text-sm font-semibold">Classic Pizzas</span>
  </div>

  <div className="flex flex-col items-center gap-2">
    <IlustTomato size="lg" className="text-umber" />
    <span className="text-sm font-semibold">Fresh Produce</span>
  </div>

  <div className="flex flex-col items-center gap-2">
    <IlustBasil size="lg" className="text-clay" />
    <span className="text-sm font-semibold">Quality Herbs</span>
  </div>
</div>
```

### Hero Section Decoration

```tsx
<section className="section relative">
  <div className="absolute top-20 left-10 opacity-20">
    <IlustPizza size="xl" className="text-accent" />
  </div>

  <div className="container-base relative z-10">
    {/* Main content */}
  </div>

  <div className="absolute bottom-20 right-10 opacity-20">
    <IlustMozzarella size="xl" className="text-clay" />
  </div>
</section>
```

### Menu Item Cards

```tsx
<div className="card-base">
  <div className="flex gap-4">
    <div className="flex-shrink-0">
      <IlustPepper size="lg" className="text-umber" />
    </div>
    <div>
      <h3 className="h5">Red Pepper</h3>
      <p className="body-sm text-muted">Fresh roasted peppers</p>
    </div>
  </div>
</div>
```

### Background Pattern

```tsx
<div className="grid grid-cols-4 gap-8 opacity-10 pointer-events-none">
  <IlustTomato size="xl" className="text-foreground" />
  <IlustBasil size="xl" className="text-foreground" />
  <IlustMozzarella size="xl" className="text-foreground" />
  <IlustGarlic size="xl" className="text-foreground" />
  {/* Repeat as needed */}
</div>
```

## 🎨 Styling Tips

### Color Variants

```tsx
{/* Use semantic color classes */}
<IlustTomato className="text-accent" />           {/* Clay */}
<IlustBasil className="text-umber" />             {/* Deep umber */}
<IlustPepper className="text-ink" />              {/* Dark ink */}
<IlustMozzarella className="text-clay" />         {/* Accent */}

{/* Or with opacity */}
<IlustPizza className="text-foreground opacity-50" />
```

### Sizing for Different Contexts

```tsx
{/* Inline in text */}
<p>We use <IlustTomato size="sm" className="inline" /> fresh tomatoes</p>

{/* Section accent */}
<h2 className="h2 flex items-center gap-3">
  <IlustBasil size="md" />
  Our Ingredients
</h2>

{/* Featured showcase */}
<div className="aspect-square bg-surface rounded-lg flex items-center justify-center">
  <IlustMozzarella size="xl" className="text-accent" />
</div>
```

## 🔄 Animation Ideas

```tsx
{/* Fade in with scroll */}
<div className="animate-fade-in">
  <IlustPizza size="lg" />
</div>

{/* Animated hover */}
<div className="group hover:scale-110 transition-transform duration-300">
  <IlustTomato size="lg" className="text-accent" />
</div>

{/* Staggered entrance */}
<div style={{ animation: 'slide-up 0.4s ease-out' }}>
  <IlustBasil size="lg" />
</div>
```

## 📋 Icon vs Illustration

### Icons (`src/components/icons/`)
- Utility/UI icons (arrows, social media, file)
- 16-48px typical
- Solid fills or simple strokes
- Used in buttons, navigation, etc.

### Illustrations (`src/components/illustrations/`)
- Food/ingredient drawings
- 24-96px typical (larger accent pieces)
- Decorative detail lines
- Used for visual storytelling, sections

## 🛠️ Adding New Illustrations

1. Create file: `src/components/illustrations/illus-{name}.tsx`
2. Use SVG with:
   - `currentColor` stroke for theming
   - Appropriate `viewBox` size
   - `IconProps` interface for consistency
   - `getIconSize()` utility for sizing
3. Add to `src/components/illustrations/index.ts` export
4. Document in this file

### Template

```tsx
import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustItemName({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      className={className}
      {...props}
    >
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* SVG paths here */}
      </g>
    </svg>
  );
}
```

## ✅ Best Practices

✅ Use `currentColor` for stroke so colors can be changed via CSS  
✅ Keep stroke widths consistent (1.2 for main, 0.8 for details)  
✅ Add detail lines with reduced opacity for depth  
✅ Use semantic color classes when applying  
✅ Provide `title` prop for accessibility  
✅ Respect `prefers-reduced-motion` (illustrations don't animate by default)  

❌ Don't use fill colors hardcoded to SVG  
❌ Don't mix different stroke width styles  
❌ Don't make illustrations too detailed for small sizes  
❌ Don't forget accessibility props  

## 🎬 Future Illustrations to Add

Based on typical pizza restaurant menus:

- 🍝 Pasta variations
- 🧅 Onions
- 🌶️ Chili peppers
- 🥓 Bacon/meat
- 🧈 Butter
- 🍞 Bread/crust
- 🍖 Various proteins
- 🥗 Salad components
- 🍷 Wine/beverages

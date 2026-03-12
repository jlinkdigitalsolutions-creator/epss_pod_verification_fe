# Reusable UI Components

This document describes the design system and reusable components used across the app. The stack is **React**, **Tailwind CSS**, **shadcn-style** components (Radix primitives + CVA), and **Framer Motion** for animations.

---

## Design System

- **Theme:** Light (default) / Dark, toggled via `ThemeToggle`. Preference stored in `localStorage` under `epss-theme`.
- **Colors:** CSS variables in `src/index.css` (`--primary`, `--background`, etc.). Use Tailwind utilities: `bg-primary`, `text-muted-foreground`, `border-border`, etc.
- **Spacing:** Tailwind scale (1–30, 18/22/30 extended in config). Use `p-4`, `gap-4`, `space-y-4` for consistency.
- **Radius:** `--radius` (0.625rem). Use `rounded-lg`, `rounded-xl`, `rounded-2xl` for components.
- **Transitions:** Theme switch uses 300ms; buttons/inputs use `transition-all duration-200`.

---

## Button

**Path:** `@/components/ui/button`

**Variants:** `default` | `gradient` | `destructive` | `outline` | `secondary` | `ghost` | `link`  
**Sizes:** `default` | `sm` | `lg` | `icon`

**Example:**

```jsx
import { Button } from '@/components/ui/button';

<Button>Primary</Button>
<Button variant="gradient">Gradient CTA</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" size="icon" aria-label="Close"><X className="h-4 w-4" /></Button>
<Button disabled><Spinner className="h-4 w-4" /> Loading...</Button>
```

---

## Input

**Path:** `@/components/ui/input`

Supports optional `leftIcon`, `rightIcon`, and `error` (or `aria-invalid`) for validation.

**Example:**

```jsx
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

<Input placeholder="Email" type="email" />
<Input placeholder="Search" leftIcon={<Search className="h-4 w-4" />} />
<Input placeholder="Name" error="Name is required" id="name" />
```

---

## ThemeToggle

**Path:** `@/components/ui/ThemeToggle`

Requires `ThemeProvider` (from `@/contexts/ThemeContext`) above in the tree.

**Example:**

```jsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

<ThemeToggle />
<ThemeToggle variant="outline" size="icon" className="rounded-full" />
```

---

## Card

**Path:** `@/components/ui/card`

**Subcomponents:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

**Example:**

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

---

## Modal / Dialog

**Path:** `@/components/ui/dialog`

Uses Radix Dialog. Overlay has backdrop blur; content uses `bg-card` and rounded corners.

**Example:**

```jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* body */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Alert

**Path:** `@/components/ui/alert`

**Variants:** `default` | `destructive` | `success` | `warning` | `info`

**Example:**

```jsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
<Alert variant="success">Saved successfully.</Alert>
```

---

## Select

**Path:** `@/components/ui/select`

Radix Select with styled trigger and content.

**Example:**

```jsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
    <SelectItem value="b">Option B</SelectItem>
  </SelectContent>
</Select>
```

---

## Label

**Path:** `@/components/ui/label`

Use with `htmlFor` and input `id` for accessibility.

**Example:**

```jsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

---

## Spinner

**Path:** `@/components/ui/spinner`

**Sizes:** `sm` | `md` | `lg`

**Example:**

```jsx
import { Spinner } from '@/components/ui/spinner';

<Spinner size="md" />
<Button disabled><Spinner size="sm" className="border-primary-foreground border-t-transparent" /> Loading</Button>
```

---

## Layout

- **Logo:** `@/components/layout/Logo` — `size="sm"|"md"|"lg"`, `variant="stacked"|"inline"`.
- **TopNav:** `@/components/layout/TopNav` — `user`, `onLogout`, `title`, `showBack`, `onBack`.
- **AnimatedBackground:** `@/components/layout/AnimatedBackground` — full-screen animated gradient orbs.
- **PageTransition:** `@/components/layout/PageTransition` — Framer Motion wrapper for page enter/exit. Use with `AnimatePresence` and a stable `key` per view.

---

## Accessibility

- Skip link: “Skip to main content” targets `#main-content` (each main view exposes this id).
- Buttons and icon-only controls use `aria-label` or visible text.
- Inputs use `Label` with `htmlFor` / `id`; error state uses `aria-invalid` and optional `aria-describedby`.
- Focus visible: `focus-visible:ring-2` and `ring-offset-background` for keyboard focus.
- Theme transition: `html` transitions `background-color` and `color` over 300ms.

---

## Responsive

- **Containers:** `tablet-container` (max-width 720px @ md, 900px @ lg). Use `max-w-[...] mx-auto` where needed.
- **Breakpoints:** Tailwind defaults (`sm`, `md`, `lg`, `xl`). Use `md:` and `lg:` for tablet/desktop.
- **Touch:** Buttons and inputs use min heights (e.g. `h-11`, `h-12`) for tap targets on mobile.

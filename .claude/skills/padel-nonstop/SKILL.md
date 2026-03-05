---
name: padel-nonstop
description: Master reference for building Padel Nonstop — a two-sided SaaS platform for the padel market. Use this skill for any task related to this project: schema design, back office dashboard, mobile app, auth flows, RLS policies, or any feature work. Trigger whenever the user mentions padel, nonstop, club manager, player app, or any component of this product.
---

# Padel Nonstop — Claude Code Master Reference

> Read this file before writing any code. It is the single source of truth for product decisions, architecture, naming conventions, and build priorities.

---

## 1. What We're Building

A **two-sided SaaS platform** for the padel community:

- **Back Office** (Web): Club managers publish and manage nonstop sessions
- **Front Office** (Mobile): Players discover and pre-register for nonstop sessions

### The Format: What Is a Nonstop?

A nonstop (also called Americano or El Pozo) is a padel format where:
- Players play for ~2 hours on multiple courts
- Partners rotate every game or every set
- The session is social, not a tournament — the vibe is the product
- In Portugal, the dominant term is **"nonstop"** — this platform owns that word

### The Problem

Most clubs manage nonstops via **WhatsApp + Excel**. A coordinator posts a date in a group chat, collects names manually, and tracks registrations informally. This is fragile, unscalable, and invisible to the club owner.

**We are not replacing a competitor app. We are replacing a WhatsApp group.**

---

## 2. Business Context

| Metric | Target |
|--------|--------|
| Revenue goal | €200k/year |
| Model | SaaS subscription per club |
| Price | €75–100/month per club |
| Target clubs | ~200 clubs |
| Primary market | Portugal |
| Expansion path | Spain |
| Growth strategy | Direct outreach to club owners, not app store discovery |

**This is a focused, profitable SaaS — not a venture-scale platform.** Scope decisions must reflect this. Build what ~200 clubs need, not what 20,000 would.

---

## 3. Competitive Position

| Competitor | What They Do | Why We're Different |
|------------|-------------|---------------------|
| Americano Padel Manager | In-session rotation tool | No pre-registration, no club dashboard |
| PadelMix | In-session tool | Same — opened at the court, not before |
| Vamos Tamos | In-session tool | Same |
| Playtomic | Club booking, courts, leagues | Expensive for small clubs, no nonstop-specific flow, slow-moving |

**Our white space:** Publish sessions in advance + player pre-registration + club back office. Nobody owns this in Portugal.

---

## 4. Tech Stack

### Back Office (Web — Club Manager Dashboard)
- **Framework:** Next.js (App Router)
- **UI:** shadcn/ui + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime

### Front Office (Mobile — Player App)
- **Framework:** React Native + Expo
- **UI:** Gluestack UI + NativeWind
- **Database:** Supabase (same instance)
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime

### Shared
- All data flows through Supabase
- RLS policies enforce role-based access at the database level
- Two actor types: `club_manager` and `player`

---

## 5. UI — Design System & Mockups

### Mockups Are the Primary Source of Truth

> **The `/UI-reference` folder at the project root is the single source of truth for all visual decisions.**
> Before building any screen, page, or component, open the relevant mockup first.
> **Mockup > this document > assumption. If they conflict on a visual matter, the mockup wins.**

Expected folder structure:

```
/UI-reference/
  back-office/
    login.png              — Auth page
    dashboard.png          — Dashboard overview
    nonstop-list.png       — Nonstops table + filters
    nonstop-create.png     — Create/edit form
    nonstop-detail.png     — Detail view with registrations + waitlist
    club-settings.png      — Club profile settings
  mobile/
    discover.png           — Home/discover feed
    nonstop-detail.png     — Detail screen + all CTA states
    my-registrations.png   — Player's registrations list
    profile.png            — Profile screen
```

**Workflow before building any screen:**

1. Open the matching file(s) in `/UI-reference/`
2. Extract: layout, spacing rhythm, type scale, colours, component shapes, icon style, border radii
3. Implement to match the mockup as closely as possible using shadcn/ui + Tailwind
4. If a mockup shows a pattern with no matching shadcn component, build it with Tailwind — do not install a new library
5. If no mockup exists for a state (empty, loading, error), apply the design language from the closest existing mockup and ask before deviating significantly

### Design Token Setup

On first setup, extract colours, radius, and font choices from the mockups and write them as CSS variables in `globals.css`. Do **not** hardcode hex values in components — always use CSS variables via Tailwind (`text-primary`, `bg-muted`, etc.).

```css
/* globals.css — populate from mockup inspection */
:root {
  --background: /* from mockup */;
  --foreground: /* from mockup */;
  --primary: /* brand colour from mockup */;
  --primary-foreground: /* contrast colour */;
  --muted: /* from mockup */;
  --muted-foreground: /* from mockup */;
  --border: /* from mockup */;
  --radius: /* from mockup */rem;
  /* status colours — extract from mockup badge colours */
  --status-draft: /* hsl */;
  --status-published: /* hsl */;
  --status-full: /* hsl */;
  --status-cancelled: /* hsl */;
  --status-completed: /* hsl */;
}
```

### shadcn/ui — Component Library

shadcn/ui is the **only** component library for the back office. Do not install MUI, Chakra, Ant Design, or any other library. Tailwind handles all utility styling.

```bash
npx shadcn@latest init
# When prompted: match style/base colour to mockups, enable CSS variables

npx shadcn@latest add button card table badge dialog form input label \
  select textarea sonner skeleton avatar separator popover calendar
```

Only install components you are actually using.

**Allowed components:**

| Component | Used For |
|-----------|----------|
| `Button` | All actions. Variants: `default`, `destructive`, `outline`, `ghost`, `link` |
| `Card`, `CardHeader`, `CardContent`, `CardFooter` | Stat cards, nonstop cards, settings panels |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` | Nonstop list, registrations list |
| `Badge` | Nonstop status, spot availability |
| `Dialog`, `DialogTrigger`, `DialogContent` | Destructive action confirmations |
| `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` | All forms — pair with React Hook Form |
| `Input` | Text inputs |
| `Textarea` | Nonstop description |
| `Select` | Status filter, courts picker |
| `Skeleton` | Loading states — never a spinner for content areas |
| `Avatar`, `AvatarImage`, `AvatarFallback` | Player lists |
| `Separator` | Section dividers |
| `Sonner` | Toasts for all async feedback |
| `Popover` + `Calendar` | Date picker |

### Engineering Conventions (independent of mockup visuals)

| Rule | Detail |
|------|--------|
| **Forms** | React Hook Form + Zod + shadcn `Form`. Never raw `<input>` |
| **Destructive actions** | Always require a `Dialog` confirmation before executing |
| **Async feedback** | `toast` from Sonner only — never `alert()` |
| **Loading states** | `Skeleton` only — never a spinner for content areas |
| **Empty states** | Every list/table needs one — style to match mockup language |
| **Icons** | `lucide-react` exclusively — ships with shadcn/ui |
| **Status badges** | `Badge` with `variant="outline"` — colours extracted from mockups |

### Key Code Patterns

**Confirmation dialog (destructive actions):**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive" size="sm">Cancel Nonstop</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Cancel this nonstop?</DialogTitle>
      <DialogDescription>
        All {registrationCount} registered players will be notified. This cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Keep it</Button>
      </DialogClose>
      <Button variant="destructive" onClick={handleCancel}>Yes, cancel</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Form (React Hook Form + Zod):**
```tsx
const form = useForm<NonstopFormValues>({
  resolver: zodResolver(nonstopSchema),
  defaultValues: { title: '', courts: 2 },
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl><Input placeholder="Saturday Nonstop" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

**Toasts:**
```tsx
toast.success('Nonstop published')
toast.error('Failed to publish — please try again')
toast.loading('Publishing...')
// Place <Toaster /> in root layout
```

---

## 6. Build Order (Non-Negotiable)

```
Phase 1: Supabase Schema
  → Tables, RLS policies, indexes, seed data

Phase 2: Back Office (Next.js)
  → Club manager dashboard validates the data model

Phase 3: Front Office (React Native + Expo)
  → Mobile app consumes the stable API and data model
```

Never start Phase 2 before Phase 1 is solid. Never start Phase 3 before Phase 2 is working end-to-end.

---

## 7. Supabase Schema

### Tables

#### `clubs`
```sql
id            uuid primary key default gen_random_uuid()
name          text not null
slug          text unique not null
logo_url      text
address       text
city          text
country       text default 'PT'
phone         text
email         text
created_at    timestamptz default now()
```

#### `profiles`
```sql
id            uuid primary key references auth.users(id)
role          text not null check (role in ('club_manager', 'player'))
full_name     text
avatar_url    text
phone         text
club_id       uuid references clubs(id)
created_at    timestamptz default now()
```

#### `nonstops`
```sql
id              uuid primary key default gen_random_uuid()
club_id         uuid not null references clubs(id)
title           text not null
description     text
date            date not null
start_time      time not null
end_time        time not null
courts          int not null default 2
max_players     int not null
price_cents     int not null default 0
status          text not null default 'draft'
                check (status in ('draft', 'published', 'full', 'cancelled', 'completed'))
created_at      timestamptz default now()
updated_at      timestamptz default now()
```

#### `registrations`
```sql
id              uuid primary key default gen_random_uuid()
nonstop_id      uuid not null references nonstops(id) on delete cascade
player_id       uuid not null references profiles(id)
status          text not null default 'confirmed'
                check (status in ('confirmed', 'waitlisted', 'cancelled'))
registered_at   timestamptz default now()
unique(nonstop_id, player_id)
```

#### `waitlist`
```sql
id              uuid primary key default gen_random_uuid()
nonstop_id      uuid not null references nonstops(id) on delete cascade
player_id       uuid not null references profiles(id)
position        int not null
created_at      timestamptz default now()
unique(nonstop_id, player_id)
```

### Key Business Rules (Enforce in DB + App)

1. `max_players` = `courts * 4` (standard padel court = 4 players)
2. When a registration is cancelled, the first waitlisted player is automatically promoted
3. A nonstop can only be published if `status = 'draft'` and courts >= 1
4. Players cannot register for cancelled or completed nonstops
5. A club manager can only manage nonstops belonging to their `club_id`

### RLS Policies

```sql
-- clubs: readable by all authenticated users, writable only by their manager
-- nonstops: published readable by all; draft readable only by club manager
-- registrations: club manager sees all for their club; player sees their own
-- profiles: users can read/update their own profile only
```

Write explicit RLS for every table. Never rely on application-level access control alone.

### Indexes
```sql
create index on nonstops(club_id, date);
create index on nonstops(status, date);
create index on registrations(nonstop_id);
create index on registrations(player_id);
```

---

## 8. Back Office — Club Manager Dashboard

> For all visual decisions, open `/UI-reference/back-office/` before writing any component.

### Auth Flow
1. Manager lands on `/login`
2. Signs in via Supabase Auth (email + password, or magic link)
3. On success, redirected to `/dashboard`
4. Middleware checks `role = 'club_manager'`; redirects players back to `/login`

### Pages & Routes

```
/login                  — Auth page
/dashboard              — Overview: stats + upcoming nonstops
/nonstops               — List, filterable by status
/nonstops/new           — Create form
/nonstops/[id]          — Detail: registrations, waitlist, actions
/nonstops/[id]/edit     — Edit form
/club/settings          — Club profile
```

### Dashboard (`/dashboard`)
- Stat cards: upcoming sessions, registered players this week, open spots
- List of next 3 nonstops with status badges
- Prominent "Create Nonstop" CTA

### Nonstop List (`/nonstops`)
- Table: title, date, status badge, registered/max, action buttons
- Filter by status
- Inline publish/cancel actions

### Create / Edit Form
Fields: title, date, start time, end time, courts (number), max players (auto = courts × 4, overridable), price (€), description, status toggle.
Validation: end > start, courts ≥ 1, date in future.

### Nonstop Detail (`/nonstops/[id]`)
- Header: title, date, status badge, publish/cancel/edit actions
- Registered players list: avatar, name, registered at, "Remove" action
- Waitlist section: same format + position number
- Spot counter with visual progress bar
- Realtime updates via Supabase Realtime on `registrations`

---

## 9. Front Office — Player Mobile App

> For all visual decisions, open `/UI-reference/mobile/` before writing any screen.

### Auth Flow
1. Splash screen → "Get Started"
2. Sign up: name, email, password (or magic link)
3. Profile created with `role = 'player'`
4. Lands on discover feed

### Screens

```
(Tab) Discover          — Browse upcoming published nonstops
(Tab) My Registrations  — Player's own upcoming + past
(Tab) Profile           — Name, avatar, phone, settings

Nonstop Detail          — Full info + register/cancel CTA
Club Profile            — Club info + their upcoming nonstops
```

### Discover Feed
- Sorted by date ascending, published nonstops only
- Card: club logo + name, date/time, courts, spots remaining, price
- Filter by date range, search by club name

### Nonstop Detail Screen
- Full details + spot counter (realtime)
- CTA states:
  - "Register" — spots available, not registered
  - "Join Waitlist" — full, not on waitlist
  - "You're registered ✓" — registered, tap to cancel
  - "On waitlist — position #N" — on waitlist, tap to leave
  - "Registration closed" — cancelled or completed
- Confirmation bottom sheet before registering

### Realtime
- Spot counter updates live on detail screen
- My Registrations updates on waitlist promotion

---

## 10. Core User Flows

### Club Manager: Publish a Nonstop
```
Create (draft) → Fill details → Save → Publish → Live
```

### Player: Register
```
Browse → Tap nonstop → View details → Register → Confirm → Registered
```

### Player: Join Waitlist
```
Browse → Nonstop full → Join Waitlist → Confirm → Waitlisted #N
```

### Waitlist Promotion (Automatic)
```
Player cancels → DB trigger promotes waitlist[0] → Player notified
```

### Club Manager: Cancel
```
Detail page → Cancel → Confirm dialog → Cancelled → Players notified
```

---

## 11. Key Engineering Principles

### Naming
- Always: **"nonstop"** (lowercase, one word) in code, routes, variables, copy
- Never: "americano", "el pozo", "session", "event"
- Table: `nonstops` · Route: `/nonstops` · Component: `<NonstopCard />`

### Supabase Patterns
- Always use typed client — generate with `supabase gen types typescript`
- Use joined queries (`select('*, clubs(*)')`) — avoid N+1
- Subscribe to realtime on detail views only, not list views
- Use `supabase.rpc()` for complex operations (cancel + notify atomically)

### Error Handling
- Handle `error` object on every Supabase call explicitly
- Show user-facing toast for errors; log full error to console
- Never swallow errors silently

### State Management
- Back office: React Server Components where possible; `useState`/`useReducer` for forms
- Mobile: TanStack Query for server state + Zustand for auth state

### Forms
- Both platforms: React Hook Form + Zod
- Never uncontrolled forms

### Performance
- Paginate lists (20 per page)
- Optimistic updates for registration actions, rollback on error
- Club logos via Supabase Storage with image transform for resizing

---

## 12. What NOT to Build (Yet)

- ❌ In-session rotation management
- ❌ Payment processing (Phase 2)
- ❌ Push notifications
- ❌ Multi-club management per manager
- ❌ Public club landing pages / SEO
- ❌ Social features (leaderboards, ratings)
- ❌ Spain localisation

When in doubt: "Does this help a club replace their WhatsApp group?" If no, defer it.

---

## 13. Folder Structure

### Back Office (Next.js)
```
UI-reference/                    ← mockups live here, read before building
app/
  (auth)/login/page.tsx
  (dashboard)/
    layout.tsx
    dashboard/page.tsx
    nonstops/
      page.tsx
      new/page.tsx
      [id]/page.tsx
      [id]/edit/page.tsx
    club/settings/page.tsx
components/
  nonstops/
    NonstopCard.tsx
    NonstopForm.tsx
    NonstopStatusBadge.tsx
    RegistrationList.tsx
    WaitlistList.tsx
  ui/                            ← shadcn/ui auto-generated
lib/
  supabase/
    client.ts
    server.ts
    types.ts                     ← generated DB types
  validations/
    nonstop.ts                   ← Zod schemas
```

### Mobile (Expo)
```
app/
  (auth)/
    index.tsx
    login.tsx
    signup.tsx
  (tabs)/
    index.tsx
    my-registrations.tsx
    profile.tsx
  nonstop/[id].tsx
  club/[id].tsx
components/
  NonstopCard.tsx
  SpotCounter.tsx
  RegisterButton.tsx
lib/
  supabase.ts
  queryClient.ts
stores/
  authStore.ts
```

---

## 14. Definition of Done (Per Phase)

### Phase 1: Supabase Schema
- All tables with correct types and constraints
- RLS policies written and tested
- Seed data: 1 club, 1 manager, 3 nonstops (draft/published/full), 10 players
- Types generated: `supabase gen types typescript --local > lib/supabase/types.ts`

### Phase 2: Back Office
- Manager can log in, see dashboard
- Manager can create, edit, publish, cancel a nonstop
- Manager can see registrations and waitlist in realtime
- Manager can remove a player
- All forms validate with Zod
- UI matches `/UI-reference/back-office/` mockups
- Empty states and loading states everywhere

### Phase 3: Mobile App
- Player can sign up, log in
- Player can browse nonstops, register, join waitlist, cancel
- Spot counter updates in realtime
- My Registrations tab works
- UI matches `/UI-reference/mobile/` mockups

---

## 15. Working Principles for Claude Code

1. **Read this file first** — understand the domain before writing any code
2. **Open the mockup first** — check `/UI-reference/` before building any UI
3. **Follow the build order** — Phase 1 → 2 → 3, no skipping
4. **Use exact naming** — `nonstop` everywhere, no synonyms
5. **RLS first** — write and test policies before building UI that depends on them
6. **Type everything** — Supabase types generated, Zod schemas, no `any`
7. **Ask before new dependencies** — the stack is fixed
8. **One feature at a time** — finish it before starting the next
9. **Defer scope** — if it's not in this document, ask before building it
10. **Mockup wins** — on any visual conflict between this doc and a mockup, follow the mockup
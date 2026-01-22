# DMS Frontend

Monolithic-but-modular React app using Vite, React Router, Tailwind, and Context for shared state.

## Architecture

- `src/app` – app shell concerns (layout, providers).
- `src/pages` – route-level screens.
- `src/features/*` – domain modules owning UI + data hooks.
- `src/components/ui` – reusable UI primitives (buttons, shells, cards).
- `src/hooks` – cross-cutting hooks (add as needed).
- `src/lib` – cross-cutting utilities (`apiClient`, `constants`, etc.).
- `src/assets` – static assets.

```
src/
  app/
    layouts/AppLayout.jsx        # Shell with header + nav
    providers/AppProvider.jsx    # Global context (theme/user)
  pages/
    HomePage.jsx
    InvoicesPage.jsx
    SettingsPage.jsx
    NotFoundPage.jsx
  features/
    invoices/components/InvoiceSummary.jsx
    settings/components/ThemeToggle.jsx
  components/
    ui/Button.jsx
    ui/Card.jsx
    ui/AppShell.jsx
  hooks/
  lib/
    apiClient.js
    constants.js
```

## Routing

- React Router is configured in `src/App.jsx`.
- Routes render inside `AppLayout` with shared header/nav.
- Add new pages under `src/pages` and register them in the router.

## State and theming

- `AppProvider` supplies global context (theme, user placeholder).
- `useAppContext` exposes `theme`, `toggleTheme`, and `user`.
- Theme toggles `dark` class on the document root for Tailwind tokens.

## Feature modules

- Co-locate UI, hooks, and services inside `src/features/<domain>/`.
- Pages should import from their feature module instead of reaching across domains.
- When data fetching is added, keep API calls and mutations inside the feature.

## Shared UI

- Use primitives from `src/components/ui` for consistent styling.
- Extend with additional primitives (e.g., `Input`, `Badge`) as needs appear.

## Lib and utilities

- `lib/apiClient.js` centralizes Axios config and error normalization.
- `lib/constants.js` holds shared constants (app name, nav).

## Adding a new feature

1. Create a feature folder under `src/features/<domain>/`.
2. Add UI pieces and hooks inside the feature.
3. Create a page in `src/pages` and wire it into the router.
4. Reuse shared UI primitives to keep styling consistent.

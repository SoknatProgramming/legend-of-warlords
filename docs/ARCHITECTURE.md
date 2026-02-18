# Architecture — MVC-style Next.js + smooth UX

This app uses **state management**, **Tailwind CSS**, **route hooks**, **Framer Motion**, and **secure server-side auth** in an MVC-style structure.

## Stack

| Layer | Tech | Purpose |
|-------|------|---------|
| **State** | Zustand | Client auth state (optional sync with server); persisted to `localStorage`. |
| **Styles** | Tailwind CSS v4 | Utility-first styling; design tokens in `app/globals.css`. |
| **Routes** | Next.js App Router + `useAppRoute` | Central routes in `app/lib/constants/routes.ts`; hook for pathname, `isLogin`, `isRegister`, etc. |
| **Transitions** | Framer Motion | `RouteTransitionWrapper` in `GameLayout` for smooth page changes. |
| **Auth** | Server Actions + iron-session | Validation and secrets on server; encrypted `low_session` cookie. |
| **Protection** | Middleware | Redirects unauthenticated users from `/dashboard`; redirects logged-in users from `/login` and `/register`. |

## MVC-style layout

- **Models / data**
  - `app/lib/types/auth.ts` — User, SessionUser, credentials, result types.
  - `app/lib/constants/routes.ts` — Route paths and helpers (`isAuthRoute`, `isPublicRoute`).
  - `app/lib/session.ts` — Session config and `getSession()` (iron-session).
  - `app/lib/store/` — Zustand stores (e.g. `useAuthStore`).

- **Views**
  - `app/**/page.tsx` — Route UI.
  - `app/components/` — Reusable UI (header, auth cards, layout, snowfall).

- **Controllers**
  - `app/actions/auth.ts` — Server Actions: `loginAction`, `registerAction`, `logoutAction`, `getCurrentUser`. All validation and session handling on the server.
  - `middleware.ts` — Route protection and redirects (cookie check only; full validation in layouts/actions).

## Security

- **Secrets**: Only in server env (e.g. `SESSION_SECRET`). Never in `NEXT_PUBLIC_*` or client code.
- **Auth**: Passwords and tokens stay in Server Actions; session is httpOnly, encrypted cookie.
- **Validation**: Email/password and business rules are enforced in `app/actions/auth.ts`, not only on the client.

## Key files

- **Hooks**: `app/lib/hooks/useAppRoute.ts` — pathname, `isHome`, `isLogin`, `isRegister`, `routes`.
- **Store**: `app/lib/store/useAuthStore.ts` — user, `isAuthenticated`, `setUser`, `logout`; optional client-side mirror of session.
- **Transitions**: `app/components/RouteTransitionWrapper.tsx` — Framer Motion `AnimatePresence` + pathname key so route changes animate.
- **Hydration**: `app/components/StoreHydration.tsx` — marks Zustand as hydrated after mount to avoid auth flash.

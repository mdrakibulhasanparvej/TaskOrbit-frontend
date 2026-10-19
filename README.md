# TaskOrbit

TaskOrbit is a modern, role-based project management platform designed for teams to organize projects, track tasks, manage workflows, and collaborate seamlessly. This repository contains the Next.js frontend; the backend is powered by `taskorbit-backend`, accessed through typed API functions.

## What the system does

The application provides account access and project management workflows for four roles:

- **Admin** manages platform-wide oversight, platform settings, users, projects, payments, and system reports.
- **Project Manager** creates and manages projects, invites team members, plans project tasks, and tracks progress on Kanban boards.
- **Team Member** tracks assigned tasks, updates task progress, collaborates via task comments and attachments, and receives real-time notifications.
- **Client** owns the billing relationship — subscribing to a plan through Stripe checkout, reviewing payment history, and contacting support — with no access to projects or tasks.

Users can register, verify their email, sign in with credentials, or start Google OAuth. Route guards protect dashboard routes and restrict each dashboard to its authorized role.

## Main routes

| Route | Purpose |
| --- | --- |
| `/login`, `/registration` | Sign in and create an account |
| `/forgot-password`, `/reset-password` | Password recovery with OTP |
| `/oauth-progress` | Verify the session after Google OAuth and route to the user's dashboard |
| `/admin/*` | Platform administration, users, projects, payments, settings |
| `/project-manager/*` | Project management, task planning, team invitations |
| `/team-member/*` | My tasks, task details, status updates, notifications |
| `/client/*` | Subscription, payment history, contact support, notifications |
| `/pricing` | Public subscription plans and Stripe checkout |
| `/contact` | Public contact inquiry form |
| `/payment/success`, `/payment/cancel` | Stripe checkout return pages |
| `/privacy-policy`, `/terms-of-service` | Public legal-information pages |

## Tech stack

- Next.js App Router and React
- TypeScript with strict checking
- Tailwind CSS v4, shadcn-style UI primitives, and Base UI
- TanStack Query for server state and cache management
- TanStack Form and Zod for forms and validation
- Recharts for dashboard analytics and visualizations
- Biome for formatting and lint checks
- `ofetch` for HTTP requests

## Getting started

Use a supported Node.js LTS release and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root and set the public API base URL pointing to `taskorbit-backend`:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
   ```

   The URL should point to the `taskorbit-backend` API root that exposes `/auth`, `/users`, `/projects`, `/tasks`, `/comments`, `/attachments`, `/notifications`, `/payments`, `/contact`, and `/reports` endpoints. Do not commit `.env.local` or credentials.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Next.js (normally `http://localhost:3000`).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve a production build |
| `npm run lint` | Run `biome check` |
| `npm run format` | Format supported project files with Biome |

## Application architecture

### Routes and layouts

`src/app` contains the App Router pages and layouts. Route groups organize authentication and dashboard UI without adding URL segments. The root layout configures the global styles, theme, React Query and tooltip providers, and toast notifications. Dashboard routes use an authentication guard, then each role's layout uses a role guard and the shared dashboard shell/sidebar.

Role-specific sidebar navigation is described in `src/routes`. The API-facing UI is organized into feature modules under `src/components/modules`, while reusable controls are in `src/components/ui` and `src/components/shared`.

### Data and API flow

Feature functions in `src/api` make typed requests through the shared `src/lib/ofetch.ts` client. The client includes browser credentials so cookie-based sessions can be sent. Query hooks in `src/hooks` wrap these functions with TanStack Query, manage cache keys, and invalidate dependent data after mutations. Shared response and domain types live in `src/types`; form schemas are in `src/schemas`.

### Authentication

Credential sign-in and registration use the `/auth` API functions; email verification is handled through a verification code flow. Google OAuth begins with a browser redirect to the backend. After the provider callback, `/oauth-progress` requests the signed-in profile and redirects to the workspace associated with the role. The backend sets an httpOnly session cookie that is accepted by the browser and sent with credentialed API calls.

### Payments

Clients subscribe to PRO or BUSINESS plans via Stripe checkout. The backend creates the Stripe checkout session and returns its URL; the browser redirects to Stripe. Stripe returns the user to the public success or cancel route where payment verification is handled. Signed-in clients manage their plan at `/client/subscription` and review charges at `/client/payment-history`; admins keep read-only oversight of every payment at `/admin/payments`.
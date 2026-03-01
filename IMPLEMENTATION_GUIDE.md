# Campaign Database Implementation Guide

## Overview

This is the "Honlly Isaac NGE 2027 – Morobe Regional Campaign Database" - a secure, role-based campaign management system built with Next.js 14, TypeScript, TailwindCSS, and Supabase.

## Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.example .env.local
```

Add:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (server-side only)

### 2. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `lib/schema.sql` in the SQL editor
3. Enable Row Level Security (RLS) policies as defined in the schema

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Architecture

### Authentication Flow

1. User logs in via `/login`
2. Credentials verified against Supabase Auth
3. User role stored in cookies
4. Middleware (`middleware.ts`) protects routes based on role
5. All API calls include auth token

### Role-Based Access Control

**Admin:**
- Full CRUD on all resources
- Can delete any record
- Can manage users and settings
- Access to all pages

**Campaign Manager:**
- Can view all data
- Can create and edit supporters, events, wards
- Can view agents and reports
- Cannot delete records
- Cannot manage users

**Agent:**
- Can create supporters (auto-assigned as registered_by)
- Can only edit/view their own registered supporters
- Can view LLGs and wards for reference
- Cannot delete anything
- Cannot access settings/admin pages

### Database Security

- Row Level Security (RLS) enabled on all tables
- Agents can only SELECT supporters where `registered_by = auth.uid()`
- Only admins can delete records
- Service role key kept secret (server-side only)
- All operations logged in audit_logs table

## Project Structure

```
/app                    # Next.js App Router pages
  /login               # Authentication page
  /dashboard           # Main dashboard with charts
  /supporters          # Supporter CRUD pages
    /new              # Create new supporter form
    /[id]             # Edit/view supporter
  /agents              # View campaign agents
  /wards               # Ward management
  /llgs                # LLG (Local Level Government) management
  /events              # Campaign events
  /api                 # API routes (to be created)

/components            # Reusable React components
  /layout.tsx         # Sidebar and main layout
  /ui.tsx             # UI components (cards, buttons, forms)

/lib                   # Utility functions and configuration
  /supabase.ts        # Supabase client setup
  /auth.ts            # RBAC helper functions
  /schema.sql         # Database schema

/types               # TypeScript interfaces
  /index.ts          # App-wide type definitions

/middleware.ts       # Next.js middleware for route protection

/styles             # Global styles
  /globals.css      # TailwindCSS globals
```

## Key Components

### Supabase Client (`lib/supabase.ts`)

```typescript
// Client-side (browser)
import { getSupabaseClient } from '@/lib/supabase'
const supabase = getSupabaseClient()

// Server-side (Node.js)
import { createServerSupabaseClient } from '@/lib/supabase'
const supabase = createServerSupabaseClient()
```

### Authentication Utilities (`lib/auth.ts`)

```typescript
import { hasPermission, canManageSupporter } from '@/lib/auth'

// Check if user can perform action
if (hasPermission(userRole, 'delete', 'supporters')) {
  // Allow delete
}

// Check if agent can manage specific supporter
if (canManageSupporter(userRole, supporterRegisteredBy, currentUserId)) {
  // Allow edit
}
```

### UI Components (`components/ui.tsx`)

- `Card`: Container component
- `StatCard`: Dashboard statistics card
- `Button`: Reusable button with variants
- `Modal`: Delete confirmation modal
- `FormInput`: Text input with validation
- `FormSelect`: Dropdown select field

### Layout (`components/layout.tsx`)

- `Sidebar`: Navigation sidebar with responsive mobile support
- `AppLayout`: Main layout wrapper with sidebar

## API Routes (To Be Created)

Create these endpoints in `/app/api/`:

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Supporters
- `GET /api/supporters` - List supporters (with filters)
- `POST /api/supporters` - Create supporter
- `GET /api/supporters/[id]` - Get supporter details
- `PUT /api/supporters/[id]` - Update supporter
- `DELETE /api/supporters/[id]` - Delete supporter (admin only)

### Other Resources
- Similar endpoints for agents, wards, llgs, events

## Form Handling

### Client-Side Forms

All forms use basic HTML form submission:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
}
```

### Server-Side Validation

Create server actions or API routes to validate data before saving:

```typescript
// Validate email format
// Check for duplicates
// Verify required fields
// Check user permissions
```

## Security Best Practices

1. **Never expose service_role_key in client code**
   - Keep in `.env.local` for server-side use only

2. **Always validate input server-side**
   - Don't trust client validation alone

3. **Use Row Level Security**
   - Database enforces access control
   - Agents can't query other agents' data

4. **Log all modifications**
   - Insert into audit_logs table on every create/update/delete

5. **Protect sensitive pages with middleware**
   - Check auth token
   - Verify user role for page access

6. **Use HTTPS in production**
   - Never send credentials over HTTP

## Styling

The app uses TailwindCSS with a dark Navy and Gold theme:

- **Background**: Navy-900 (very dark)
- **Cards**: Navy-700 (dark)
- **Accent**: Gold-500 (bright gold for highlights)
- **Text**: White on dark, Gray-400 for secondary text

Custom components in `styles/globals.css`:
- `.btn-primary` - Gold button
- `.btn-secondary` - Navy button
- `.input-field` - Form input styling
- `.card` - Card container

## Charts (Recharts)

The dashboard uses Recharts for visualizations:
- **Pie Charts**: Support level and gender distribution
- **Bar Charts**: Supporters by LLG
- Responsive and interactive

## Common Tasks

### Add a New Role

1. Add to `types/index.ts` UserRole type
2. Add to `lib/auth.ts` permissions object
3. Add to `middleware.ts` ROLE_ROUTES
4. Update RLS policies in schema.sql

### Create New Data Page

1. Create page in `/app/[resource]/page.tsx`
2. Wrap with `<AppLayout title="...">`
3. Create API route in `/app/api/[resource]/`
4. Fetch data on page load
5. Handle form submission to API

### Add Authentication

1. Create login form (already done)
2. Create API endpoint to verify credentials
3. Set auth cookies with user data
4. Redirect to dashboard on success
5. Middleware will protect routes

## IMPORTANT: Before Launch

1. [ ] Set up Supabase project and database
2. [ ] Run SQL schema in Supabase SQL editor
3. [ ] Configure environment variables (.env.local)
4. [ ] Implement all API routes
5. [ ] Add proper error handling
6. [ ] Test RLS policies
7. [ ] Enable HTTPS
8. [ ] Set up CI/CD pipeline
9. [ ] Add proper logging and monitoring
10. [ ] Security audit
11. [ ] Load testing
12. [ ] Deploy to production

## Deployment

### Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with `vercel` command

### Other Platforms

- Ensure Node.js 18+ is available
- Set environment variables
- Run `npm run build` then `npm start`

## Support and Documentation

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org)

## License

Private - Internal use only for Honlly Isaac NGE 2027 Campaign

## Notes

This is a skeleton implementation. Key areas that still need development:

1. **API Route Handlers** - Create endpoints in `/app/api/`
2. **Error Handling** - Add proper try/catch and user feedback
3. **Data Persistence** - Connect all pages to Supabase queries
4. **Authentication** - Implement Supabase Auth client library
5. **Notifications** - Add toast messages for user feedback
6. **Form Validation** - Add client-side validation libraries
7. **Testing** - Add Jest tests for components and logic
8. **Performance** - Optimize images, implement caching

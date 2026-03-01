# Honlly Isaac NGE 2027 – Morobe Regional Campaign Database

A secure, role-based political campaign management system built with **Next.js 14**, **TypeScript**, **TailwindCSS**, and **Supabase PostgreSQL**.

## Features

✅ **Secure Authentication**
- Supabase Auth integration
- Role-based access control (Admin, Campaign Manager, Agent)
- Middleware-protected routes
- Session management

✅ **Dashboard Analytics**
- Real-time statistics cards
- Support level distribution (Pie chart)
- Supporters by LLG (Bar chart)
- Gender distribution (Pie chart)
- Recent activity feed

✅ **Supporter Management**
- Create, read, update supporter records
- Role-based visibility (agents see only their own records)
- Filter by support level, gender, location
- Phone, occupation, and support notes
- Automatic agent assignment

✅ **Administration**
- Ward management
- Local Level Government (LLG) management
- Campaign agent tracking
- Event management with attendance
- Comprehensive audit logging

✅ **Data Security**
- PostgreSQL Row Level Security (RLS)
- Server-side validation
- Environment variable protection
- Secure API routes
- Audit trail for all modifications

✅ **Responsive Design**
- Mobile-first interface
- Dark navy theme with gold accents
- TailwindCSS styling
- Sidebar navigation with mobile support
- Interactive charts with Recharts

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS with custom dark theme
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: Supabase Auth

## System Requirements

- Node.js 18+
- npm or yarn
- Supabase account

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd honz-webapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Setup Database

1. Create a Supabase project
2. Go to SQL Editor
3. Run the schema from `lib/schema.sql`
4. Verify RLS policies are enabled

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Role Structure & Permissions

### Admin
- ✅ Full CRUD access to all modules
- ✅ Can delete any record
- ✅ Can manage users and system settings
- ✅ Access to all pages and reports

### Campaign Manager
- ✅ View all supporters and data
- ✅ Create and edit supporters
- ✅ Create and manage events
- ✅ View agent performance
- ❌ Cannot delete records
- ❌ Cannot manage user accounts

### Agent
- ✅ Create new supporter records
- ✅ Edit their own registered supporters
- ✅ View their own supporter list
- ❌ Cannot delete any records
- ❌ Cannot access admin settings
- ❌ Cannot view other agents' supporters

## Database Schema

### Tables

#### users
- `id` (UUID) - Primary key
- `email` (TEXT, unique)
- `name` (TEXT)
- `role` (TEXT) - admin, campaign_manager, agent
- `created_at` (TIMESTAMP)

#### llgs (Local Level Governments)
- `id` (UUID) - Primary key
- `name` (TEXT)
- `district` (TEXT)

#### wards
- `id` (UUID) - Primary key
- `name` (TEXT)
- `llg_id` (UUID) - Foreign key to llgs

#### supporters
- `id` (UUID) - Primary key
- `full_name` (TEXT)
- `gender` (TEXT) - Male, Female, Other
- `phone` (TEXT)
- `occupation` (TEXT)
- `ward_id` (UUID) - Foreign key to wards
- `llg_id` (UUID) - Foreign key to llgs
- `support_level` (TEXT) - Strong, Leaning, Undecided, Opposition
- `registered_by` (UUID) - Foreign key to users (agent who registered)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)

#### events
- `id` (UUID) - Primary key
- `title` (TEXT)
- `location` (TEXT)
- `date` (DATE)
- `attendance` (INTEGER)
- `notes` (TEXT)

#### audit_logs
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `action` (TEXT) - create, update, delete
- `resource` (TEXT) - supporters, events, etc.
- `resource_id` (UUID)
- `details` (JSONB)
- `created_at` (TIMESTAMP)

## Row Level Security (RLS) Policies

### Supporters Table
- **Admin**: Can do anything
- **Campaign Manager**: Can read all, create, update
- **Agent**: Can read/create/update only their own (`registered_by = auth.uid()`)
- **Agents cannot delete**

### Events Table
- **Authenticated users**: Can read
- **Admin**: Can do everything

## Project Structure

```
honz-webapp/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home redirect
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard with analytics
│   ├── supporters/
│   │   ├── page.tsx            # Supporters list
│   │   ├── new/
│   │   │   └── page.tsx        # Create supporter form
│   │   └── [id]/
│   │       └── page.tsx        # Edit/view supporter
│   ├── agents/
│   │   └── page.tsx            # Agents list
│   ├── wards/
│   │   └── page.tsx            # Ward management
│   ├── llgs/
│   │   └── page.tsx            # LLG management
│   └── events/
│       └── page.tsx            # Events list
├── components/
│   ├── layout.tsx              # Sidebar & AppLayout
│   └── ui.tsx                  # Reusable UI components
├── lib/
│   ├── supabase.ts             # Supabase client setup
│   ├── auth.ts                 # RBAC helper functions
│   └── schema.sql              # Database schema
├── types/
│   └── index.ts                # TypeScript interfaces
├── styles/
│   └── globals.css             # Global styles
├── middleware.ts               # Route protection
├── tailwind.config.ts          # TailwindCSS config
├── tsconfig.json               # TypeScript config
└── IMPLEMENTATION_GUIDE.md     # Implementation details
```

## Component Examples

### Using the Layout

```tsx
import { AppLayout } from '@/components/layout'

export default function MyPage() {
  return (
    <AppLayout title="Page Title">
      <div>Page content here</div>
    </AppLayout>
  )
}
```

### Using UI Components

```tsx
import { Button, Card, FormInput, StatCard } from '@/components/ui'

<Card>
  <h2>My Card</h2>
  <p>Content here</p>
</Card>

<StatCard
  label="Total Supporters"
  value={1250}
  trend="8.5%"
  trendUp={true}
/>

<FormInput
  label="Name"
  placeholder="Enter name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

### RBAC in Components

```tsx
import { hasPermission, canManageSupporter } from '@/lib/auth'

// Check permission
if (hasPermission(userRole, 'delete', 'supporters')) {
  // Show delete button
}

// Check if agent can manage record
if (canManageSupporter(userRole, supporterRegisteredBy, userId)) {
  // Show edit button
}
```

## API Routes (To Implement)

Create these endpoints in `/app/api/`:

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/supporters
POST   /api/supporters
GET    /api/supporters/[id]
PUT    /api/supporters/[id]
DELETE /api/supporters/[id]   (admin only)

GET    /api/agents
GET    /api/events
POST   /api/events
```

## Security Best Practices

🔒 **Authentication**
- Use Supabase Auth for secure credential handling
- Store auth tokens in secure cookies
- Validate tokens on every request

🔒 **Authorization**
- Role-based access control via RLS
- Check permissions server-side
- Middleware validates route access

🔒 **Data Protection**
- All input validated server-side
- PostgreSQL RLS enforces data boundaries
- Service role key kept secret
- Environment variables for sensitive data

🔒 **Audit Trail**
- Log all create/update/delete actions
- Track user who made changes
- Store in audit_logs table
- Review regularly

## Development

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard.

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### "Supabase credentials missing"
→ Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### "RLS policy prevents access"
→ Verify the SQL schema ran successfully and policies are enabled

### "Middleware not protecting routes"
→ Check `middleware.ts` matcher config and auth token is being set

### Charts not rendering
→ Ensure Recharts is installed: `npm install recharts`

## Performance Tips

1. Use Server Components for data fetching
2. Implement pagination for large datasets
3. Cache static content
4. Optimize images
5. Use code splitting for routes

## Testing

Create tests in `__tests__` directory:

```bash
npm install --save-dev jest @testing-library/react
```

## Contributing

This is a private internal system. Changes should be reviewed and tested before deployment.

## License

**PRIVATE** - Internal use only for Honlly Isaac NGE 2027 Campaign

## Security Notice

⚠️ This system contains sensitive voter and campaign data. 
- All activity is logged
- Unauthorized access is prohibited
- Only authorized personnel may access
- Data breaches must be reported immediately

## Support

For issues or questions:
1. Check `IMPLEMENTATION_GUIDE.md`
2. Review database schema in `lib/schema.sql`
3. Check environment variables are set
4. Verify Supabase project is connected

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TailwindCSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

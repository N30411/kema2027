# Security & Deployment Guide

## 🔐 Security Best Practices

### 1. Environment Variables

**Never Commit Secrets**
```bash
# ✅ DO: Add to .gitignore
.env.local
.env.production.local

# ❌ DON'T: Commit these files
git add .env.local  # This will be ignored
```

**Secret Rotation**
```bash
# Periodically regenerate keys
# 1. In Supabase dashboard, generate new API keys
# 2. Update .env.local
# 3. Rolling deployment to avoid downtime
```

### 2. Supabase Security

**Service Role Key Protection**
```typescript
// ✅ Correct: Server-side only
export const createServerSupabaseClient = () => {
  // Can safely use service role key here
  return createClient(url, serviceRoleKey)
}

// ❌ Wrong: Never do this
const client = createClient(url, serviceRoleKey) // In browser!
```

**Row Level Security (RLS)**

Every table using sensitive data must have RLS enabled:

```sql
-- Agents can only see/edit their own records
CREATE POLICY "agent_read_own" ON supporters
  FOR SELECT
  USING (registered_by = auth.uid())
```

### 3. Input Validation

**Client-Side Validation**
```typescript
// Quick feedback for users
if (!email.includes('@')) {
  setError('Invalid email')
}
```

**Server-Side Validation (CRITICAL)**
```typescript
// API route - ALWAYS validate before database
if (!body.phone || typeof body.phone !== 'string') {
  return Response.json({ error: 'Invalid phone' }, { status: 400 })
}

// Database insert
await supabase.from('supporters').insert({ phone: body.phone })
```

### 4. SQL Injection Prevention

**✅ Safe: Using Supabase client library**
```typescript
const { data } = await supabase
  .from('supporters')
  .select()
  .eq('name', userInput)  // Parameterized
```

**❌ Dangerous: Raw SQL**
```typescript
// NEVER concat user input into SQL
const query = `SELECT * FROM supporters WHERE name = '${userInput}'`
```

### 5. Authentication

**Session Security**
```typescript
// Store auth token in httpOnly cookie
// Never expose in URL or localStorage
Set-Cookie: auth_token=...; HttpOnly; Secure; SameSite=Strict
```

**Role Verification**
```typescript
// Always verify role on server-side
const user = await supabase.auth.getUser()
const role = user?.user?.user_metadata?.role

if (role !== 'admin') {
  return Response.json({ error: 'Unauthorized' }, { status: 403 })
}
```

### 6. Data Protection

**Sensitive Fields**
```sql
-- Don't store passwords (use Supabase Auth)
-- Don't store raw phone numbers (hash if needed)
-- Encrypt sensitive personal data if required
```

**GDPR/Privacy Compliance**
```sql
-- Implement data deletion
DELETE FROM supporters WHERE registered_by = $1

-- Implement data export
SELECT * FROM supporters WHERE user_id = $1
```

### 7. Rate Limiting

**API Rate Limits**
```typescript
// Implement rate limiting on API routes
// Prevent brute force attacks on login
// Prevent spam of create/update endpoints

const rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
})

app.use('/api/', rateLimiter)
```

---

## 🚀 Deployment Guide

### 1. Pre-Deployment Checklist

**Code Quality**
- [ ] No console.log() statements left
- [ ] All TypeScript errors resolved
- [ ] No unused imports
- [ ] Error handling for all API calls
- [ ] Input validation on all endpoints

**Security**
- [ ] Service role key not exposed in code
- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] RLS policies tested
- [ ] Rate limiting implemented

**Database**
- [ ] Backups configured
- [ ] Indexes created for performance
- [ ] RLS policies enabled and tested
- [ ] Audit logging working
- [ ] Connection pool configured

**Testing**
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Authentication flow tested
- [ ] RLS policies tested with real users
- [ ] Cross-browser testing
- [ ] Mobile testing

### 2. Vercel Deployment

**Setup**
```bash
npm install -g vercel
vercel login
vercel
```

**Environment Variables in Vercel Dashboard**
```
NEXT_PUBLIC_SUPABASE_URL: https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJxxx...
SUPABASE_SERVICE_ROLE_KEY: eyJxxx...
```

**Deployment Options**
```bash
vercel                # Deploy to staging
vercel --prod         # Deploy to production
```

### 3. Production Supabase Setup

**Create Production Instance**
- Separate project from development
- Use different database credentials
- Enable automated backups
- Set up monitoring and alerts

**Database Backups**
```bash
# Automated daily backups in Supabase
# Manual backup before major changes
# Test restore procedures
```

**Monitoring**
```bash
# Monitor in Supabase dashboard
# Set up alerts for:
# - High error rates
# - Slow queries
# - Authentication failures
# - Unusual RLS rejections
```

### 4. CI/CD Pipeline

**GitHub Actions Example**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - run: npm test
      
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### 5. Post-Deployment

**Monitoring**
```bash
# Monitor in Vercel/hosting dashboard
# Monitor Supabase logs
# Check analytics
# Monitor error rates
```

**Rollback Plan**
```bash
# If critical issues:
vercel --prod --alias staging  # Deploy to staging
# Test thoroughly
vercel promote staging-url     # Promote to production

# Or rollback to previous version
vercel rollback
```

---

## 🔍 Security Headers

Add to `next.config.js`:

```typescript
const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=()'
  }
]

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

---

## 🚨 Incident Response

### If Compromised

1. **Immediately**
   ```bash
   # Regenerate API keys in Supabase
   # Deploy new keys to production
   # Review audit logs
   ```

2. **Within 24 hours**
   ```bash
   # Conduct security audit
   # Review all RLS policies
   # Check for unauthorized data access
   # Notify users if data was accessed
   ```

3. **Documentation**
   ```bash
   # Document what happened
   # Document root cause
   # Implement preventative measures
   ```

### Common Issues

**High Error Rate**
```bash
# Check error logs
# Check Supabase status
# Check database performance
# Rollback if needed
```

**Slow Performance**
```bash
# Add indexes to slow queries
# Optimize RLS policies
# Check connection pool
# Scale database if needed
```

**Authentication Failures**
```bash
# Check Supabase auth settings
# Verify JWT tokens are valid
# Check session expiration
# Clear browser cookies/cache
```

---

## 📊 Monitoring & Logging

### Error Tracking
```typescript
// Implement error tracking
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### Audit Logging
```sql
-- Log all modifications
INSERT INTO audit_logs (user_id, action, resource, details)
VALUES ($1, 'create', 'supporter', jsonb_build_object(...))
```

### Performance Monitoring
```typescript
// Track page load times
// Track API response times
// Track database query times
```

---

## 🔑 Key Security Reminders

1. **Never expose service role key** in client code
2. **Always validate input** server-side
3. **Enable RLS** on all sensitive tables
4. **Use HTTPS** in production
5. **Rotate secrets** regularly
6. **Backup data** regularly
7. **Monitor logs** continuously
8. **Handle errors** gracefully (don't expose internals)
9. **Test RLS policies** thoroughly
10. **Keep dependencies** updated

---

## Compliance

### Data Privacy
- ✅ GDPR compliant user data handling
- ✅ Right to deletion implemented
- ✅ Data export functionality
- ✅ Encryption for sensitive data

### Audit Trail
- ✅ All user actions logged
- ✅ Logs retained for 90 days minimum
- ✅ Admin access audited
- ✅ Failed login attempts logged

---

**Remember:** Security is everyone's responsibility. Review and update these practices regularly as threats evolve.

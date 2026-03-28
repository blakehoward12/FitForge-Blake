# FitForge — Production Readiness Checklist

## Status: MVP Live
- **URL**: https://fitforgelifts.co
- **Stack**: Next.js 16 + Turso (SQLite) + NextAuth v5 + Vercel
- **Auth**: Email/password + Google OAuth working
- **Database**: Turso with Drizzle ORM, schema deployed

---

## P0 — Must Have Before Launch

### Payments (Stripe)
- [ ] Install Stripe SDK, create products (Premium $20/mo)
- [ ] Add Stripe Checkout for Premium upgrade flow
- [ ] Webhook handler at `/api/webhooks/stripe` to update `users.isPremium`
- [ ] Gate multi-day plans (3/5/7 day) behind active subscription
- [ ] Customer portal link for managing/canceling subscription
- [ ] Add `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` env vars

### Auth Hardening
- [ ] Email verification on signup (send verification email before allowing full access)
- [ ] Forgot password / reset password flow
- [ ] Rate limiting on `/api/auth` routes (prevent brute force)
- [ ] CSRF protection (NextAuth handles most, verify config)

### Input Validation
- [ ] Add Zod schemas for all API route inputs
- [ ] Server-side validation on signup (email format, password strength)
- [ ] Sanitize all user-generated content (feed posts, names)
- [ ] Max length enforcement on all text fields

### Error Handling
- [ ] Global error boundary (`error.tsx` at app root)
- [ ] Toast notification system for user feedback
- [ ] Proper error states on all pages (not just blank screens)
- [ ] Loading states / skeletons for data fetching

---

## P1 — Should Have for Launch

### SEO & Meta
- [ ] Generate proper `robots.txt` and `sitemap.xml` (Next.js built-in)
- [ ] Dynamic OG images for shared workouts / profiles
- [ ] Canonical URLs on all pages
- [ ] Structured data (JSON-LD) for the landing page

### Security
- [ ] Move `TURSO_AUTH_TOKEN` to a rotated secret
- [ ] Add Content Security Policy headers
- [ ] Rate limiting on all API routes (not just auth)
- [ ] Audit for XSS in feed posts / user content

### Data Integrity
- [ ] Database indexes on frequently queried columns (userId, email, createdAt)
- [ ] Cascade deletes working correctly
- [ ] Backup strategy for Turso database

### User Experience
- [ ] Proper 404 page with FitForge branding
- [ ] Mobile responsiveness audit (all pages)
- [ ] Keyboard navigation / accessibility audit
- [ ] Loading indicators on form submissions

---

## P2 — Nice to Have

### Features
- [ ] Apple Sign-In (currently shows "coming soon")
- [ ] Profile photo uploads via Vercel Blob
- [ ] Workout sharing (public URLs for generated workouts)
- [ ] Feed: like/unlike toggle (currently only increments)
- [ ] Feed: delete own posts
- [ ] Achievements system (check conditions after workout completion)
- [ ] Workout history page (past completed sessions)
- [ ] Export workout as PDF

### Performance
- [ ] Vercel Analytics + Speed Insights integration
- [ ] Image optimization (next/image for any images)
- [ ] Font optimization (next/font instead of Google Fonts link)
- [ ] Bundle size audit

### Marketplace (Future)
- [ ] Creator onboarding flow
- [ ] PDF upload + AI formatting pipeline
- [ ] Stripe Connect for creator payouts (80/20 split)
- [ ] Marketplace browsing / search / purchase flow
- [ ] Creator dashboard (sales, analytics)

### Infrastructure
- [ ] Staging environment (preview branch)
- [ ] CI/CD pipeline (lint + type check on PR)
- [ ] Database migrations workflow (drizzle-kit generate + migrate)
- [ ] Monitoring / alerting (Vercel observability or Sentry)
- [ ] Custom domain email (noreply@fitforgelifts.co)

---

## Env Vars (Vercel)

| Variable | Status | Environments |
|----------|--------|-------------|
| `TURSO_DATABASE_URL` | ✅ Set | Production, Development |
| `TURSO_AUTH_TOKEN` | ✅ Set | Production, Development |
| `NEXTAUTH_SECRET` | ✅ Set | Production |
| `AUTH_TRUST_HOST` | ✅ Set | Production |
| `AUTH_URL` | ✅ Set | Production |
| `GOOGLE_CLIENT_ID` | ✅ Set | Production |
| `GOOGLE_CLIENT_SECRET` | ✅ Set | Production |
| `STRIPE_SECRET_KEY` | ❌ Needed | Production |
| `STRIPE_PUBLISHABLE_KEY` | ❌ Needed | Production |
| `STRIPE_WEBHOOK_SECRET` | ❌ Needed | Production |

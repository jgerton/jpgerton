# Starter Template Guide

**Version:** 1.0
**Last Updated:** February 2026
**Purpose:** Standard theme and plugin stack for $500 WordPress site delivery

---

## Theme Selection

### Primary: Kadence Theme (Free)

[Kadence Theme](https://wordpress.org/themes/kadence/) is the default for all $500 projects.

**Why Kadence:**

- **Block editor native** - Built for Gutenberg/FSE, not retrofitted
- **Free version sufficient** - Handles 90% of small business needs without Pro
- **Performance** - Near-perfect Lighthouse scores out of the box
- **Modern stack** - Designed for the future of WordPress, not legacy patterns
- **Ecosystem** - Kadence Blocks integrates seamlessly, single support source

**Alternatives (only when project needs dictate):**

| Theme | When to Consider | Tradeoff |
|-------|------------------|----------|
| [Astra](https://wordpress.org/themes/astra/) | Client has existing Astra site | More established, less block-first |
| [GeneratePress](https://wordpress.org/themes/flavor/) | Extreme performance needs | Lighter weight, fewer built-in features |

> **Default to Kadence** unless client has a specific reason to use something else.

---

## Editor Approach

### Block Editor Only - NO Page Builders

- Use Kadence Blocks for all page building
- **Never install** Elementor, Divi, Beaver Builder, or similar page builders

**Why no page builders:**

1. **Performance** - Page builders add 200-500KB of unnecessary CSS/JS
2. **Maintenance** - Builder updates can break layouts
3. **Portability** - Content locked in proprietary format
4. **Client editing** - Simpler block interface for clients who do want to edit

**Client expectation reality:** 9/10 small business clients want "done for them" sites. They won't edit the site themselves. Optimizing for Jon's build speed and long-term maintenance is the correct trade-off.

---

## Essential Plugins (Install on Every Project)

These 7 plugins form the standard stack. Install all of them on every $500 project.

| Plugin | Purpose | Config Notes |
|--------|---------|--------------|
| [Kadence Blocks](https://wordpress.org/plugins/kadence-blocks/) | Page building blocks | Includes Advanced Form Block for contact forms |
| [Wordfence](https://wordpress.org/plugins/wordfence/) | Security | Enable firewall, malware scanner, 2FA for admin |
| [UpdraftPlus](https://wordpress.org/plugins/updraftplus/) | Backups | Configure Google Drive or Dropbox destination |
| [Rank Math](https://wordpress.org/plugins/seo-by-rank-math/) | SEO | Run setup wizard, enable local SEO features |
| [WP Mail SMTP](https://wordpress.org/plugins/wp-mail-smtp/) | Email deliverability | Configure SMTP provider (Gmail, Brevo, etc.) |
| [Site Kit by Google](https://wordpress.org/plugins/google-site-kit/) | Analytics dashboard | Connect client's Google Analytics |
| [Duplicator](https://wordpress.org/plugins/duplicator/) | Migration | Used for staging-to-production deployment |

### Plugin Details

#### Kadence Blocks

- **Version:** 3.6.1+
- **Install count:** 400K+
- **What it provides:** 25+ custom blocks, intelligent loading (only loads CSS/JS for blocks used on page)
- **Key blocks to use:**
  - Advanced Form Block (contact forms)
  - Row Layout (sections)
  - Info Box (services cards)
  - Icon List (feature lists)
  - Testimonial Block

> **Important:** Use the **Advanced Form Block** for contact forms. The classic Kadence Form Block is being sunset and will eventually be removed.

#### Wordfence

- **Version:** Latest
- **Install count:** 5M+
- **Free tier includes:**
  - Web application firewall
  - Malware scanner
  - Two-factor authentication
  - Login security
  - IP blocking

**Setup checklist:**
- [ ] Enable firewall
- [ ] Schedule weekly malware scans
- [ ] Enable 2FA for admin account
- [ ] Configure login attempt limits

#### UpdraftPlus

- **Version:** 1.26.1+
- **Install count:** 3M+
- **Free tier includes:**
  - Scheduled backups
  - Cloud storage (Google Drive, Dropbox)
  - One-click restore
  - Manual backup trigger

**Setup checklist:**
- [ ] Connect Google Drive or Dropbox
- [ ] Set weekly backup schedule
- [ ] Test restore at least once before handoff
- [ ] Explain restore process to client (optional)

#### Rank Math

- **Version:** Latest
- **Install count:** 3M+
- **Why Rank Math over Yoast:**
  - Setup wizard under 5 minutes
  - Local SEO features in free tier
  - Schema markup included
  - Less aggressive upselling

**Setup checklist:**
- [ ] Run setup wizard
- [ ] Set homepage SEO title/description
- [ ] Enable local SEO (if applicable)
- [ ] Configure sitemap
- [ ] Submit sitemap to Google Search Console

#### WP Mail SMTP

- **Version:** Latest
- **Install count:** 4M+
- **Why critical:** Default WordPress mail often goes to spam. This prevents "I never got the lead" disasters.

**Setup checklist:**
- [ ] Choose SMTP provider (Gmail, Brevo, SMTP.com)
- [ ] Configure API key or SMTP credentials
- [ ] Send test email
- [ ] Verify test arrives in inbox (not spam)

#### Site Kit by Google

- **Version:** 1.170.0+
- **Install count:** 5M+
- **What it provides:** Dashboard widget showing visitor stats, connects Google Analytics, Search Console, PageSpeed Insights

**Setup checklist:**
- [ ] Connect client's Google account
- [ ] Set up Google Analytics property (or connect existing)
- [ ] Connect Search Console
- [ ] Show client how to view stats in WordPress dashboard

#### Duplicator

- **Version:** Latest (free)
- **Why Duplicator:** Deploys to empty hosting without requiring WordPress pre-install. Superior to All-in-One WP Migration for staging-to-production workflow.

**Note:** Only used by Jon during migration. Not required for ongoing site operation. Can be removed after launch if desired.

---

## Contact Form Solution

### Use: Kadence Advanced Form Block

The Advanced Form Block is included with Kadence Blocks. No additional form plugin needed.

**DO NOT install WPForms Lite** - The Kadence form solution is already available and maintains ecosystem consistency.

**Form setup:**

1. Create/edit page with contact form
2. Add "Advanced Form" block (not "Form" - that's the sunset classic version)
3. Configure fields: Name, Email, Phone, Message
4. Set email notification to client's business email
5. Add success message: "Thanks for reaching out! We'll get back to you within 1 business day."

**Spam protection:**
- Kadence includes honeypot field by default
- Add reCAPTCHA if spam becomes an issue

---

## "Nice Touch" Extras (Optional Per Project)

Include these when they add value. Not required for every project.

| Plugin | Purpose | When to Include |
|--------|---------|-----------------|
| [Kadence Starter Templates](https://wordpress.org/plugins/kadence-starter-templates/) | Pre-built layouts | Speeds up initial design, useful for common business types |
| [Really Simple SSL](https://wordpress.org/plugins/really-simple-ssl/) | SSL configuration | Only if hosting doesn't handle SSL automatically |

### Kadence Starter Templates

- AI-powered template selection
- Global color palette application
- One-click import

**Best templates for common business types:**
- **Service businesses:** Clean Agency, Business Builder
- **Contractors:** Construction Pro, Handyman
- **Consultants:** Coaching, Business

> Use as starting point, then customize. Don't deliver unmodified templates.

---

## Standard Page Structure

### 5-Page Standard (Included in $500)

Every $500 project includes:

1. **Home** - Hero, services overview, call to action
2. **About** - Business story, owner bio, trust building
3. **Services** - List of services with descriptions
4. **Contact** - Contact form, phone, email, address, map (if physical location)
5. **Privacy Policy** - Required for legal compliance

### 7-Page Option (If Client Provides Content)

Expand to 7 pages when client provides additional content:

6. **Testimonials / Reviews** - Customer testimonials (Fame Wall style display)
7. **FAQ** - Common questions and answers

**Fame Wall concept:** Display testimonials in card grid similar to portfolio project cards. Visual, scannable, builds trust.

---

## Installation Checklist

Use this checklist for every new $500 WordPress project.

### Phase 1: Initial Setup

- [ ] Create staging subdomain: `staging-[clientname].jongerton.com`
- [ ] Install WordPress
- [ ] Delete default plugins (Hello Dolly, Akismet if not using)
- [ ] Delete default themes (keep only Kadence)

### Phase 2: Theme Setup

- [ ] Install Kadence Theme
- [ ] Activate Kadence Theme
- [ ] Configure theme settings:
  - [ ] Site identity (title, tagline)
  - [ ] Colors (match client brand)
  - [ ] Typography (leave defaults unless brand requires specific fonts)
  - [ ] Header layout
  - [ ] Footer layout

### Phase 3: Plugin Installation

- [ ] Install Kadence Blocks
- [ ] Install Wordfence
- [ ] Install UpdraftPlus
- [ ] Install Rank Math
- [ ] Install WP Mail SMTP
- [ ] Install Site Kit by Google
- [ ] Install Duplicator
- [ ] (Optional) Install Kadence Starter Templates

### Phase 4: Plugin Configuration

- [ ] **Wordfence:** Enable firewall, schedule scans, configure 2FA
- [ ] **UpdraftPlus:** Connect cloud storage, set backup schedule
- [ ] **Rank Math:** Run setup wizard, configure local SEO
- [ ] **WP Mail SMTP:** Configure provider, send test email
- [ ] **Site Kit:** Connect client Google account (do at handoff if needed)

### Phase 5: Security & Protection

- [ ] Set admin username (not "admin")
- [ ] Use strong password
- [ ] Enable 2FA on admin account
- [ ] Configure Wordfence login protection
- [ ] Password protect staging site

### Phase 6: Build Pages

- [ ] Create Home page
- [ ] Create About page
- [ ] Create Services page
- [ ] Create Contact page (with Advanced Form Block)
- [ ] Create Privacy Policy page
- [ ] Set Home as front page (Settings > Reading)
- [ ] Set up navigation menu

### Phase 7: Pre-Launch

- [ ] Test contact form (verify email delivery)
- [ ] Check all links work
- [ ] Verify mobile responsiveness
- [ ] Run Lighthouse audit
- [ ] Get client approval on staging

### Phase 8: Migration

- [ ] Create Duplicator package
- [ ] Deploy to production hosting
- [ ] Run Duplicator installer
- [ ] Verify all pages and forms work
- [ ] Enable SSL
- [ ] Remove staging password protection on production
- [ ] Submit sitemap to Google Search Console

---

## Quick Reference Card

**Theme:** Kadence (free)
**Blocks:** Kadence Blocks
**Forms:** Advanced Form Block (in Kadence Blocks)
**Security:** Wordfence
**Backups:** UpdraftPlus
**SEO:** Rank Math
**Email:** WP Mail SMTP
**Analytics:** Site Kit by Google
**Migration:** Duplicator

**Total plugins:** 7 (or 8 with Starter Templates)

**Pages included:** 5 standard (up to 7 if client provides content)

**Build time target:** 2-3 days active work within 5-day delivery window

---

## Links

- [Kadence Theme](https://wordpress.org/themes/kadence/)
- [Kadence Blocks](https://wordpress.org/plugins/kadence-blocks/)
- [Wordfence](https://wordpress.org/plugins/wordfence/)
- [UpdraftPlus](https://wordpress.org/plugins/updraftplus/)
- [Rank Math](https://wordpress.org/plugins/seo-by-rank-math/)
- [WP Mail SMTP](https://wordpress.org/plugins/wp-mail-smtp/)
- [Site Kit by Google](https://wordpress.org/plugins/google-site-kit/)
- [Duplicator](https://wordpress.org/plugins/duplicator/)
- [Kadence Starter Templates](https://wordpress.org/plugins/kadence-starter-templates/)

# Phase 6: WordPress Delivery System - Research

**Researched:** 2026-02-04
**Domain:** WordPress site delivery operations (documentation, not code)
**Confidence:** HIGH

## Summary

This phase produces operational documentation and templates enabling Jon to deliver $500 WordPress sites profitably with scope and payment protection. The research validates the locked decisions from CONTEXT.md and provides specific guidance for documentation creation.

The standard approach for small business WordPress delivery involves: Kadence theme with Kadence Blocks (avoiding page builders), a lean 7-8 plugin stack, 50% upfront payment with milestone-based delivery, staging-to-production migration via Duplicator, and comprehensive handoff documentation including Loom walkthroughs.

Key discoveries: Kadence Forms is being sunset in favor of Advanced Form Block; Duplicator is superior to All-in-One WP Migration for this use case; 2 revision rounds is the industry standard at this price point; one-time secret services like onetimesecret.com are still the simplest credential transfer method.

**Primary recommendation:** Create templatized documentation that can be 80% reused across projects with 20% customization, using Google Docs for editability and PDF export for client delivery.

## Standard Stack

### Core Theme and Blocks

| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| [Kadence Theme](https://wordpress.org/themes/kadence/) | Latest (2026) | Block-editor-native theme | Free version handles 90% of needs, built for Gutenberg/FSE, near-perfect Lighthouse scores |
| [Kadence Blocks](https://wordpress.org/plugins/kadence-blocks/) | 3.6.1+ | Page building blocks | 25+ custom blocks, intelligent load technology, AI-powered features included |
| [Kadence Starter Templates](https://wordpress.org/plugins/kadence-starter-templates/) | Latest | Pre-built site designs | AI-powered templates with global color palette, one-click import |

### Essential Plugins (7-8 total)

| Plugin | Version | Purpose | Why Standard |
|--------|---------|---------|--------------|
| [Kadence Blocks](https://wordpress.org/plugins/kadence-blocks/) | 3.6.1+ | Page building | Already installed with theme, Advanced Form Block included |
| [Wordfence](https://wordpress.org/plugins/wordfence/) | Latest | Security | 5M+ installs, free version has firewall + malware scanner + 2FA |
| [UpdraftPlus](https://wordpress.org/plugins/updraftplus/) | 1.26.1+ | Backups | 3M+ installs, free backs up to Google Drive/Dropbox, 3-click restore |
| [Rank Math](https://wordpress.org/plugins/seo-by-rank-math/) | Latest | SEO | 3M+ installs, 4.9-star rating, setup wizard under 5 minutes, local SEO features |
| [WP Mail SMTP](https://wordpress.org/plugins/wp-mail-smtp/) | Latest | Email deliverability | 4M+ installs, prevents "I never got the lead" disasters |
| [Site Kit by Google](https://wordpress.org/plugins/google-site-kit/) | 1.170.0+ | Analytics dashboard | 5M+ installs, official Google plugin, clients can check visitor stats |

### Contact Form Decision

**Recommendation: Use Kadence Advanced Form Block (not WPForms Lite)**

| Criteria | Kadence Forms | WPForms Lite |
|----------|--------------|--------------|
| Already installed | Yes (with Kadence Blocks) | Requires separate plugin |
| Block editor native | Yes | Separate interface |
| Free features sufficient | Yes for contact forms | Yes for contact forms |
| Ecosystem consistency | Same as theme | Different ecosystem |

**Note:** The classic Kadence Form Block is being sunset. Use the **Advanced Form Block** for all new projects.

### Alternatives for Theme (Per Project Needs)

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Kadence | Astra | More established, but less modern block-first approach |
| Kadence | GeneratePress | Lighter weight, but less built-in features |

## Architecture Patterns

### Recommended Documentation Structure

```
docs/
wordpress-delivery/
    01-starter-template-guide.pdf         # Theme + plugin stack
    02-content-workflow.pdf               # Intake -> drafting -> approval
    03-staging-setup-guide.pdf            # Internal staging SOP
    04-handoff-checklist.pdf              # Deployment, DNS, credentials
    05-scope-control-template.pdf         # What's included, change orders
    06-payment-protection.pdf             # 50% upfront, final before launch
templates/
    client-questionnaire.md               # Content intake form
    change-order-form.md                  # Scope extension template
    client-training-guide-template.md     # Customizable handoff doc
    staging-checklist.md                  # Internal staging SOP
```

### Pattern 1: Staging-to-Production Migration

**What:** Build on staging.jongerton.com, migrate to client hosting at launch
**When to use:** Every $500 project
**Process:**
1. Create subdomain: staging-clientname.jongerton.com
2. Install WordPress + Kadence + plugin stack
3. Apply noindex + password protection (WP Staging plugin does this automatically)
4. Build site, get client approval on staging preview
5. Export with Duplicator (creates archive.zip + installer.php)
6. Upload both files to client hosting empty directory
7. Run installer.php at client domain
8. Verify, cleanup installer files, enable SSL

### Pattern 2: Content Intake Hybrid

**What:** Short questionnaire + discovery call
**When to use:** Every project intake
**Process:**
1. Send questionnaire (collects basics: business name, contact info, services, competitors)
2. Schedule 15-20 min discovery call to fill gaps
3. Draft content based on intake materials
4. Client reviews draft, provides corrections
5. Finalize with 2 revision rounds

### Pattern 3: Credential Transfer

**What:** One-time secret link for secure handoff
**When to use:** Final handoff of all credentials
**Process:**
1. Compile all credentials (WordPress admin, hosting, domain registrar, Google Analytics)
2. Create one-time secret at onetimesecret.com
3. Send link to client with instructions to save to their password manager
4. Link expires after viewing

### Anti-Patterns to Avoid

- **Installing page builders (Elementor, Divi):** Creates maintenance headaches, slower sites, harder updates
- **Giving clients "site admin" role:** Use Editor role, prevents breaking changes
- **Email-based credential sharing:** Insecure, credentials live in email forever
- **Building on client hosting directly:** Exposes work-in-progress to search engines, creates pressure

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Contact forms | Custom HTML forms | Kadence Advanced Form Block | Spam protection, validation, email routing |
| Backups | Manual FTP downloads | UpdraftPlus | Scheduled, cloud storage, one-click restore |
| Security | Manual hardening | Wordfence | Firewall rules, malware scanning, 2FA |
| SEO setup | Manual meta tags | Rank Math | Schema markup, sitemap, on-page analysis |
| Email deliverability | PHP mail() | WP Mail SMTP | Authentication, deliverability, logging |
| Migration | Manual file copying | Duplicator | Database handling, URL rewriting, cleanup |
| Contract templates | Writing from scratch | Bonsai/Indy templates | Legally vetted, e-signature built in |

**Key insight:** Every "simple" WordPress task has edge cases that existing plugins handle. A $500 project cannot absorb debugging time for custom solutions.

## Common Pitfalls

### Pitfall 1: Staging Site Indexed by Google

**What goes wrong:** Client's live site penalized for duplicate content
**Why it happens:** Forgot to noindex staging, or used WordPress "discourage search engines" which is only a suggestion
**How to avoid:**
- Use WP Staging plugin (auto-adds noindex)
- Password protect staging (Password Protected plugin)
- Add X-Robots-Tag header
- Verify in Google Search Console post-launch
**Warning signs:** Staging URL appearing in search results

### Pitfall 2: Scope Creep Without Change Orders

**What goes wrong:** $500 project becomes $1500 worth of work, Jon absorbs loss
**Why it happens:** Client "just one more thing" requests, no formal change process
**How to avoid:**
- Contract clause defining what's included (5-7 pages, contact form, basic SEO)
- Explicit exclusions list
- Written change order form with pricing before starting additional work
- "Yes, and here's what it costs" response template
**Warning signs:** Multiple "quick favor" requests, emails with "while you're at it"

### Pitfall 3: Client Content Delays Blocking Launch

**What goes wrong:** Project sits incomplete for weeks, timeline blown
**Why it happens:** Client promised content "soon", no deadline consequences
**How to avoid:**
- Contract clause: timeline pauses if content not provided on time
- Client loses spot in queue (not punitive, just reality)
- Set content deadline in writing before starting design
- Offer content drafting as paid add-on
**Warning signs:** Vague "I'll get it to you" responses, missed content deadlines

### Pitfall 4: Post-Launch Support Scope Confusion

**What goes wrong:** Client expects ongoing changes, Jon expected handoff
**Why it happens:** "Bug fix warranty" not clearly defined
**How to avoid:**
- Contract defines 30-day bug fix warranty
- Bug = functionality that worked at launch but stopped
- NOT bug = content changes, new features, design revisions
- Offer maintenance retainer as upsell
**Warning signs:** Requests for "fixes" that are actually new features

### Pitfall 5: Migration Breaks URL Structure

**What goes wrong:** 404 errors, broken internal links after go-live
**Why it happens:** URL rewriting missed during Duplicator migration
**How to avoid:**
- Let Duplicator handle URL replacement (don't manually edit database)
- Test all navigation links post-migration
- Save permalinks in WordPress admin post-migration
- Check .htaccess for proper rewrite rules
**Warning signs:** Links pointing to staging domain, 404s on existing content

### Pitfall 6: Email Forms Not Delivering

**What goes wrong:** Client loses leads because form submissions go to spam
**Why it happens:** Default WordPress PHP mail() has no authentication
**How to avoid:**
- Always install WP Mail SMTP
- Configure with Gmail/SMTP.com/Brevo (free tiers available)
- Send test submission to verify delivery
- Check spam folder during testing
**Warning signs:** "I never got your test submission" from client

## Code Examples

N/A - This phase produces documentation, not code. However, here are template structures:

### Content Intake Questionnaire Structure

```markdown
## Business Basics
- Business name (exactly as it should appear):
- Tagline or slogan (if any):
- Business phone:
- Business email:
- Physical address (if applicable):
- Service area:

## About Your Business
- What does your business do? (2-3 sentences):
- How long have you been in business?:
- What makes you different from competitors?:
- Who is your ideal customer?:

## Website Goals
- Primary goal (e.g., get phone calls, book appointments, sell products):
- Secondary goals:
- Competitor websites you like (and why):
- Competitor websites you dislike (and why):

## Content
- Do you have existing content to use?: [Yes / No / Some]
- Do you have professional photos?: [Yes / No / Some]
- Do you have a logo?: [Yes / No - need one]
- Do you have brand colors?: [Yes / No]

## Pages Needed
Standard 5-page: Home, About, Services, Contact, Privacy Policy
Additional pages (if content provided): Testimonials, FAQ
```

### Change Order Form Structure

```markdown
## Change Order #[NUMBER]

**Project:** [Client Name] WordPress Website
**Date:** [Date]
**Requested by:** [Client Name]

### Requested Changes
[Description of what client wants that's outside original scope]

### Why This Is Outside Original Scope
Original scope included: [reference contract]
This request is: [new feature / additional page / design revision beyond included rounds]

### Cost for Additional Work
Hours estimated: [X] hours at $[Y]/hour = $[Total]
OR
Fixed price: $[Amount]

### Timeline Impact
This work will add [X] days to the project timeline.

### Approval
By signing below, client approves this change order and associated costs.

_________________________  Date: ________
Client Signature

Payment due: [Before work begins / With final invoice]
```

### Client Training Guide Template Structure

```markdown
# [Business Name] Website Guide

## Your Login Credentials
- WordPress admin: [link]
- Username: [sent via secure link]
- Password: [sent via secure link]
- Hosting login: [link]
- Domain registrar: [link]

## How to Edit Text
1. Log into WordPress admin
2. Go to Pages > [page name]
3. Click on text block you want to edit
4. Make changes
5. Click Update button (top right)
[Include screenshots]

## How to Edit Images
[Steps with screenshots]

## How to Add a Blog Post
[Steps with screenshots]

## What NOT to Touch
- Plugins page (updates can break things)
- Appearance > Theme settings
- Settings menu
- Users page

## Need Help?
- Bug fixes (30 days): Contact Jon at [email]
- Content changes after 30 days: $[X]/hour
- Ongoing maintenance: Ask about monthly retainer

## Your Loom Walkthrough
Watch your personalized video tour: [Loom link]
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Page builders (Elementor, Divi) | Block editor + Kadence Blocks | 2023-2024 | Faster sites, easier maintenance |
| Classic Kadence Form Block | Advanced Form Block | 2025-2026 | Classic being sunset, use Advanced |
| All-in-One WP Migration | Duplicator (for this use case) | Ongoing | Better disaster recovery, no WP install required |
| Email credentials in email | One-time secret links | Standard practice | Security, expires after viewing |
| Live training calls | Loom video + PDF guide | COVID-era shift | Scalable, client can rewatch |

**Deprecated/outdated:**
- Classic Kadence Form Block: Being sunset, hidden from block inserter
- Manual FTP migrations: Error-prone, URL rewriting issues
- PHP mail() for forms: Deliverability problems, use SMTP

## Open Questions

1. **Kadence Starter Template Selection Per Project**
   - What we know: AI-powered templates available, filter by category (Business, etc.)
   - What's unclear: Which specific templates work best for which small business types
   - Recommendation: Document 3-5 go-to templates for common business types (service business, contractor, consultant)

2. **Written Guide Format**
   - What we know: Needs to be customizable, exportable
   - Options: Google Docs (collaborative), Notion (pretty), PDF (final delivery)
   - Recommendation: Master template in Google Docs, export to PDF for final delivery

3. **Staging Cleanup Schedule**
   - What we know: Need to clean up old staging sites
   - What's unclear: How long to keep staging after launch
   - Recommendation: Keep 30 days (matches bug fix warranty), then archive/delete

## Sources

### Primary (HIGH confidence)
- [WordPress.org - Kadence Blocks](https://wordpress.org/plugins/kadence-blocks/) - Version 3.6.1, features, form block sunset notice
- [WordPress.org - Kadence Theme](https://wordpress.org/themes/kadence/) - Current version, features
- [WordPress.org - Wordfence](https://wordpress.org/plugins/wordfence/) - Free version features, 5M+ installs
- [WordPress.org - UpdraftPlus](https://wordpress.org/plugins/updraftplus/) - Version 1.26.1, 3M+ installs
- [WordPress.org - Rank Math](https://wordpress.org/plugins/seo-by-rank-math/) - 3M+ installs, setup process
- [WordPress.org - WP Mail SMTP](https://wordpress.org/plugins/wp-mail-smtp/) - 4M+ installs, features
- [WordPress.org - Site Kit by Google](https://wordpress.org/plugins/google-site-kit/) - Version 1.170.0, 5M+ installs

### Secondary (MEDIUM confidence)
- [Duplicator.com](https://duplicator.com/how-to-migrate-wordpress-site/) - Migration guide, Duplicator vs All-in-One comparison
- [KadenceWP.com](https://www.kadencewp.com/kadence-blocks/changelog/) - Changelog, form block sunset notice
- [WPEngine](https://wpengine.com/resources/how-to-successfully-hand-off-websites-to-your-clients/) - Handoff best practices
- [Contra.com](https://contra.com/p/NAAvZWNm-web-design-payment-schedules-a-guide-to-deposits-and-milestones) - Payment schedule industry standards
- [ContentSnare](https://contentsnare.com/website-design-questionnaire/) - Content intake questionnaire templates
- [Bonsai](https://www.hellobonsai.com/contract-template/freelance-wordpress-design) - Contract templates, scope control
- [Loom/Atlassian](https://support.atlassian.com/loom/docs/getting-started-loom-video-tutorials/) - Loom walkthrough best practices
- [OneTimeSecret.com](https://onetimesecret.com/) - Credential transfer service

### Tertiary (LOW confidence)
- WebSearch results for pricing/revision standards - Multiple sources agree on 50% deposit, 2 rounds

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - WordPress.org plugin pages verified, active install counts confirmed
- Architecture patterns: HIGH - Based on verified plugin capabilities and industry documentation
- Pitfalls: MEDIUM - Based on industry articles and community experience, not firsthand
- Contract/pricing standards: MEDIUM - Multiple sources agree, but market varies

**Research date:** 2026-02-04
**Valid until:** 60 days (documentation/process focus, less time-sensitive than code)

## Recommendations for Claude's Discretion Items

### Migration Plugin Choice
**Recommendation: Duplicator (Free)**

| Factor | Duplicator | All-in-One WP Migration |
|--------|------------|------------------------|
| Empty server deploy | Yes | Requires existing WP install |
| File size limit (free) | 500MB | 512MB |
| Disaster recovery | Works without dashboard access | Requires dashboard |
| Multisite support | Pro only | Pro only |
| Price point | Free adequate | Free adequate |

Duplicator wins for this use case because staging sites can be deployed to empty hosting without pre-installing WordPress.

### Written Guide Format
**Recommendation: Google Docs -> PDF export**

- Editable master template in Google Docs
- Duplicate per client, customize 20%
- Export to PDF for professional final delivery
- Client gets PDF (clean) + optional Docs link (if they want to edit)

### Staging Site Organization
**Recommendation:**
- Subdomain pattern: `staging-[clientname].jongerton.com`
- Password protect all staging sites
- Cleanup 30 days after launch (matches warranty period)
- Document in staging checklist: "Delete staging by [date]"

# Payment Protection

**Version:** 1.0
**Last Updated:** February 2026
**Purpose:** Payment terms, warranty definition, and support boundaries for $500 WordPress delivery

---

## Payment Structure

### Standard Payment Terms

| Milestone | When Due | Amount | Purpose |
|-----------|----------|--------|---------|
| **Deposit** | Contract signed | 50% ($250) | Secures project slot, covers initial work |
| **Final Payment** | Site approved on staging | 50% ($250) | Releases site for launch |
| **Total** | | **$500** | |

### Key Rules

1. **No work begins without deposit** - Project is not scheduled until deposit clears
2. **No launch without final payment** - Site remains on staging until paid in full
3. **Payment via Stripe invoice** - Professional invoicing with payment link
4. **Add-ons invoiced separately** - Change orders are paid before additional work begins

---

## Payment Timeline

```
Contract Signed → 50% Deposit Paid → Work Begins
         ↓
    [Design & Build: 3-5 days]
         ↓
Staging Site Ready → Client Reviews → Approval
         ↓
50% Final Payment Requested → Payment Received
         ↓
      Site Goes Live
         ↓
   30-Day Warranty Begins
```

### Timeline Details

| Phase | Duration | Payment Status |
|-------|----------|----------------|
| Discovery & contract | 1-2 days | Awaiting deposit |
| Deposit clearing | 1-3 days | Processing |
| Design & build | 3-5 days | Deposit held |
| Client review | 1-5 days | Awaiting approval |
| Final payment clearing | 1-3 days | Processing |
| Launch | Same day | Paid in full |
| Warranty period | 30 days | Complete |

---

## What Happens If...

### Client Disappears After Deposit

**Scenario:** Client pays deposit, then stops responding.

**Policy:**
- Jon sends follow-up at 7, 14, and 21 days
- Work pauses after initial follow-up
- At 60 days: Files archived, project closed
- **Deposit is non-refundable** (covers time already invested)
- Client can resume within 60 days by responding
- After 60 days: New deposit required to restart

**Template email (60 days):**
> Hi [Client], I haven't heard back since [date]. Per our agreement, I'm archiving this project. Your deposit covered the discovery and initial setup work completed. If you'd like to resume in the future, please reach out and we can discuss restarting with a new deposit. Thanks, Jon

### Client Delays Approval

**Scenario:** Staging site ready, client takes weeks to review.

**Policy:**
- Jon moves to other projects (not on hold)
- Gentle reminders at 7 and 14 days
- At 30 days: Final notice that timeline will extend significantly
- No penalty to client, but Jon's availability becomes first-come-first-served
- Original timeline estimates no longer apply

**Template email (14 days):**
> Hi [Client], The staging site has been ready for review since [date]. Just a reminder that I'm waiting on your feedback to proceed. I've moved to other projects in the meantime, so once you're ready, I'll slot you back in as my schedule allows. Let me know if you have any questions!

### Client Requests Launch Before Payment

**Scenario:** Client asks to go live before final payment clears.

**Policy:**
- Polite but firm decline
- Staging site remains password-protected
- Site launches same-day once payment clears
- No exceptions

**Response template:**
> I completely understand you're eager to launch! The site is ready to go. As outlined in our agreement, the final payment releases the site for launch. Once that clears (usually same-day for Stripe), I'll have you live within hours. Here's the invoice link: [link]

### Client Disputes Payment

**Scenario:** Client initiates chargeback or disputes invoice.

**Policy:**
- Site immediately returns to staging (if already launched)
- All work pauses
- Stripe dispute process followed
- Site not restored until dispute resolved in Jon's favor
- If chargeback succeeds: Site deleted, client relationship ended

**Note:** This is extremely rare with proper client qualification. The 50/50 structure and clear contracts prevent most disputes.

### Client Wants Refund

**Scenario:** Client wants money back after deposit.

**Policy:**
- Deposit is non-refundable (covers discovery, setup, time blocked)
- If no work started: Case-by-case consideration for partial refund
- If significant work completed: No refund, work delivered as-is
- Final payment: Only refundable if Jon fails to deliver working site

**Response template:**
> I understand circumstances change. Per our agreement, the deposit is non-refundable as it covers the discovery process, project setup, and reserved time. I'm happy to pause the project if you need time, and we can resume within 60 days. Alternatively, we can complete a simplified version that fits your current needs. What works best for you?

---

## 30-Day Bug Fix Warranty

### What IS Covered

Bugs are defined as: **Functionality that worked at launch but stopped working, or display issues that weren't present at handoff.**

| Covered Issue | Example |
|---------------|---------|
| **Broken functionality** | Contact form was working, now isn't |
| **Display bugs** | Layout shifted on phones after working at launch |
| **Email delivery issues** | Form submissions not arriving (if WP Mail SMTP was configured correctly) |
| **Broken links** | Internal links that were working now return 404 |
| **Plugin conflicts** | Core plugins conflicting (not client-added plugins) |

### What is NOT Covered

| Not Covered | Why |
|-------------|-----|
| **Content changes** | "Can you update the phone number?" - That's maintenance |
| **New features** | "Can we add a blog?" - That's a change order |
| **Design revisions** | "I changed my mind about colors" - That's a revision round |
| **Client-caused issues** | Client edited code, added plugins, changed settings |
| **Third-party changes** | Hosting issues, domain expiration, email provider problems |
| **Plugin updates breaking things** | Client updated plugins without testing |
| **Hosting problems** | Server issues, SSL certificate expiration, DNS problems |
| **Auto-updates causing issues** | WordPress or plugin auto-updates that break something |
| **Third-party plugin/theme conflicts** | Plugins or themes client added after launch |
| **Changes by client's team** | "My nephew tried to help" - client-caused damage |
| **Email delivery problems** | Emails going to spam, deliverability issues (hosting/email provider) |
| **Domain/DNS issues** | Domain expired, DNS misconfigured, nameserver problems |

### Warranty Boundaries

- **Start date:** Day of launch (site goes live on production domain)
- **End date:** 30 calendar days from launch
- **Response time:** 1-2 business days
- **Bug reports:** Via email only (not text, not phone)
- **Scope:** Issues present at launch or directly caused by launch configuration

### Warranty Claim Process

```
1. Client emails bug report with:
   - Description of issue
   - Screenshot (if visual bug)
   - Steps to reproduce
           ↓
2. Jon confirms bug is covered under warranty (1-2 business days)
           ↓
3. If covered: Fix deployed (typically same day)
   If not covered: Explanation + quote for fixing
           ↓
4. Client confirms fix (or approves quote for non-warranty work)
```

---

### Precise Bug Definition Examples

The warranty definitions above can be fuzzy in practice. These real-world examples clarify exactly what is and isn't covered.

**COVERED - These ARE bugs (Jon fixes free within 30 days):**

| Situation | Why It's Covered |
|-----------|------------------|
| "Contact form was receiving emails at launch, now it isn't" | Functionality regression with no client changes |
| "Page layout broke on mobile (was working at launch)" | Display regression, Jon's responsibility |
| "Images stopped displaying (no changes made by client)" | Content regression, Jon's responsibility |
| "Internal link goes to 404 now (page wasn't moved)" | Link regression, Jon's responsibility |
| "Footer appears twice on one page" | Bug introduced during build |
| "Form shows error message on valid submission" | Functionality bug |

**NOT COVERED - These are NOT bugs (require paid support):**

| Situation | Why It's NOT Covered | What To Do |
|-----------|---------------------|------------|
| "Contact form emails going to spam" | Email deliverability is hosting/email provider issue, not website bug | Client contacts hosting support, or Jon assists at $50/hr |
| "Site is slow" | Hosting performance, not website bug | Client upgrades hosting, or Jon optimizes at $50/hr |
| "Plugin update broke something" | Client-initiated change caused issue | Jon fixes at $50/hr |
| "My nephew tried to help and now it's broken" | Client-caused damage | Jon fixes at $50/hr |
| "I changed a setting and now X doesn't work" | Client-caused issue | Jon fixes at $50/hr |
| "New feature request (add a blog, add a page)" | Feature request, not bug | Change order required |
| "Content change (update phone number)" | Content maintenance, not bug | $50/hr or retainer |
| "The colors look different on my monitor" | Hardware variance, not bug | Not actionable |
| "It looked fine last week but now I don't like it" | Design preference, not bug | Revision round ($75) |
| "WordPress sent me an update notice" | Normal WP behavior, not bug | Client ignores or Jon handles on retainer |
| "My SSL certificate expired" | Hosting/domain responsibility | Client renews, or Jon assists at $50/hr |
| "My domain expired" | Domain registrar responsibility | Client renews ASAP |
| "Google says my site isn't indexed" | SEO is ongoing, not launch bug | SEO services quoted separately |

### THE KEY QUESTION

When deciding if something is covered under warranty, ask:

**"Did this work correctly at launch, AND did it stop working without the client making changes?"**

| Answer | Coverage | Action |
|--------|----------|--------|
| YES to both | Bug - covered | Jon fixes free within 30 days |
| NO to either | Not a bug | Paid support required ($50/hr) |

**Examples:**
- Contact form working at launch, stopped working, client made no changes = **Covered**
- Contact form emails going to spam (deliverability issue) = **Not covered** (hosting issue)
- Mobile layout broken, client added new plugin = **Not covered** (client-caused)
- Link broken, client didn't move any pages = **Covered**

---

### Warranty Dispute Resolution

If there's disagreement about whether something is covered:

1. **Jon explains reasoning in writing** - Clear, specific explanation of why it's covered or not
2. **Offers fix at hourly rate** - If client disagrees with assessment, Jon offers to fix at $50/hr
3. **One-time goodwill gesture** - If client insists, Jon may fix as goodwill (documented, one time only per client)
4. **Document the decision** - Add to project notes for future reference

**Goal:** Resolve disputes fairly without damaging the relationship.

---

### Warranty Claim Response Templates

**For covered bugs:**

> Thanks for reporting this. I've confirmed this is a warranty item (functionality that was working at launch). I'll have it fixed within [timeframe - usually 1-2 business days].

**For non-covered items:**

> Thanks for reaching out. After reviewing, this falls outside the warranty coverage because [specific reason - e.g., "it's a content change" or "the issue was caused by a plugin you installed" or "this is an email deliverability issue with your hosting provider"].
>
> I'm happy to fix this for you at my standard rate of $50/hour. Want me to proceed?

**For borderline cases:**

> Thanks for reporting this. Looking at the issue, it's borderline - [explain situation]. In the interest of keeping things moving smoothly, I'll take care of this one as a goodwill gesture. Going forward, similar issues would fall under paid support.

---

## Support Boundaries

### During Warranty Period (Days 1-30)

| Channel | Availability |
|---------|--------------|
| Email | Monitored daily |
| Response time | 1-2 business days |
| Phone/text | Not available for support |
| Scope | Bug fixes only |

### After Warranty Period (Day 31+)

| Option | Cost | Includes |
|--------|------|----------|
| **Hourly support** | $50/hour | Any changes, 1-hour minimum |
| **Monthly retainer** | $75/month | Updates, backups, minor changes (up to 1 hour) |
| **Emergency fix** | $100 minimum | Same-day response, urgent issues |

### What "Support" Means

**Support IS:**
- Answering questions about how to use the site
- Fixing bugs within warranty period
- Providing documentation or instructions

**Support is NOT:**
- Making content changes
- Adding new features
- Training on WordPress basics (recommend YouTube tutorials)
- Troubleshooting client's email/hosting issues
- 24/7 availability

---

## Email Templates

### Initial Invoice with Deposit Request

**Subject:** Invoice for [Business Name] Website Project - Deposit

> Hi [Client Name],
>
> Great chatting with you about your new website! I'm excited to get started.
>
> Attached is the invoice for your 50% deposit ($250). Once this clears, I'll:
> 1. Send over the client questionnaire
> 2. Schedule our kickoff call
> 3. Begin work on your staging site
>
> Pay securely via the link in the invoice. Processing usually takes 1-2 business days.
>
> Questions? Just reply to this email.
>
> Looking forward to building something great together!
>
> Jon

### Final Payment Request (Site Ready)

**Subject:** Your website is ready for review! Final payment to launch

> Hi [Client Name],
>
> Great news - your website is ready! Here's your staging link: [link]
> Password: [password]
>
> Please review and let me know:
> - Any final tweaks (within our revision rounds)
> - Approval to launch
>
> Once you're happy with everything, here's the final invoice for $250: [link]
>
> As soon as payment clears, I'll:
> 1. Migrate to your live domain
> 2. Set up SSL
> 3. Submit to Google Search Console
> 4. Send you the handoff documentation
>
> Your 30-day warranty starts the day we go live.
>
> Excited to launch this for you!
>
> Jon

### Payment Reminder (Gentle - 7 days)

**Subject:** Friendly reminder: Final payment for website launch

> Hi [Client Name],
>
> Just a quick follow-up - I sent over the final invoice last week and wanted to make sure it didn't get lost in your inbox.
>
> Your staging site is ready and waiting to go live! Here's the invoice link again: [link]
>
> Let me know if you have any questions or if there's anything else you need before approving.
>
> Thanks!
>
> Jon

### Final Notice (14 days)

**Subject:** Action needed: Website launch pending payment

> Hi [Client Name],
>
> I wanted to check in since I haven't heard back about the final payment for your website.
>
> The staging site has been ready since [date]. I'm holding your launch slot, but I do need to move forward with other projects soon.
>
> To proceed with launch, please complete the final payment here: [link]
>
> If your plans have changed or you need to discuss anything, just let me know. I'm happy to work with you on next steps.
>
> Thanks,
>
> Jon

### Project Archive Notice (60 days)

**Subject:** Project archived - [Business Name] website

> Hi [Client Name],
>
> Since I haven't heard back since [last contact date], I've archived the [Business Name] website project.
>
> Per our agreement:
> - Your deposit covered discovery and initial work completed
> - Files are archived for 60 additional days
> - To restart, a new deposit would be required
>
> If circumstances have changed and you'd like to discuss options, I'm happy to chat.
>
> Wishing you all the best!
>
> Jon

---

## Why This Protects Both Parties

### For Jon

- **Never works for free** - Deposit covers time even if client disappears
- **Never delivers unpaid work** - Final payment required before launch
- **Clear warranty boundaries** - Support doesn't become endless
- **Written documentation** - Prevents "but I thought..." disputes

### For Client

- **Leverage until satisfied** - Final payment withheld until staging approved
- **Clear deliverables** - Knows exactly what $500 includes
- **Bug protection** - 30 days of covered fixes
- **Professional relationship** - Clear expectations from day one

### The Fair Trade

```
Client provides: Clear requirements, timely feedback, payment
Jon provides: Professional website, revision rounds, warranty, support
```

Both parties know what to expect. No surprises.

---

## Quick Reference

**Payment:** 50% deposit, 50% before launch

**Deposit:** $250, non-refundable, due before work starts

**Final:** $250, due before launch, releases site

**Warranty:** 30 days, bugs only, email support, 1-2 day response

**After warranty:** $50/hour or $75/month retainer

**Key rule:** No launch without payment. No exceptions.

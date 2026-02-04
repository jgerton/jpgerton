# Project Termination Protocol

**Version:** 1.0
**Last Updated:** February 2026
**Purpose:** Clean exit ramp for projects that aren't working

---

## Philosophy

End relationships professionally. Protect both parties. Leave the door open for future opportunities when appropriate.

Termination is not failure - sometimes projects just aren't a good fit. The goal is to exit cleanly, fairly, and without burning bridges.

---

## When to Consider Termination

### Client Behavior Issues

| Trigger | Examples |
|---------|----------|
| **Abusive or disrespectful** | Insults, threats, harassment, condescending tone |
| **Endlessly demanding beyond scope** | Ignores change order process, expects unlimited revisions |
| **Repeated boundary violations** | Late-night/weekend demands despite stated hours |
| **Refuses to pay per agreement** | Ignores invoices, attempts to renegotiate after work is done |
| **Fundamental misalignment** | Vision for project can't be reconciled with reality/budget |

### Client Availability Issues

| Trigger | Policy Reference |
|---------|-----------------|
| **Client disappears for 60+ days** | See 05-payment-protection.md - project archived |
| **Client delays approval indefinitely** | See 05-payment-protection.md - timeline extends |

### Jon's Circumstances

| Trigger | Examples |
|---------|----------|
| **Capacity issues** | Too many projects, unable to give adequate attention |
| **Personal circumstances** | Illness, family emergency, need to reduce workload |
| **Ethical concerns** | Project turns out to involve something Jon can't support |

---

## Termination Scenarios and Protocols

### Scenario A: Client-Initiated Termination (Before Work Starts)

**When:** Client cancels after signing contract but before substantive work begins.

| Item | Policy |
|------|--------|
| **Deposit** | Non-refundable (covers reserved time, discovery prep) |
| **Work delivered** | None |
| **Process** | Acknowledge in writing, confirm project cancelled |

**Notes:** "Before work starts" means before questionnaire review and design work. Discovery call and contract prep count as work.

---

### Scenario B: Client-Initiated Termination (Work In Progress)

**When:** Client cancels after work has begun.

| Item | Policy |
|------|--------|
| **Deposit** | Non-refundable |
| **Work delivered** | All completed pages, content, images exported |
| **Files format** | WordPress export XML + media folder |
| **Process** | Formal letter, deliver files, close project |

**Notes:** Client owns the work paid for. Deliver everything completed, even if partial.

---

### Scenario C: Jon-Initiated Termination (Client Issues)

**When:** Jon ends project due to client behavior or project problems.

| Item | Policy |
|------|--------|
| **Deposit** | Prorated refund based on work completed |
| **Work delivered** | All completed work |
| **Process** | Formal letter, deliver files, process refund |

**Refund Calculation:**

| Work Completed | Refund Amount | Rationale |
|----------------|---------------|-----------|
| 0-25% | 75% of deposit ($187.50) | Minimal work done |
| 25-50% | 50% of deposit ($125.00) | Significant discovery/setup |
| 50-75% | 25% of deposit ($62.50) | Major work completed |
| 75%+ | No refund ($0) | Work nearly complete |

**Why refund when terminating?** Taking the high road. If Jon is ending the relationship, providing partial refund:
- Prevents disputes
- Maintains professional reputation
- Reduces risk of negative reviews
- Is simply the fair thing to do

---

### Scenario D: Jon-Initiated Termination (Jon's Circumstances)

**When:** Jon ends project due to personal/capacity issues (not client's fault).

| Item | Policy |
|------|--------|
| **Deposit** | Full refund ($250) |
| **Work delivered** | All completed work |
| **Process** | Formal letter, immediate refund, offer referral |

**Notes:** When it's Jon's fault, client gets full refund. This is non-negotiable.

---

### Scenario E: Mutual Agreement to Terminate

**When:** Both parties agree project isn't working.

| Item | Policy |
|------|--------|
| **Deposit** | Negotiate based on work completed |
| **Work delivered** | All completed work |
| **Process** | Both parties agree on terms, document in writing |

**Notes:** This is the best-case termination. Both parties discuss and agree on fair resolution.

---

## Termination Process Checklist

Use this checklist for any termination:

### Before Sending Termination Letter

- [ ] Document reason for termination (internal notes for records)
- [ ] Determine which scenario applies (A, B, C, D, or E)
- [ ] Calculate refund amount (if applicable)
- [ ] Export all completed work from WordPress
  - [ ] WordPress XML export (Tools > Export > All content)
  - [ ] Media files (wp-content/uploads folder)
  - [ ] Any custom CSS or code snippets
- [ ] Draft termination letter (use appropriate template)
- [ ] Review letter for professional tone

### Sending and Completing Termination

- [ ] Send termination letter via email (keep copy)
- [ ] Process refund in Stripe if applicable
  - Note transaction ID for records
- [ ] Send completed work files via Google Drive or Dropbox
- [ ] Archive project folder locally
- [ ] Remove staging site access (if applicable)
  - [ ] Change staging site password
  - [ ] Delete staging site after 7 days
- [ ] Document lessons learned (what to watch for next time)

### Post-Termination

- [ ] Save all correspondence (emails, messages)
- [ ] Update project tracker status to "Terminated"
- [ ] Add to "lessons learned" notes for qualification improvement

---

## Termination Letter Templates

### Template A: Jon Terminating Due to Client Behavior

**Use when:** Client is difficult, demanding, disrespectful, or misaligned.

**Subject:** [Business Name] Project - Project Termination

---

Hi [Client Name],

After careful consideration, I've decided to end our project engagement for [Business Name].

[Choose ONE of these professional reasons:]

*Option 1 - Scope creep:*
The project requirements have evolved beyond the original scope, and I don't believe I'm the right fit to deliver what you're looking for.

*Option 2 - Communication issues:*
Given the communication challenges we've experienced, I think it's best for both of us to part ways.

*Option 3 - General misalignment:*
Our working styles don't seem to be aligned, and I want to make sure you work with someone who's a better match.

Per our agreement, here's what happens next:

**1. REFUND**
I'm processing a refund of $[amount] to your original payment method. This should appear within 5-7 business days.

**2. COMPLETED WORK**
I've attached all work completed to date:
- [List files/exports]
- [Staging site access info if applicable - will be removed in 7 days]

**3. NEXT STEPS**
You're free to use this work with another developer. [Optional: I'd recommend reaching out to [developer name/resource] who might be a better fit.]

I wish you the best with your project.

Best regards,
Jon Gerton

---

### Template B: Client-Initiated Termination Acknowledgment

**Use when:** Client cancels the project.

**Subject:** RE: [Business Name] Project Cancellation Confirmed

---

Hi [Client Name],

I've received your request to cancel the [Business Name] website project.

Per our agreement:

**1. DEPOSIT**
The $250 deposit is non-refundable as it covered the discovery process, initial setup, and reserved project time.

**2. COMPLETED WORK**
[If work was done] I've attached what was completed:
- [List files]

[If no work done] Since we hadn't begun substantive work, there are no files to transfer.

**3. PROJECT CLOSED**
The project is now officially closed. [If staging site exists: The staging site will be removed within 7 days.]

If circumstances change and you'd like to restart in the future, feel free to reach out. A new deposit would be required.

Wishing you the best.

Jon Gerton

---

### Template C: Jon Terminating Due to Personal Circumstances

**Use when:** Jon needs to end project for personal/capacity reasons.

**Subject:** [Business Name] Project - Unable to Continue

---

Hi [Client Name],

I'm reaching out with difficult news. Due to [personal circumstances / an unexpected situation], I'm unable to continue with the [Business Name] website project.

I sincerely apologize for any inconvenience this causes. Here's what I'm doing to make this right:

**1. FULL REFUND**
I'm processing a complete refund of your $250 deposit. This should appear within 5-7 business days.

**2. COMPLETED WORK**
I've attached everything that was in progress:
- [List files]

**3. REFERRAL**
I'd recommend reaching out to [developer name or resource, e.g., "local WordPress developers on Upwork" or specific contact] who does similar work and may be able to help.

Again, I'm sorry for the disruption. Thank you for your understanding.

Best regards,
Jon Gerton

---

### Template D: Mutual Termination Agreement

**Use when:** Both parties agree to end the project.

**Subject:** [Business Name] Project - Mutual Termination Agreement

---

Hi [Client Name],

Per our conversation, we've agreed to end the [Business Name] website project.

Here's what we've agreed to:

**1. REFUND**
[State agreed refund amount and rationale]

**2. COMPLETED WORK**
I've attached all work completed to date:
- [List files]

**3. CONFIRMATION**
Please reply confirming you agree to these terms. Once confirmed, I'll process the refund and close the project.

**Summary of terms:**
- Deposit refund: $[amount]
- Work delivered: [description]
- Project status: Closed
- Future restart: Would require new deposit and agreement

Thank you for working through this professionally.

Best regards,
Jon Gerton

---

## Post-Termination Protocol

### Do

- Keep all communication professional and documented
- Process refunds promptly (within 24-48 hours)
- Deliver all completed work (even if relationship ended poorly)
- Save all correspondence for records
- Learn from the experience (update qualification process)

### Don't

- Engage in back-and-forth arguments
- Badmouth the client publicly
- Withhold work that was paid for
- Delay refunds as "punishment"
- Let emotions drive communication

### If Client Becomes Hostile

**First response:**
> "I've provided everything per our agreement. I won't be engaging further on this matter."

**If harassment continues:**
- Block email/phone
- Do not respond
- Document everything
- Consult attorney if threats made

### Review Policy

**If client leaves negative review:**
- Respond professionally and briefly
- State facts without emotion
- Example: "I'm sorry we weren't able to complete this project. Per our agreement, we provided [refund/work] and wish [Client] the best."
- Do not engage in public arguments

---

## Prevention Notes

Most terminations are preventable with proper qualification and clear agreements.

### Key Prevention Documents

| Document | What It Prevents |
|----------|-----------------|
| [08-client-qualification-checklist.md](../08-client-qualification-checklist.md) | Bad-fit clients from starting |
| [07-client-agreement-template.md](../07-client-agreement-template.md) | Scope creep and payment disputes |
| [05-payment-protection.md](../05-payment-protection.md) | Payment-related terminations |

### Red Flags to Catch Early

Watch for these during qualification:

| Red Flag | What It Signals |
|----------|-----------------|
| Haggling on fixed price | Will nickel-and-dime throughout |
| "Just a quick project" | Doesn't value the work |
| Unresponsive during discovery | Will disappear during project |
| Rude to you before paying | Will be worse after |
| Unrealistic timeline demands | Will never be satisfied |
| "My last developer ghosted me" | Pattern - they might be the problem |

### After Termination

Update qualification notes:
- What red flags did this client show?
- At what stage were they visible?
- How can the intake process catch this earlier?

---

## Quick Reference

**Scenario A (Client cancels, no work):** Deposit non-refundable

**Scenario B (Client cancels, work done):** Deposit non-refundable, deliver work

**Scenario C (Jon cancels, client issues):** Prorated refund, deliver work

**Scenario D (Jon cancels, Jon's issues):** Full refund, deliver work

**Scenario E (Mutual):** Negotiate refund, deliver work

**Key principle:** Always deliver completed work. Take the high road on refunds. Document everything.

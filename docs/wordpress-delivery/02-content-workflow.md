# Content Workflow

Complete process from client intake through content approval for $500 WordPress projects.

---

## 1. Intake Phase

### Step 1: Send Questionnaire

Send the [Client Questionnaire](./templates/client-questionnaire.md) within 24 hours of booking confirmation.

Email template:
```
Subject: Getting started on your website - Quick questionnaire

Hi [Name],

Excited to build your website! To get started, I need some information about your business.

Please fill out this quick questionnaire: [link to Google Doc copy]

Don't worry if you can't answer everything - we'll fill in the gaps on our call.

I'll reach out to schedule a 15-20 minute discovery call once I receive this.

- Jon
```

### Step 2: Schedule Discovery Call

15-20 minute call to:
- Fill gaps in the questionnaire
- Understand their ideal customer
- Learn what makes them different from competitors
- Discuss tone and style preferences
- Set expectations on timeline and content needs

### Step 3: Collect Existing Assets

Request from client:
- Logo files (PNG or SVG)
- Any existing photos
- Testimonials they want featured
- Content they've already written (if any)

Set a content deadline in writing:
```
Content deadline: [DATE]
Note: Timeline pauses if content not provided by this date.
```

---

## 2. Claude-Assisted Drafting

Adapt your drafting approach based on what the client provides.

### Scenario A: Client Provides Nothing

Most common scenario. Client has questionnaire answers and call notes, but no written content.

**Process:**
1. Review questionnaire + discovery call notes
2. Use Claude to draft full page copy for all pages
3. Review drafts for accuracy and client voice
4. Send drafts for client review

**Claude Prompts for Each Page Type:**

#### Home Page Hero Section

```
I'm building a website for [BUSINESS NAME], a [BUSINESS TYPE] serving [SERVICE AREA].

Key information:
- Main services: [LIST]
- Ideal customer: [DESCRIPTION]
- Key differentiator: [FROM CALL NOTES]
- CTA: [PREFERRED CTA - e.g., "Get a Free Quote"]

Write a home page hero section with:
- Headline (8 words max, speaks to customer problem or desire)
- Subheadline (1-2 sentences expanding on the headline)
- CTA button text

Tone: [PROFESSIONAL/FRIENDLY/CASUAL]
```

#### About Page Narrative

```
Write an About page for [BUSINESS NAME].

Background:
- Business type: [TYPE]
- Years in business: [X]
- Owner name: [NAME]
- Founding story: [FROM QUESTIONNAIRE]
- What makes them different: [FROM CALL NOTES]

Structure:
1. Opening hook (why they do what they do)
2. Brief history/founding story (2-3 sentences)
3. What they believe in or how they approach their work
4. Why customers choose them (2-3 key reasons)
5. Closing CTA to contact or view services

Keep it personal but professional. 200-300 words total.
Tone: [PROFESSIONAL/FRIENDLY/CASUAL]
```

#### Services Descriptions

```
Write service descriptions for [BUSINESS NAME], a [BUSINESS TYPE].

Services to describe:
1. [SERVICE 1]
2. [SERVICE 2]
3. [SERVICE 3]

For each service, write:
- Headline (the service name)
- Description (2-3 sentences covering what it is, who it's for, key benefit)
- 3-4 bullet points of what's included or key features

Target customer: [IDEAL CUSTOMER]
Tone: [PROFESSIONAL/FRIENDLY/CASUAL]
```

#### Contact Page Intro

```
Write a brief intro paragraph for a Contact page for [BUSINESS NAME].

Include:
- Welcoming opening
- What to expect when they reach out (response time, next steps)
- Gentle encouragement to take action

Keep it to 2-3 sentences. End with something like "Fill out the form below" or "Give us a call."
Tone: [PROFESSIONAL/FRIENDLY/CASUAL]
```

---

### Scenario B: Client Provides Headlines/Bullet Points

Client has the key points but not full paragraphs.

**Process:**
1. Collect client's headlines, bullet points, or rough notes
2. Use Claude to expand into full paragraphs while maintaining their voice
3. Review to ensure accuracy and that key points survived expansion
4. Send drafts for client review

**Claude Prompt for Expansion:**

```
The client provided these notes for their [PAGE NAME] page:

[PASTE CLIENT'S BULLETS/NOTES]

Expand these into full paragraphs suitable for a website. Maintain their key points and voice. Add transitions between ideas.

Business: [BUSINESS NAME], [BUSINESS TYPE]
Target customer: [IDEAL CUSTOMER]
Tone: [PROFESSIONAL/FRIENDLY/CASUAL]
```

---

### Scenario C: Client Provides Full Content

Rarest scenario. Client has complete written content.

**Process:**
1. Review client content for web readability
2. Use Claude to polish for web (shorter paragraphs, scannable, action-oriented)
3. Review for SEO opportunities (keywords, headings structure)
4. Minimal changes - mostly formatting

**Claude Prompt for Polishing:**

```
Polish this website content for better web readability:

[PASTE CLIENT'S CONTENT]

Make it:
- Scannable (shorter paragraphs, max 3-4 sentences each)
- Active voice where possible
- Break up any long blocks with subheadings if needed
- Keep the client's voice and key messages intact

Don't rewrite - just improve readability. Flag any confusing parts with [CLARIFY: question].
```

---

## 3. Review Cycle

### What's Included

**2 revision rounds included in $500**

A "revision" means:
- Tweaks to wording or phrasing
- Correcting factual errors
- Adjusting tone
- Small additions to existing content (a sentence or two)

### What Does NOT Count as a Revision

These are scope changes, not revisions:
- Adding new pages
- Major rewrites of approved content
- Adding new features (blog, e-commerce, booking)
- Design changes beyond color/font adjustments
- Content for pages not in original scope

### Additional Revisions

If client needs more than 2 rounds:

**Option 1: Per-round pricing**
$75 per additional revision round

**Option 2: Hourly**
$50/hour for revision work

Present both options and let client choose what works better for their situation.

---

## 4. Content Delays

### Timeline Pause Policy

If client doesn't provide content (photos, text, feedback) by the agreed deadline:

1. Timeline pauses until content arrives
2. No penalty to client - just a pause
3. Client may lose their spot in queue
4. Once content arrives, project resumes based on current availability

### Waiting on Content Email

Send after 3 days past content deadline:

```
Subject: Quick check-in on your website content

Hi [Name],

Just wanted to check in - I'm still waiting on [SPECIFIC ITEMS] to continue with your website.

Your current deadline was [DATE]. No rush or penalty, but I did want to let you know that your spot in my build queue is paused until I receive these.

Once you send them over, I'll let you know my next available window.

Let me know if you have any questions or need help putting together the content - happy to hop on a quick call.

- Jon
```

### Content Help Offer

If client is struggling with content, offer:
- Claude-assisted drafting from their rough notes ($0 extra if minimal)
- Full content writing as paid add-on ($150-250 depending on pages)

---

## 5. Approval Process

### Preview Review

1. Build site on staging URL (staging-[client].jongerton.com)
2. Send preview link to client
3. Password: share via one-time secret link

Preview email:
```
Subject: Your website is ready for review!

Hi [Name],

Your website draft is ready for you to review:

Preview URL: [STAGING URL]
Password: [ONE-TIME SECRET LINK]

Please review:
- All page content for accuracy
- Photos and images
- Contact information
- Spelling of names and addresses

Let me know what needs adjusting. You have 2 revision rounds included, so don't be shy about feedback!

Once you're happy with everything, just reply "Approved" and I'll prepare for launch.

- Jon
```

### Written Approval Required

Before moving to launch phase, get explicit written approval:
- Email reply saying "Approved" or "Looks good, ready to launch"
- Or text/message with same

Save this approval - it protects against "I never approved that" disputes.

### Approval Email Template

After receiving approval:

```
Subject: Approval confirmed - Launch prep starting

Hi [Name],

Great news - I've got your approval on record and I'm moving your site to launch prep.

What happens next:
1. I'll finalize everything and prep for migration to your hosting
2. I'll reach out to coordinate the DNS changes for go-live
3. Final 50% payment due before the site goes live

Expected launch date: [DATE]

Excited to get this live for you!

- Jon
```

---

## Quick Reference

| Phase | Timeline | Client Action |
|-------|----------|---------------|
| Questionnaire | Day 1 | Fill out and return |
| Discovery call | Day 2-3 | 15-20 min call |
| Content deadline | Day 5-7 | Provide photos, logo, feedback |
| First draft | Day 7-10 | Review preview |
| Revision 1 | Day 10-12 | Send feedback |
| Revision 2 | Day 12-14 | Send any final tweaks |
| Approval | Day 14 | Written approval |
| Launch prep | Day 15-17 | Pay final 50% |
| Go-live | Day 17-21 | DNS propagation |

Total timeline: 2-3 weeks (assuming client is responsive)

---

## Checklist

- [ ] Questionnaire sent
- [ ] Discovery call completed
- [ ] Content deadline set (in writing)
- [ ] Assets collected (logo, photos)
- [ ] Content drafted (Claude-assisted)
- [ ] Preview link sent
- [ ] Revision 1 completed
- [ ] Revision 2 completed (if needed)
- [ ] Written approval received
- [ ] Ready for handoff phase

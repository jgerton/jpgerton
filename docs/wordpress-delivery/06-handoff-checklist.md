# Handoff Checklist

Complete checklist for professional project delivery. Follow these steps in order for every client handoff.

---

## 1. Pre-Handoff Checklist (Before Final Payment)

Complete these items before requesting final payment:

- [ ] Client has approved staging site in writing (email or message confirmation)
- [ ] All revision rounds complete (2 included, additional billed)
- [ ] Content is final (no pending changes from client)
- [ ] Final invoice sent for remaining 50%
- [ ] Final payment received and cleared

**Do not proceed to migration until payment clears.**

---

## 2. Migration Checklist

Transfer site from staging to client hosting:

### Pre-Migration

- [ ] Client hosting credentials obtained (cPanel/hosting panel login)
- [ ] Verify client hosting meets requirements (PHP 7.4+, MySQL 5.7+, SSL available)
- [ ] Note client's domain (exactly as they want it: www vs non-www)

### Create Package

- [ ] Install Duplicator plugin on staging site (or All-in-One WP Migration)
- [ ] Create package/export of entire site
- [ ] Download package files to local machine

### Upload to Client Hosting

- [ ] Create empty database on client hosting
- [ ] Note database name, username, password
- [ ] Upload package files to client hosting root via FTP or File Manager
- [ ] Upload installer.php (if using Duplicator)

### Run Installation

- [ ] Navigate to client-domain.com/installer.php
- [ ] Enter database credentials
- [ ] Run through installation wizard
- [ ] Verify site URL is set correctly (not staging URL)

### Post-Migration

- [ ] Delete installer.php from server
- [ ] Delete archive files from server
- [ ] Go to Settings > Permalinks > Save (re-saves .htaccess)
- [ ] Test site loads at client domain
- [ ] Verify all pages work (not showing staging URLs)
- [ ] Test contact form submits successfully

---

## 3. DNS & SSL Checklist

Configure domain and security:

### DNS Configuration

- [ ] Identify client's domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
- [ ] Get DNS access or have client share screen
- [ ] Point A record to hosting IP address
- [ ] Point www CNAME to main domain (or hosting)
- [ ] Wait for DNS propagation (can take up to 48 hours, usually 15-60 minutes)
- [ ] Verify domain resolves to correct hosting

### SSL Certificate

- [ ] Activate SSL certificate in hosting panel (most hosts offer free Let's Encrypt)
- [ ] Wait for SSL to provision (usually instant, can take up to 24 hours)
- [ ] Verify https://domain.com loads without certificate errors
- [ ] Verify https://www.domain.com also works

### HTTPS Configuration

- [ ] Force HTTPS redirect in .htaccess or hosting panel
- [ ] Configure www/non-www redirect (pick one, redirect the other)
- [ ] Update WordPress Site URL to https if needed (Settings > General)
- [ ] Run search-replace if any http:// URLs remain in content

### DNS Verification

- [ ] Test: https://domain.com (should load site with padlock)
- [ ] Test: https://www.domain.com (should redirect or load with padlock)
- [ ] Test: http://domain.com (should redirect to https)
- [ ] Test: http://www.domain.com (should redirect to https)

---

## 4. Go-Live Verification

Comprehensive testing before handoff:

### All Pages Load

- [ ] Home page
- [ ] About page
- [ ] Services page
- [ ] Contact page
- [ ] Privacy Policy page
- [ ] Any additional pages

### Contact Form

- [ ] Submit test message through contact form
- [ ] Verify confirmation message displays
- [ ] Check form notification arrives at client email
- [ ] Check client spam folder if not in inbox
- [ ] Test WP Mail SMTP delivery (if installed)

### Interactive Elements

- [ ] Google Maps displays correctly (if embedded)
- [ ] Phone number is clickable (tel: link)
- [ ] Email address is clickable (mailto: link)
- [ ] Social media links open correct profiles
- [ ] CTA buttons link to correct destinations

### Images & Media

- [ ] All images load (no broken image icons)
- [ ] Logo displays correctly
- [ ] Favicon appears in browser tab
- [ ] Images are appropriately sized (not oversized files)

### Mobile Responsive

- [ ] Test on phone (or Chrome DevTools mobile view)
- [ ] Test on tablet
- [ ] Navigation menu works on mobile
- [ ] Text is readable without zooming
- [ ] Buttons are tap-friendly size

### SEO Settings

- [ ] Remove "Discourage search engines" checkbox (Settings > Reading)
- [ ] Verify XML sitemap exists (domain.com/sitemap_index.xml)
- [ ] Title tags display correctly
- [ ] Meta descriptions are set
- [ ] (Optional) Submit sitemap to Google Search Console

### Performance Quick Check

- [ ] Pages load within 3-4 seconds
- [ ] No console errors in browser DevTools
- [ ] Images aren't massively oversized

---

## 5. Credentials Transfer

Securely transfer all access credentials to client:

### Prepare Credentials Document

Gather all credentials into a single document:

```
WORDPRESS ADMIN
URL: https://[client-domain.com]/wp-admin
Username: [admin-username]
Password: [admin-password]

HOSTING PANEL
Provider: [hosting provider name]
URL: [hosting login URL]
Username: [hosting-username]
Password: [hosting-password]

DOMAIN REGISTRAR
Provider: [registrar name]
URL: [registrar login URL]
Username: [registrar-username]
Password: [registrar-password]

GOOGLE ANALYTICS (if Site Kit configured)
Connected to: [google-email]
View dashboard: WordPress Admin > Site Kit

CONTACT FORM NOTIFICATIONS
Sending to: [client-email]
```

### Create One-Time Secret Link

1. Go to [onetimesecret.com](https://onetimesecret.com)
2. Paste credentials document into the secret field
3. Set passphrase (optional but recommended)
4. Set expiration (7 days recommended)
5. Generate secret link
6. Copy the link (NOT the secret itself)

### Send to Client

- [ ] Create one-time secret link with all credentials
- [ ] Send link to client via email
- [ ] Include instructions: "This link expires after viewing. Save these credentials to your password manager or secure location."
- [ ] Remind client to save immediately
- [ ] If using passphrase, send passphrase in separate message

### Credentials Transfer Email Template

```
Subject: Your Website Credentials (Secure Link)

Hi [Client Name],

Your website is live at [domain.com]!

I've put together all your login credentials in a secure link below.
This link will expire after you view it, so please save these
credentials to your password manager or a secure location right away.

SECURE CREDENTIALS LINK:
[paste onetimesecret link]

[If using passphrase: The passphrase is: [passphrase]]

Let me know if you have any trouble accessing it!

Best,
Jon
```

---

## 6. Training Delivery

Provide documentation and walkthrough video:

### Customize Training Guide

- [ ] Open client training guide template
- [ ] Replace [Business Name] with client's business
- [ ] Replace [domain.com] with client's actual domain
- [ ] Replace [date] with delivery date
- [ ] Review and adjust sections based on what's on their site
- [ ] (Optional) Add relevant screenshots from their site

### Export Training Guide

- [ ] Export to PDF format
- [ ] Name file: "[Business-Name]-Website-Guide.pdf"
- [ ] Verify PDF formatting is clean

### Record Loom Walkthrough

Record a personalized video (5-10 minutes):

- [ ] Open Loom or screen recording tool
- [ ] Navigate to their live site
- [ ] Introduce: "Hi [Name], here's a quick walkthrough of your new website..."

**Cover These Topics:**

1. Show their site live in browser (celebrate the launch!)
2. How to log in to WordPress admin
3. Quick tour of the dashboard
4. How to edit text on a page (show their actual content)
5. How to change an image
6. How to add a blog post (if applicable)
7. What NOT to touch (emphasize this)
8. How to get help (contact info, warranty reminder)

**Tips for Professional Loom:**

- Say their business name multiple times (feels personal)
- Show their actual site on screen (not generic examples)
- Keep energy positive - celebrate the launch
- End with congratulations and support info

- [ ] Record video using their actual site
- [ ] Say their business name and domain
- [ ] Cover login, editing, and what not to touch
- [ ] Keep under 10 minutes
- [ ] Upload to Loom and copy share link
- [ ] Add video link to training guide

### Deliver Training Materials

- [ ] Attach PDF training guide to email
- [ ] Include Loom video link
- [ ] Send along with credentials (or in follow-up email)

---

## 7. Post-Handoff Email

Send completion email to client:

### Post-Handoff Email Template

```
Subject: [Business Name] Website is Live!

Hi [Client Name],

I'm excited to let you know that your website is now live at:
[domain.com]

Everything is set up and ready to go. Here's what you need:

1. LOGIN CREDENTIALS (secure link - save immediately)
[onetimesecret link]

2. YOUR WEBSITE GUIDE (PDF attached)
This covers how to make basic edits, add blog posts,
and what not to touch. Keep it handy!

3. VIDEO WALKTHROUGH
I recorded a personalized walkthrough of your site:
[Loom link]

IMPORTANT REMINDERS:
- Your 30-day warranty starts today ([date])
- This covers bugs (things that worked but stopped working)
- For content changes or new features, reach out and
  I'll provide a quote
- Email me at support@jpgerton.com if you run into any issues

It's been great working with you, and I hope your new website
brings you plenty of new business!

If you're happy with the work, I'd really appreciate a
quick Google review: [Google review link - optional]

Best,
Jon Gerton
jpgerton.com
```

### Email Checklist

- [ ] Use client's name and business name
- [ ] Include live website URL
- [ ] Attach training PDF
- [ ] Include Loom video link
- [ ] Include credentials link
- [ ] State warranty start date and terms
- [ ] Provide support email
- [ ] (Optional) Request Google review

---

## 8. Internal Cleanup

Post-handoff administrative tasks:

### Warranty Tracking

- [ ] Note warranty end date (30 days from handoff)
- [ ] Add reminder to calendar for warranty expiration
- [ ] Document any specific issues to watch for

### Staging Site Cleanup

- [ ] Set reminder to archive staging site (30 days post-handoff)
- [ ] After warranty period: Delete staging site
- [ ] Remove from staging site list

### Project Documentation

- [ ] Update project tracking (internal)
- [ ] Note any lessons learned
- [ ] Archive client files (questionnaire, content, assets)

### Follow-Up Schedule

- [ ] 2 weeks post-launch: Follow up for testimonial
- [ ] 30 days: Warranty expiration (optional check-in)
- [ ] (Optional) 90 days: Check-in for maintenance package offer

### Testimonial Request Template (2 Weeks Post-Launch)

```
Subject: Quick favor?

Hi [Client Name],

I hope the website is working great for you! It's been
about two weeks since launch - are you seeing some
traction yet?

If you're happy with how things turned out, would you
mind leaving a quick review? Even a sentence or two
makes a big difference for my business.

[Google review link]

No pressure at all - just thought I'd ask!

Best,
Jon
```

---

## Quick Reference Checklist

Copy this condensed version for fast reference during handoffs:

```
PRE-HANDOFF
[ ] Client approved staging in writing
[ ] All revisions complete
[ ] Final payment received

MIGRATION
[ ] Package created on staging
[ ] Uploaded to client hosting
[ ] Installation complete
[ ] Permalinks re-saved
[ ] Installer files deleted

DNS & SSL
[ ] DNS pointing to hosting
[ ] SSL certificate active
[ ] Force HTTPS enabled
[ ] www/non-www redirect set

GO-LIVE VERIFICATION
[ ] All pages load
[ ] Contact form works
[ ] Mobile responsive
[ ] "Discourage search engines" unchecked

CREDENTIALS & TRAINING
[ ] One-time secret link created and sent
[ ] Training PDF customized and sent
[ ] Loom video recorded and sent

POST-HANDOFF
[ ] Warranty end date noted
[ ] Staging cleanup reminder set
[ ] Testimonial follow-up scheduled (2 weeks)
```

---

*Part of WordPress Delivery System documentation*
*Last updated: 2026-02-04*

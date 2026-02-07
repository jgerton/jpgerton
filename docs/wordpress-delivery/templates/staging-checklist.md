# Staging Site Checklist

**Purpose:** Quick-reference checklist for setting up each new client staging site

Copy this template for each new project. Target: complete setup in under 30 minutes.

---

## Project Details

**Client:** _______________

**Subdomain:** staging-_______________.jongerton.com

**Date Created:** _______________

**Project Start Date:** _______________

---

## Setup Phase (< 30 min target)

### Subdomain & WordPress (10 min)

- [ ] Create subdomain in hosting panel: `staging-[clientname].jongerton.com`
- [ ] Verify subdomain resolves (may take 5-10 min)
- [ ] Install WordPress via one-click installer
- [ ] Log in to wp-admin
- [ ] Set admin username (NOT "admin"): _______________
- [ ] Store credentials in password manager

### Theme & Plugins (10 min)

**Theme:**
- [ ] Install Kadence theme
- [ ] Activate Kadence

**Essential Plugins:**
- [ ] Install Kadence Blocks
- [ ] Install Wordfence
- [ ] Install UpdraftPlus
- [ ] Install Rank Math
- [ ] Install WP Mail SMTP
- [ ] Install Site Kit by Google
- [ ] Install Duplicator

**Optional:**
- [ ] Install Kadence Starter Templates (if using base layout)
- [ ] Other: _______________

### Protection (5 min)

**noindex (prevents Google indexing):**
- [ ] Settings > Reading > "Discourage search engines from indexing this site" = CHECKED
- [ ] Rank Math > General Settings > Verify noindex active

**Password protection (prevents public viewing):**
- [ ] Method chosen: [ ] Passster / [ ] .htpasswd / [ ] Coming Soon plugin
- [ ] Password protection active and tested
- [ ] Preview password: _______________

### Initial Configuration (5 min)

- [ ] Delete default plugins (Hello Dolly, Akismet if not using)
- [ ] Delete default themes (Twenty Twenty-*, etc.)
- [ ] Configure Wordfence firewall
- [ ] Enable 2FA on admin account
- [ ] Run Rank Math setup wizard (basic)

---

## Client Preview Access

**Preview URL:** https://staging-_______________.jongerton.com

**Preview Password:** _______________

**Sent to client:** [ ] Yes, on date: _______________

**Client instructions given:**
- [ ] Explained this is preview only
- [ ] Explained final site will be at their domain
- [ ] Explained how to provide feedback

---

## Build Phase Tracking

**Content received:** [ ] Complete / [ ] Partial / [ ] Waiting

**Pages built:**
- [ ] Home
- [ ] About
- [ ] Services
- [ ] Contact
- [ ] Privacy Policy
- [ ] Additional: _______________
- [ ] Additional: _______________

**Client approvals:**
- [ ] Content approved
- [ ] Design approved
- [ ] Ready for migration

---

## Migration Phase

### Pre-Migration

- [ ] Client hosting access obtained
  - Host: _______________
  - Login method: _______________

- [ ] Database created on client hosting
  - DB Name: _______________
  - DB User: _______________
  - DB Password: _______________
  - DB Host: _______________

- [ ] Client domain pointed to hosting
- [ ] Installation directory is empty

### Duplicator Package

- [ ] Duplicator package created on staging
- [ ] Package name: _______________
- [ ] Package size: _______________MB
- [ ] archive.zip downloaded
- [ ] installer.php downloaded
- [ ] Both files uploaded to client hosting

### Installer Process

- [ ] Navigated to clientdomain.com/installer.php
- [ ] Database credentials entered
- [ ] URL replacement verified:
  - Old: staging-[client].jongerton.com
  - New: _______________
- [ ] Installation completed successfully

### Post-Migration Verification

- [ ] Logged in to production wp-admin
- [ ] Permalinks re-saved (Settings > Permalinks > Save)
- [ ] SSL verified (https:// shows padlock)
- [ ] Contact form tested (email received)
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Mobile responsive verified

### Security Cleanup

- [ ] installer.php DELETED from production
- [ ] installer-backup.php DELETED (if present)
- [ ] archive.zip DELETED from production
- [ ] dup-installer/ folder DELETED (if present)

### Go-Live

- [ ] "Discourage search engines" UNCHECKED on production
- [ ] Password protection REMOVED on production
- [ ] Sitemap submitted to Google Search Console
- [ ] Client notified site is live

---

## Cleanup Phase (30 Days Post-Launch)

**Launch Date:** _______________

**30-Day Mark:** _______________

### Archive (Day 30)

- [ ] Final Duplicator package created from staging
- [ ] Archive downloaded and stored locally
- [ ] Archive location: _______________
- [ ] Screenshot of final staging saved

### Deletion (Day 31+)

- [ ] Staging subdomain deleted
- [ ] Project marked as "archived" in tracking
- [ ] Deletion date: _______________

---

## Notes

_Use this space for project-specific notes, issues encountered, or special requirements._

```




```

---

## Quick Links

- [Starter Template Guide](../01-starter-template-guide.md) - Full plugin list and config
- [Staging Setup Guide](../03-staging-setup-guide.md) - Detailed procedures
- [Client Questionnaire](./client-questionnaire.md) - Intake template

---

*Checklist Version: 1.0*
*Last Updated: February 2026*

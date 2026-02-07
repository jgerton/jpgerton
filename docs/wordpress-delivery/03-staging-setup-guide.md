# Staging Setup Guide

**Version:** 1.0
**Last Updated:** February 2026
**Purpose:** Spin up client staging sites, protect from indexing, and migrate to production

---

## Overview

All $500 WordPress sites are built on Jon's controlled staging environment before migrating to client hosting at launch. This approach provides:

- **Full control** during development (no client interference)
- **Consistent environment** (same server, same plugins, same workflow)
- **Preview capability** (clients can review progress at staging URL)
- **Clean handoff** (migration happens once, at launch)

**Staging environment:** staging.jongerton.com (Jon's hosting)
**Target time:** Under 30 minutes from start to development-ready staging site

---

## Creating a New Staging Site

### Step 1: Create Subdomain (5 min)

**Subdomain pattern:** `staging-[clientname].jongerton.com`

Examples:
- staging-acmeplumbing.jongerton.com
- staging-rivervalleycleaning.jongerton.com
- staging-smithlawncare.jongerton.com

**In hosting control panel (cPanel/Plesk/hosting-specific):**

1. Navigate to Subdomains or Domains section
2. Create new subdomain: `staging-[clientname]`
3. Document root: `/public_html/staging-[clientname]` or equivalent
4. Wait for subdomain to propagate (usually instant, sometimes 5-10 minutes)

### Step 2: Install WordPress (5 min)

**Using hosting one-click installer:**

1. Navigate to WordPress installer (Softaculous, Installatron, or hosting-specific)
2. Select the staging subdomain as installation location
3. Set site title: `[Client Business Name] - Preview`
4. Create admin credentials:
   - Username: NOT "admin" (use `[clientname]_admin` or similar)
   - Password: Strong generated password (save in password manager)
   - Email: Your admin email
5. Install WordPress

**Immediately after installation:**
- Log in to wp-admin
- Note the temporary password somewhere secure

### Step 3: Initial Configuration (10 min)

**Theme setup:**

1. Go to Appearance > Themes > Add New
2. Search "Kadence"
3. Install and Activate Kadence theme

**Plugin installation:**

Install these plugins from Plugins > Add New:

1. **Kadence Blocks** - Search "Kadence Blocks", Install, Activate
2. **Wordfence** - Search "Wordfence", Install, Activate
3. **UpdraftPlus** - Search "UpdraftPlus", Install, Activate
4. **Rank Math** - Search "Rank Math SEO", Install, Activate
5. **WP Mail SMTP** - Search "WP Mail SMTP", Install, Activate
6. **Site Kit by Google** - Search "Site Kit", Install, Activate
7. **Duplicator** - Search "Duplicator", Install, Activate

### Step 4: Apply Staging Protection (5 min)

**Critical:** Staging sites must be protected from search engines AND public access.

**Protection Layer 1: WordPress built-in noindex**

1. Go to Settings > Reading
2. Check "Discourage search engines from indexing this site"
3. Save Changes

**Protection Layer 2: Rank Math noindex (double-check)**

1. Go to Rank Math > General Settings > Links
2. Ensure "Noindex Empty Category and Tag Archives" is enabled
3. Go to Rank Math > Titles & Meta > Global Meta
4. Verify noindex is active for the site

**Protection Layer 3: Password protection**

Choose one method:

**Option A: Passster plugin (Recommended for simplicity)**
1. Install Passster plugin
2. Go to Settings > Passster
3. Enable site-wide protection
4. Set password
5. Share password with client for preview access

**Option B: .htpasswd (If comfortable with hosting)**
1. Create `.htpasswd` file with encrypted password
2. Add to `.htaccess`:
```apache
AuthType Basic
AuthName "Staging Preview"
AuthUserFile /path/to/.htpasswd
Require valid-user
```

**Option C: Coming Soon page**
1. Install SeedProd or similar coming soon plugin
2. Enable "Coming Soon" mode
3. Logged-in users can see actual site
4. Public sees "Coming Soon" page

### Step 5: Create Client Preview Access (5 min)

1. Document the staging URL: `https://staging-[clientname].jongerton.com`
2. Document the preview password
3. Send client the preview link with password
4. Explain: "This is a preview site only. The final site will be at your domain."

---

## Staging Protection: Why Both noindex AND Password

| Protection | What it prevents | What it doesn't prevent |
|------------|------------------|-------------------------|
| noindex | Google/Bing indexing | People with the URL can still view |
| Password | Public viewing | Nothing (full protection) |

**noindex alone is not enough:**
- Clients might share the staging link
- Competitors could stumble on it
- Content could be scraped before launch

**Password alone is not enough:**
- Some crawlers ignore robots.txt
- SSL certificate enumeration can reveal subdomains
- Better safe than sorry with duplicate content

**Use both.** Takes 2 extra minutes. Prevents headaches.

---

## Migration Process: Staging to Production

### Pre-Migration Checklist

Before starting migration:

- [ ] Client has approved staging site content
- [ ] Client hosting is set up and accessible
- [ ] Client domain is registered and pointed to hosting
- [ ] SSL certificate is ready (Let's Encrypt or hosting-provided)
- [ ] You have FTP/SFTP or file manager access to client hosting
- [ ] You have database credentials for client hosting

### Step 1: Prepare Client Hosting

**Create empty database on client hosting:**

1. Log in to client hosting control panel
2. Navigate to MySQL Databases (or database section)
3. Create new database (name: `[clientname]_wp` or similar)
4. Create database user with strong password
5. Add user to database with ALL PRIVILEGES
6. Document: database name, username, password, host (usually `localhost`)

**Ensure installation directory is empty:**
- The Duplicator installer needs an empty directory
- Remove any default index.html or WordPress installation
- Target: `public_html/` or `www/` should be empty

### Step 2: Create Duplicator Package on Staging

1. Go to Duplicator > Packages in staging wp-admin
2. Click "Create New"
3. **Name:** `[clientname]-launch-[date]` (e.g., acme-launch-2026-02-15)
4. **Storage:** Default (local)
5. Click "Next" to run scan
6. Review scan results (should all be green/passing)
7. Click "Build"
8. Wait for build to complete (1-5 minutes depending on site size)

**Download both files:**
- `[package-name]_archive.zip` (site files + database)
- `[package-name]_installer.php` (migration wizard)

Save these locally as backup.

### Step 3: Upload to Client Hosting

**Using FTP/SFTP or File Manager:**

1. Connect to client hosting
2. Navigate to web root (`public_html/` or `www/`)
3. Upload both files:
   - `[package-name]_archive.zip`
   - `[package-name]_installer.php`
4. Wait for upload to complete (zip file may take several minutes)

### Step 4: Run Duplicator Installer

1. Navigate to: `https://clientdomain.com/installer.php`
2. Accept terms and conditions
3. **Database connection:** Enter the credentials you created:
   - Host: `localhost` (usually)
   - Name: The database you created
   - User: The database user you created
   - Password: The database user password
4. Click "Test Database" to verify connection
5. Click "Next" to continue

**URL replacement:**
- Duplicator automatically detects old URL (staging) and new URL (production)
- Verify the replacement looks correct
- Old: `https://staging-[clientname].jongerton.com`
- New: `https://clientdomain.com`

6. Click "Next" to run installation
7. Wait for extraction and database import (2-10 minutes)

### Step 5: Post-Migration Tasks

**Immediately after installer completes:**

1. **Log in to production wp-admin**
   - Use same credentials as staging
   - Verify you can access the dashboard

2. **Re-save permalinks**
   - Go to Settings > Permalinks
   - Don't change anything, just click "Save Changes"
   - This regenerates .htaccess rules
   - **Critical:** Fixes 99% of "pages not loading" issues

3. **Verify SSL**
   - Visit site via https://
   - Check for padlock in browser
   - If mixed content warnings, see troubleshooting below

4. **Delete installer files**
   - **Security critical:** Delete these from the server immediately
   - Delete: `installer.php`
   - Delete: `installer-backup.php` (if present)
   - Delete: `[package-name]_archive.zip`
   - Delete: `dup-installer/` folder (if present)
   - Duplicator will show a warning if these exist

5. **Test critical functions**
   - [ ] Contact form submits and email arrives
   - [ ] All pages load correctly
   - [ ] Images display properly
   - [ ] Mobile responsive working
   - [ ] SSL shows secure on all pages

6. **Remove staging protections**
   - Go to Settings > Reading
   - UNCHECK "Discourage search engines from indexing this site"
   - Remove password protection if installed
   - Submit sitemap to Google Search Console

---

## Common Migration Issues and Fixes

### Mixed Content Warnings (https with http resources)

**Symptom:** Padlock shows warning, some images/resources blocked

**Fix:**
1. Install "Better Search Replace" plugin
2. Go to Tools > Better Search Replace
3. Search: `http://clientdomain.com`
4. Replace: `https://clientdomain.com`
5. Select all tables
6. Run (with "dry run" first to preview changes)

Also check:
- Hardcoded http:// in page content
- Theme settings with old URLs
- Custom CSS with image URLs

### Broken Images

**Symptom:** Images show broken icon or don't load

**Causes & fixes:**
1. **Wrong file paths:** Check Media Library, regenerate thumbnails with "Regenerate Thumbnails" plugin
2. **Permission issues:** Set folder permissions to 755, file permissions to 644
3. **Upload path mismatch:** Check Settings > Media for upload path settings

### 404 Errors on All Pages (Except Home)

**Symptom:** Home page works, all other pages 404

**Fix:**
1. Go to Settings > Permalinks
2. Click "Save Changes" (without changing anything)
3. This regenerates .htaccess

If that doesn't work:
1. Check if .htaccess file exists in web root
2. Verify WordPress has write permissions
3. Manually add WordPress rewrite rules to .htaccess

### CSS/Styling Not Loading

**Symptom:** Site looks broken, no styling

**Causes & fixes:**
1. **Cache plugin:** Purge all caches, regenerate CSS
2. **SSL mismatch:** Ensure all URLs use https://
3. **Wrong site URL:** Check Settings > General for correct URL
4. **File permissions:** CSS files need 644 permissions

### Database Connection Error

**Symptom:** "Error establishing database connection"

**Fix:**
1. Verify database credentials in wp-config.php
2. Check database user has proper permissions
3. Verify database host (usually `localhost`, sometimes `127.0.0.1`)
4. Ensure database exists and wasn't deleted

### White Screen of Death

**Symptom:** Blank white page, no error message

**Debug steps:**
1. Enable debug mode in wp-config.php:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```
2. Check /wp-content/debug.log for errors
3. Common causes: PHP version mismatch, memory limit, plugin conflicts

---

## Why Duplicator Over All-in-One WP Migration

| Feature | Duplicator (Free) | All-in-One WP Migration (Free) |
|---------|-------------------|-------------------------------|
| Deploy to empty server | Yes | No (needs WordPress installed first) |
| Database credentials | You enter them | Uses existing wp-config |
| Max file size (free) | 500MB | 512MB (similar) |
| Works without dashboard | Yes (installer.php) | No (requires wp-admin) |
| Disaster recovery | Better | Limited |

**Duplicator advantages for staging workflow:**
- Can deploy to completely empty hosting (no WordPress pre-install needed)
- More control over database replacement
- Works even if wp-admin is inaccessible (useful for recovery)
- Creates true server-to-server copy

**When to use All-in-One WP Migration:**
- Migrating between existing WordPress installs
- Client needs to do their own migration (simpler interface)
- Very large sites (paid version handles unlimited size)

---

## Staging Site Cleanup Schedule

### Cleanup Timeline

| Milestone | Action |
|-----------|--------|
| Launch day | Migration complete, production live |
| Launch + 7 days | Verify production stable |
| Launch + 30 days | Archive staging, matches warranty period |
| Launch + 31 days | Delete staging subdomain |

### Archive Process (Day 30)

Before deleting staging:

1. **Create final Duplicator package** of staging site
   - Name: `[clientname]-archive-[date]`
   - Download both archive.zip and installer.php

2. **Store archive locally**
   - Create folder: `Archives/[clientname]/`
   - Save: archive.zip, installer.php
   - Save: client questionnaire, any notes
   - Optional: Screenshot of home page

3. **Update project log**
   - Note archive date
   - Note storage location
   - Mark project as "archived"

### Delete Process (Day 31+)

1. Delete staging subdomain from hosting
2. Remove from WordPress multisite (if applicable)
3. Update any internal tracking

### Why 30 Days?

- Matches bug fix warranty period
- Allows for any "launch panic" fixes
- Gives time to discover missed issues
- Not so long that staging sites accumulate

### Monthly Cleanup Routine

On the 1st of each month:
1. Review all active staging sites
2. Identify any past 30-day mark
3. Archive and delete as needed
4. Keeps staging environment clean

---

## Quick Reference: Migration Commands

**Create package (staging):**
```
Duplicator > Packages > Create New > Build
```

**Database creation (client hosting):**
```
MySQL Databases > Create Database > [name]
MySQL Databases > Create User > [user/pass]
MySQL Databases > Add User to Database > ALL PRIVILEGES
```

**Installer URL:**
```
https://clientdomain.com/installer.php
```

**Post-migration permalinks fix:**
```
Settings > Permalinks > Save Changes
```

**Search and replace (if needed):**
```
Tools > Better Search Replace
Search: http://old-url.com
Replace: https://new-url.com
```

---

## Security Reminders

- **Never** leave installer.php on production server
- **Always** use strong, unique passwords for staging admin
- **Always** enable 2FA on staging wp-admin (Wordfence)
- **Never** share staging database credentials publicly
- **Always** verify SSL is working before going live
- **Always** remove noindex setting after migration

---

## Related Documents

- [Starter Template Guide](./01-starter-template-guide.md) - Theme and plugin stack
- [Staging Checklist](./templates/staging-checklist.md) - Quick setup reference

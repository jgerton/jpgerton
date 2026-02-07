# Hosting Requirements Document

**Version:** 1.0
**Last Updated:** February 2026
**Purpose:** Verify client hosting meets WordPress requirements before migration
**When to Use:** After agreement signed, before migration attempt

---

## Why This Matters

Migration troubleshooting on inadequate hosting is unpaid time. Verify hosting meets requirements BEFORE attempting migration. If it doesn't, that's a change order conversation - not free troubleshooting.

---

## Minimum Requirements

Site will not work properly without these. Do not attempt migration if any are missing.

| Requirement | Minimum | Recommended | Notes |
|-------------|---------|-------------|-------|
| **PHP Version** | 7.4 | 8.1 or 8.2 | WordPress 6.x requires PHP 7.4+ |
| **MySQL Version** | 5.7 | 8.0 | Or MariaDB 10.3+ |
| **PHP Memory Limit** | 256MB | 512MB | Some hosts default to 128MB (too low) |
| **Max Upload Size** | 64MB | 128MB | For media uploads |
| **HTTPS/SSL** | Required | Free Let's Encrypt | SEO and security essential |
| **mod_rewrite** | Required | - | For pretty permalinks |

---

## Recommended Requirements

These aren't blockers but significantly improve performance and reliability.

| Requirement | Why It Matters |
|-------------|----------------|
| **PHP 8.1 or 8.2** | Better performance, security updates |
| **SSD Storage** | 5-10x faster than HDD |
| **50MB+ Available Disk** | Space for WordPress + theme + plugins |
| **GZIP Compression** | Reduces page load time |
| **Server-Level Caching** | Better than plugin-only caching |
| **HTTP/2 Support** | Faster asset loading |

---

## How to Check Requirements

### Option A: Ask the Hosting Provider

Send this message to client's hosting support:

> "Can you confirm the following for my account:
> - PHP version (need 7.4+, prefer 8.0+)
> - PHP memory limit (need 256MB minimum)
> - MySQL/MariaDB version (need MySQL 5.7+ or MariaDB 10.3+)
> - SSL certificate availability
> - mod_rewrite status"

### Option B: Check via cPanel

If client has cPanel access:

1. **PHP Version:** Look for "Select PHP Version" or "MultiPHP Manager"
2. **MySQL Version:** Open phpMyAdmin, version shown on home page
3. **PHP Memory:** In PHP Selector, check "memory_limit" value
4. **SSL:** Look for "SSL/TLS Status" or "Let's Encrypt"

### Option C: Upload phpinfo File

Create a temporary PHP file to check settings:

```php
<?php
// upload as info.php, delete after checking
phpinfo();
?>
```

Upload to site root, visit `yoursite.com/info.php`, then **delete immediately** (security risk if left public).

Key values to find:
- `PHP Version` at the top
- `memory_limit` under Core
- `upload_max_filesize` under Core
- `mysqli` section shows MySQL info

---

## Common Hosting Providers Reference

Quick reference for typical configurations. Verify with actual account settings.

| Provider | PHP | Memory | SSL | Notes |
|----------|-----|--------|-----|-------|
| **SiteGround** | 8.1+ | 768MB+ | Free | Recommended for WordPress, excellent support |
| **WP Engine** | 8.1+ | 512MB+ | Free | Premium managed hosting, excellent but expensive |
| **Cloudways** | 8.1+ | 512MB+ | Free | Good performance, developer-friendly |
| **DreamHost** | 8.1+ | 256MB+ | Free | Solid value, good for small businesses |
| **Bluehost** | 8.0+ | 256MB | Free | Adequate, can be slow on shared plans |
| **HostGator** | 7.4+ | 256MB | Free | Basic, works for simple sites |
| **GoDaddy** | 8.0+ | 256MB | Paid | Often needs upgrades, SSL extra cost |
| **Namecheap** | 8.0+ | 256MB | Free | Budget option, acceptable |
| **Cheap Shared** | Varies | Often 128MB | Varies | Check carefully, often inadequate |

### Green Light Hosts

These typically work well out of the box:
- SiteGround (any plan)
- WP Engine
- Cloudways
- Flywheel
- Kinsta

### Yellow Light Hosts

These usually work but verify settings:
- Bluehost
- DreamHost
- HostGator
- A2 Hosting
- InMotion

### Red Light Hosts

Proceed with caution, often problematic:
- Free hosting (000webhost, etc.)
- Bottom-tier GoDaddy plans
- Unknown/obscure hosts
- Any host with 128MB memory limit

---

## Hosting Check Conversation Script

### Initial Email to Client

Send after agreement signed, before migration:

> Hi [Client Name],
>
> Before I migrate your site, I need to verify your hosting meets WordPress requirements. Can you send me:
>
> 1. Your hosting provider name and plan level
> 2. Your cPanel or hosting panel login (use onetimesecret.com for secure sharing)
>
> Alternatively, you can check with your host support and confirm:
> - PHP version (need 7.4+, prefer 8.0+)
> - PHP memory limit (need 256MB minimum)
> - MySQL version (need 5.7+)
> - SSL certificate available (need HTTPS)
>
> If any of these don't meet the specs, we'll discuss options before I attempt migration.
>
> Thanks,
> Jon

### Follow-Up If Hosting Fails Requirements

> Hi [Client Name],
>
> I checked your hosting and found [specific issue]. Here are your options:
>
> 1. **Upgrade your current plan** - Contact [host] support and ask them to [specific upgrade]. This is usually $X/month more.
>
> 2. **Switch to a recommended host** - I recommend SiteGround for WordPress. They have plans starting at $X/month with all requirements met. Migration assistance would be a change order at $X.
>
> 3. **Have your host fix it** - Sometimes hosts can increase PHP memory limit on request. Worth asking.
>
> Let me know which option works for you, and we'll proceed from there.
>
> Jon

---

## Problem Scenario Responses

### "My hosting says 128MB memory limit"

> That's below WordPress minimums. Many hosts default to 128MB but can increase it. First, ask your host: "Can you increase my PHP memory limit to 256MB?" If they say no, you'll need to upgrade your plan or switch hosts. I recommend SiteGround if you're open to switching.

### "They're running PHP 7.2"

> PHP 7.2 is end-of-life and no longer receives security updates. Most hosts can upgrade your PHP version in the control panel. Look for "PHP Selector" or "MultiPHP Manager" in cPanel. If you can't find it, ask support to upgrade to PHP 8.1.

### "SSL costs extra"

> Free SSL is standard in 2026. Most hosts include Let's Encrypt free. If yours charges extra ($50-100/year), consider whether that ongoing cost is worth it vs. switching to a host like SiteGround that includes it. SSL is essential for SEO and trust.

### "I don't know how to check"

> No problem. Share your hosting login with me via onetimesecret.com and I'll verify for you. I just need temporary access to check the settings.

### "My cousin set up the hosting and I don't have access"

> You'll need to get that access before we can proceed. Contact your cousin or the hosting provider directly. They can reset credentials to your email address.

### "The hosting is included with my domain"

> Domain registrars (GoDaddy, Namecheap, etc.) often bundle basic hosting, but it's usually underpowered. Let me check the specs before we proceed. You may need to upgrade or switch to dedicated WordPress hosting.

---

## What To Do If Hosting Fails Requirements

### Step 1: Document the Issues

Note specifically what's failing:
- PHP version: ___
- Memory limit: ___
- MySQL version: ___
- SSL status: ___
- Other issues: ___

### Step 2: Present Options to Client

**Before attempting migration**, communicate:

1. **Client upgrades hosting plan** (their cost) - Often the simplest path
2. **Client switches to recommended host** (their cost, Jon can assist as change order)
3. **Client handles independently** - Provide recommendations, they manage the switch

### Step 3: Change Order for Hosting Assistance

If client wants help with hosting issues beyond basic verification:

| Service | Change Order Price |
|---------|-------------------|
| Researching hosting options | $50 |
| Coordinating with host support | $50/hour |
| Assisting with host migration | $100-200 |
| Setting up new hosting account | $50 |

**This is not included in $500 package.** The package covers migration TO adequate hosting, not fixing inadequate hosting.

---

## Quick Reference Checklist

Print this for use during hosting verification.

```
HOSTING REQUIREMENTS CHECKLIST

Client: _______________
Host: _________________
Plan: _________________

MINIMUM (Required)
[ ] PHP 7.4+ ........... Actual: _____
[ ] MySQL 5.7+ ......... Actual: _____
[ ] 256MB memory ....... Actual: _____
[ ] SSL available ...... [ ] Yes [ ] No
[ ] mod_rewrite ....... [ ] Yes [ ] No

RECOMMENDED (Nice to have)
[ ] PHP 8.1/8.2
[ ] SSD storage
[ ] 512MB+ memory
[ ] Server caching

RESULT
[ ] Proceed - All requirements met
[ ] Issues found - Change order needed:
    ________________________________
[ ] Not adequate - Client must upgrade/switch
```

---

## Related Documents

- [Staging Setup Guide](03-staging-setup-guide.md) - Use after hosting verified
- [Scope Control Template](04-scope-control-template.md) - Change order pricing
- [Payment Protection](05-payment-protection.md) - Payment for additional work

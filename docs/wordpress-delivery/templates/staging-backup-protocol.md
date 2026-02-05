# Staging Server Backup Protocol

**Purpose:** Protect client work and Jon's staging environment from data loss.

---

## Backup Schedule

### Automated Backups (Recommended Setup)

| Backup Type | Frequency | Retention | Tool |
|-------------|-----------|-----------|------|
| Full site backup | Daily | 7 days | UpdraftPlus |
| Database only | Every 6 hours | 48 hours | UpdraftPlus |
| Off-site copy | Weekly | 30 days | Google Drive/Dropbox |

---

## UpdraftPlus Configuration

### Recommended Settings for Staging Sites

1. **Files backup schedule:** Daily, retain 7 backups
2. **Database backup schedule:** Every 6 hours, retain 8 backups
3. **Remote storage:** Google Drive (free 15GB) or Dropbox
4. **Include in files backup:**
   - [x] Plugins
   - [x] Themes
   - [x] Uploads
   - [ ] Other directories (optional)
5. **Email notification:** On backup failure only

### Setup Checklist

- [ ] Install UpdraftPlus on staging server
- [ ] Connect Google Drive or Dropbox account
- [ ] Configure backup schedule
- [ ] Run initial full backup
- [ ] Verify backup can be restored (test once)

---

## Manual Backup Triggers

### When to Run Manual Backup

| Event | Action |
|-------|--------|
| Before major theme/plugin update | Full backup |
| Before client review session | Database backup |
| Before migration to production | Full backup |
| Before deleting staging site | Full backup + download |

### Manual Backup Command

1. Go to **Settings > UpdraftPlus Backups**
2. Click **Backup Now**
3. Select: [x] Include database [x] Include files
4. Wait for completion
5. Verify backup appears in remote storage

---

## Per-Client Backup Protocol

### During Active Project

| Milestone | Backup Action |
|-----------|---------------|
| Staging site created | Initial backup + verify |
| Content entry complete | Full backup |
| Before revision round | Database backup |
| Client approval received | Full backup |
| Before migration | Full backup + download local copy |

### After Project Complete

1. **Migration day:**
   - Full backup of staging site
   - Download backup files locally
   - Store in client folder: `Clients/[ClientName]/Backups/`

2. **Archive period (30 days):**
   - Keep staging site password-protected
   - Maintain automated backups
   - No manual intervention needed

3. **Cleanup (Day 31+):**
   - Download final backup
   - Delete staging site
   - Keep local backup for 1 year

---

## Disaster Recovery

### If Staging Server Fails

1. **Don't panic** - backups exist in Google Drive/Dropbox
2. Set up new staging environment (Local by WP or new subdomain)
3. Install WordPress + UpdraftPlus
4. Connect to same cloud storage
5. Restore from most recent backup
6. Verify site works
7. Notify affected clients if delays expected

### If Individual Site Corrupted

1. Identify when corruption occurred
2. Find backup from before that time
3. Restore from backup
4. Re-apply any changes made since backup
5. Document what caused corruption (for prevention)

---

## Local Backup Storage Structure

```
Clients/
  [ClientName]/
    Backups/
      staging-[date]-full.zip
      staging-[date]-db.sql.gz
      production-launch-[date].zip
    Credentials/
    Documents/
    Deliverables/
```

---

## Backup Verification Checklist

Run monthly on staging server:

- [ ] Check UpdraftPlus logs for failures
- [ ] Verify remote storage has recent backups
- [ ] Confirm backup file sizes are reasonable (not 0 bytes)
- [ ] Test restore on a throwaway install (quarterly)

---

## Emergency Contacts

| Issue | Contact |
|-------|---------|
| Hosting server down | [Your hosting support] |
| Google Drive issues | Google support / switch to Dropbox |
| UpdraftPlus problems | UpdraftPlus support or switch to plugin |

---

## Quick Reference

**Daily:** Automated - no action needed
**Before migration:** Manual full backup + download
**Monthly:** Verify backups are running
**After project:** Download backup, then delete staging at 30+ days

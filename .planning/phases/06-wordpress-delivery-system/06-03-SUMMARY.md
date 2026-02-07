---
phase: 06-wordpress-delivery-system
plan: 03
subsystem: wordpress-delivery-docs
tags: [staging, migration, duplicator, documentation]

dependency_graph:
  requires:
    - 06-01 (Starter Template Guide for plugin references)
  provides:
    - Staging setup documentation
    - Migration workflow guide
    - Staging checklist template
  affects:
    - 06-04 (Scope document references staging workflow)
    - 06-06 (Handoff process references staging cleanup)

tech_stack:
  added: []
  patterns:
    - Staged development workflow (build on Jon's hosting, migrate at launch)
    - Dual protection pattern (noindex + password)

key_files:
  created:
    - docs/wordpress-delivery/03-staging-setup-guide.md
    - docs/wordpress-delivery/templates/staging-checklist.md
  modified: []

decisions:
  - id: staging-subdomain-pattern
    choice: staging-[clientname].jongerton.com pattern
    rationale: Consistent naming enables easy identification and cleanup
  - id: dual-protection
    choice: Both noindex AND password protection required
    rationale: noindex prevents indexing, password prevents public viewing - neither alone is sufficient
  - id: duplicator-over-aiowp
    choice: Duplicator for all migrations
    rationale: Works on empty servers without WordPress pre-install, better for disaster recovery
  - id: 30-day-cleanup
    choice: Archive at 30 days, delete at 31+ days
    rationale: Matches bug fix warranty period, prevents staging accumulation

metrics:
  duration: 4 min
  completed: 2026-02-04
---

# Phase 6 Plan 3: Staging Setup Guide Summary

Staging setup documentation enabling 30-minute site spin-up with dual protection (noindex + password) and reliable Duplicator migration to client production hosting.

## What Was Built

### 1. Staging Setup Guide (docs/wordpress-delivery/03-staging-setup-guide.md)

Comprehensive documentation covering:

- **Staging environment overview** - Build on staging.jongerton.com, migrate at launch
- **Step-by-step creation** - 5 phases totaling under 30 minutes target
- **Dual protection** - noindex (prevents indexing) + password (prevents viewing)
- **Migration process** - Complete Duplicator workflow from package to go-live
- **Troubleshooting** - Mixed content, broken images, 404s, CSS issues
- **Cleanup schedule** - 30-day archive, 31+ day deletion

### 2. Staging Checklist Template (docs/wordpress-delivery/templates/staging-checklist.md)

Quick-reference checklist with 76 checkbox items:

- Project details section for client/subdomain tracking
- Setup phase with plugin installation checklist
- Protection verification steps
- Client preview access documentation
- Complete migration tracking with credential fields
- Post-migration security cleanup items
- 30-day cleanup tracking

## Key Implementation Details

### Staging Protection Pattern

Both protections are required for every staging site:

| Protection | Prevents | Doesn't Prevent |
|------------|----------|-----------------|
| noindex | Google/Bing indexing | Direct URL access |
| Password | Public viewing | Nothing |

### Duplicator Migration Steps

1. Create package on staging (archive.zip + installer.php)
2. Upload both files to empty client hosting root
3. Navigate to clientdomain.com/installer.php
4. Enter database credentials (create new DB first)
5. URL replacement happens automatically
6. Delete installer files immediately after

### Cleanup Timeline

| Milestone | Action |
|-----------|--------|
| Launch day | Migration complete |
| Launch + 30 days | Archive staging site |
| Launch + 31 days | Delete subdomain |

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- [x] 03-staging-setup-guide.md exists with complete documentation
- [x] templates/staging-checklist.md exists as quick reference
- [x] Staging creation documented with 30-minute target (mentioned 3x)
- [x] noindex and password protection both covered (7 noindex mentions)
- [x] Full Duplicator migration process documented (12 mentions)
- [x] 30-day cleanup schedule documented (5 references)

## Commits

| Hash | Message |
|------|---------|
| eab287d | docs(06-03): create Staging Setup Guide for WordPress delivery |
| 58d6048 | docs(06-03): create staging checklist template |

## Next Phase Readiness

Plan 06-04 (Scope and Payment Protection) can proceed. This plan provides:
- Staging workflow that scope documents can reference
- Migration process that change order process can account for
- 30-day cleanup aligning with warranty period

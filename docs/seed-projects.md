# Solo Project Ideas

> **Note:** These are standalone project ideas captured for future consideration. They are NOT part of this portfolio project (jpgerton.com/wp-designer). Each would be its own separate repository and project if pursued.

## Ideas

### 1. TaskFlow Pro

**Concept:** AI-powered task management with natural language processing

**Description:** A modern task management application featuring AI-powered task parsing from natural language input. Includes smart categorization, deadline detection, and priority inference using OpenAI's GPT-4 API.

**Potential Tech Stack:**
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL, OpenAI API
- Infrastructure: Docker, AWS ECS, RDS

**Key Features:**
- Natural language task input ("Call mom tomorrow at 3pm" -> parsed task with deadline)
- Smart categorization based on content
- Priority inference from urgency cues
- Deadline detection from text

**Why Interesting:** Combines practical productivity tool with AI capabilities. Good showcase for LLM integration patterns.

---

### 2. DevMetrics Dashboard

**Concept:** Real-time developer productivity analytics and insights

**Description:** A comprehensive dashboard for engineering teams to track productivity metrics, code review turnaround times, and deployment frequency. Integrates with GitHub, GitLab, and Jira for automated data collection.

**Potential Tech Stack:**
- Frontend: Vue.js, Chart.js, TypeScript
- Backend: Python, FastAPI, TimescaleDB
- Infrastructure: Docker, DigitalOcean, GitHub Actions

**Key Features:**
- GitHub/GitLab/Jira integrations
- Code review turnaround metrics
- Deployment frequency tracking
- Team velocity dashboards
- Historical trend analysis

**Why Interesting:** Solves real pain point for engineering managers. Time-series data with TimescaleDB is a good learning opportunity.

---

### 3. LocalBiz Templates

**Concept:** WordPress starter templates for local service businesses

**Description:** A collection of optimized WordPress starter templates designed for local service businesses. Includes pre-configured SEO settings, contact forms, Google Maps integration, and mobile-first responsive design.

**Potential Tech Stack:**
- Frontend: WordPress, Elementor, CSS
- Backend: PHP, MySQL, ACF (Advanced Custom Fields)
- Infrastructure: WP Engine, Cloudflare

**Key Features:**
- Industry-specific templates (plumber, electrician, landscaper, etc.)
- Pre-configured local SEO settings
- Contact form with Google Maps embed
- Mobile-first responsive design
- One-click setup scripts

**Why Interesting:** Directly supports the $500 WordPress business model. Could be productized as a template marketplace or used internally to speed up delivery.

---

### 4. CodeReview Bot

**Concept:** Automated code review assistant using LLM analysis

**Description:** A GitHub bot that provides automated code review suggestions using large language models. Analyzes PR diffs for bugs, security issues, and code style improvements with contextual explanations.

**Potential Tech Stack:**
- Backend: TypeScript, GitHub API, OpenAI API
- Infrastructure: Vercel Functions, GitHub Apps

**Key Features:**
- Automatic PR analysis on open/update
- Bug detection with explanations
- Security vulnerability scanning
- Code style suggestions
- Configurable review depth/focus

**Why Interesting:** Developer tools market. Could be a GitHub Marketplace app with freemium model. Good showcase for GitHub Apps + LLM integration.

---

### 5. Budget Tracker CLI

**Concept:** Terminal-based personal finance tracking with charts

**Description:** A command-line tool for tracking personal finances with ASCII chart visualizations. Supports importing transactions from CSV, categorization rules, and monthly budget tracking with alerts.

**Potential Tech Stack:**
- Backend: Rust, SQLite
- Distribution: Homebrew, crates.io

**Key Features:**
- CSV import from bank exports
- Automatic categorization rules
- Monthly budget tracking
- ASCII chart visualizations in terminal
- Budget alerts and notifications

**Why Interesting:** Rust learning project. CLI tools have dedicated user base. No server costs, pure local tool.

---

## Evaluation Criteria

When considering which to pursue:

| Project | Effort | Revenue Potential | Learning Value | Portfolio Value |
|---------|--------|-------------------|----------------|-----------------|
| TaskFlow Pro | High | Medium (SaaS) | High (AI) | High |
| DevMetrics | High | Medium (B2B SaaS) | High (Data) | High |
| LocalBiz Templates | Medium | Direct ($500 biz) | Low | Medium |
| CodeReview Bot | Medium | Medium (Marketplace) | High (GitHub) | High |
| Budget Tracker CLI | Low | Low (OSS) | High (Rust) | Medium |

## Next Steps

To pursue any of these:
1. Create new repository (separate from wp-designer)
2. Run `/gsd:new-project` in that directory
3. Define requirements and roadmap specific to that project

**Do not build these in the wp-designer project directory.**

# QUILD — OSPC Platform

**Open-Source Patent Commons** for managing the full lifecycle of research IP: from project inception and patent filing to validation, licensing, micro-ownership, royalties, and community governance.

> Micro-Ownership · CV Engine · Royalties & Governance

---

## What is QUILD?

QUILD is a modern, analytics-first control plane for open-source patent commons (OSPC). It gives research groups, startups, and patent pools a single workspace to run their IP portfolio like a business — tracking projects, patents, validations, revenue, contributors, and treasury in one place.

It moves beyond classic IP management by modelling **micro-ownership** at the contributor level:

- **OMU (On-chain Micro-ownership Units)** — a contributor's fractional ownership stake in a project, minted against contributions and governed by vesting schedules (cliff + duration).
- **CV Engine** — a multi-dimensional "Computed Value" score that captures real contribution quality: commit weight, code review depth, test coverage, refactoring, ADRs, issue triage, benchmark improvements, and more.
- **Royalties Engine** — automates gross settlement, a micropayment accumulator with per-project wallets, and tax compliance (TDS deduction) with payouts via UPI, bank transfer, RTGS, or crypto.

## Features

### Core
- **Dashboard** — live KPIs (projects, active IPs, revenue, investors), portfolio trends, ownership distribution, and an activity feed.
- **Projects** — full CRUD across AI, Biotech, Hardware, Blockchain, and Quantum; track TRL, treasuries, vesting config, and governance model (`omu_weighted` / `cv_weighted`).
- **Validation** — scorecard-driven review workflow for technology, patents, trademarks, and copyrights with `pending → in_review → verified / rejected` states.
- **IP / Patents** — patent portfolio management across provisional, full, PCT, and continuation filings; jurisdictions, inventors, valuation, and lifecycle status (draft → filed → examined → granted).
- **Marketplace** — buy and sell technology, patents, trademarks, and data; price tracking, views/likes, and transaction history.
- **Revenue** — full income/expense ledger across investments, licensing, sales, grants, and royalties.

### OSPC Features
- **Contributors** — CV Engine scoring across 16 contribution dimensions, OMU holdings with transferable/locked split, reputation scores, and badges.
- **Governance** — decentralised decision-making with liquid democracy and conviction voting; proposals span parameter changes, licenses, budgets, and emergency interventions.
- **Royalties** — real-time gross settlement, micropayment accumulator, per-contributor and per-project payout analytics, and tax-compliant payout rails (UPI, RTGS, bank transfer, crypto).

## Tech Stack

| Layer    | Tech |
|----------|------|
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| UI        | [React](https://react.dev) 19, [Tailwind CSS](https://tailwindcss.com) v4 |
| Charts    | [Recharts](https://recharts.org) |
| Animation | [Framer Motion](https://motion.dev) |
| Icons     | [lucide-react](https://lucide.dev) |
| Language  | [TypeScript](https://www.typescriptlang.org) |

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aryan0047-ak/QUILD.git
cd QUILD

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to `/dashboard`.

### Scripts

```bash
npm run dev       # start the development server
npm run build     # create a production build
npm run start     # serve the production build
npm run lint      # run ESLint
```

## Project Structure

```
QUILD/
├── src/
│   ├── app/               # App Router pages
│   │   ├── dashboard/     # KPIs, charts, ownership, activity
│   │   ├── projects/      # Project CRUD & portfolio
│   │   ├── validation/    # Validation workflow
│   │   ├── ip/            # Patent portfolio
│   │   ├── marketplace/   # IP/technology listings
│   │   ├── revenue/       # Income & expense ledger
│   │   ├── contributors/  # CV Engine, OMU & reputation
│   │   ├── governance/    # Proposals & conviction voting
│   │   └── royalties/     # Royalties & micropayments
│   ├── components/        # Sidebar, Header, Modal
│   └── lib/               # Types, mock data, OSPC store
├── package.json
└── next.config.ts
```

## Roadmap

- [x] Project & IP portfolio management
- [x] Validation & scoring workflow
- [x] Marketplace & revenue tracking
- [x] CV Engine scoring
- [x] OMU issuance with vesting schedules
- [x] Decentralised governance (conviction voting)
- [x] Royalties engine with tax compliance
- [ ] Backend persistence & auth
- [ ] On-chain OMU & payout distribution
- [ ] Analytics & reporting suite

## Contributing

Contributions are welcome! Fork the repo, create a feature branch, and open a pull request. Make sure `npm run lint` and `npm run build` pass before submitting.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).
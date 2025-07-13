# SKYGENI Data Visualization

A Next.js-based dashboard for visualizing various business metrics including account industry data, ACV range, customer type, and team performance.

[Video] (https://drive.google.com/drive/folders/1h4fx7XMNMxt_iZopj5EMRBqFXFOZ0CfL?usp=sharing)

## Folder Structure

```bash
src/
├── app/
│   ├── (graph pages)/
│   │   ├── account-industry/
│   │   ├── acv-range/
│   │   ├── customer-type/
│   │   └── team/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── charts/
│       ├── heat_map_chart.tsx
│       ├── horizontal_bar_chart.tsx
│       ├── radar_chart.tsx
│       └── water_fall_chart.tsx
├── lib/
│   ├── api/
│   │   └── dashboard_api.ts
│   └── utils/
│       └── ...
└── types/
    ├── account-industry.ts
    ├── acv-range.ts
    ├── customer-type.ts
    └── team.ts
```

## Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 + MUI (Material-UI)
- **Visualization**: D3.js + Recharts
- **State Management**: React Context
- **Type Checking**: TypeScript
- **API Client**: Fetch API

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-repo/skygeni-dashboard.git
cd skygeni-dashboard
```

## Run

```bash
npm install
npm run start
```

## Key Components

- heat_map_chart.tsx - ACV range heatmap visualization
- horizontal_bar_chart.tsx - Team performance comparison
- radar_chart.tsx - Multi-quarter team metrics
- water_fall_chart.tsx - ACV changes over time

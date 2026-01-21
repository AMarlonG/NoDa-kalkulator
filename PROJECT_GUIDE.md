# NoDa Kalkulator - Project Guide

A comprehensive guide for developers working on the NoDa salary calculator for Norwegian dance professionals.

## Project Overview

|                  |                                                               |
| ---------------- | ------------------------------------------------------------- |
| **What**         | NoDa salary calculator for Norwegian dance professionals      |
| **Purpose**      | Calculate fair wages based on collective agreements (tariffs) |
| **Target Users** | Dancers, choreographers, dance educators, arts administrators |
| **Live URL**     | [Vercel Deployment](https://noda-kalkulator.vercel.app)       |

---

## Tech Stack

| Category   | Technology       | Version |
| ---------- | ---------------- | ------- |
| Framework  | Next.js          | 16.1.4  |
| UI Library | React            | 19      |
| Language   | TypeScript       | 5       |
| Styling    | CUBE CSS         | Custom  |
| Deployment | Vercel           | -       |
| Analytics  | Vercel Analytics | 1.5.0   |

---

## Directory Structure

```
NoDa-kalkulator/
├── app/
│   ├── components/           # React components (client-side)
│   │   ├── ChoreographerCalculator.tsx
│   │   ├── DancerCalculator.tsx
│   │   ├── DancerChoreographerCalculator.tsx
│   │   ├── SelfEmployedPopover.tsx
│   │   └── TeacherCalculator.tsx
│   ├── styles/               # CUBE CSS architecture
│   │   ├── base.css          # Reset, tokens, global, blocks, utilities
│   │   ├── composition.css   # Layout primitives
│   │   ├── calculator-common.css
│   │   └── page.css
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── lib/                      # Utilities, constants, salary data
│   ├── constants.ts          # Global constants
│   ├── formatting.ts         # Number/currency formatting
│   ├── dancersSalary.ts      # Dancer salary tables
│   ├── choreographyProjectSalary.ts
│   ├── choreographyTheaterMusicalSalary.ts
│   ├── teacherSalary.ts
│   └── selfEmployedRates.ts
├── vercel.json               # Deployment config
├── tsconfig.json             # TypeScript config
├── eslint.config.mjs         # ESLint config
└── package.json
```

---

## CSS Architecture (CUBE CSS)

The project uses [CUBE CSS](https://cube.fyi/) methodology with CSS layers for cascade management.

### Layer Hierarchy

```css
@layer reset, tokens, global, composition, blocks, utilities, exceptions;
```

| Layer           | Purpose                                 |
| --------------- | --------------------------------------- |
| **reset**       | Modern CSS reset (Andy Bell's approach) |
| **tokens**      | Primitive + semantic design tokens      |
| **global**      | Base element styles                     |
| **composition** | Layout primitives                       |
| **blocks**      | Component styles                        |
| **utilities**   | Single-purpose helpers                  |
| **exceptions**  | Animations, view transitions            |

### Design Tokens

#### Color Palette (Purple Scale)

| Token        | Value                           |
| ------------ | ------------------------------- |
| `--purple-0` | `hsl(280, 50%, 98%)` - Lightest |
| `--purple-1` | `hsl(280, 50%, 95%)`            |
| `--purple-2` | `hsl(280, 40%, 85%)`            |
| `--purple-3` | `hsl(280, 30%, 80%)`            |
| `--purple-4` | `hsl(280, 60%, 60%)`            |
| `--purple-5` | `hsl(280, 60%, 30%)` - Primary  |
| `--purple-6` | `hsl(280, 65%, 25%)`            |
| `--purple-7` | `hsl(280, 60%, 25%)`            |
| `--purple-8` | `hsl(280, 60%, 10%)` - Darkest  |

#### Semantic Color Mappings

| Token                      | Maps To      |
| -------------------------- | ------------ |
| `--color-surface`          | `--purple-1` |
| `--color-surface-elevated` | `--purple-0` |
| `--color-text`             | `--purple-8` |
| `--color-primary`          | `--purple-5` |
| `--color-border`           | `--purple-4` |

#### Spacing Scale

| Token       | Value            |
| ----------- | ---------------- |
| `--size-1`  | `0.25rem` (4px)  |
| `--size-2`  | `0.5rem` (8px)   |
| `--size-3`  | `0.75rem` (12px) |
| `--size-4`  | `1rem` (16px)    |
| `--size-6`  | `1.5rem` (24px)  |
| `--size-8`  | `2rem` (32px)    |
| `--size-12` | `3rem` (48px)    |
| `--size-16` | `4rem` (64px)    |

#### Typography Scale (Fluid)

| Token         | Value                                      |
| ------------- | ------------------------------------------ |
| `--text-sm`   | `clamp(0.875rem, 0.8rem + 0.375vw, 1rem)`  |
| `--text-base` | `clamp(1rem, 0.9rem + 0.5vw, 1.125rem)`    |
| `--text-lg`   | `clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)`  |
| `--text-xl`   | `clamp(1.75rem, 1.5rem + 1.25vw, 2.25rem)` |
| `--text-2xl`  | `clamp(2.5rem, 2.25rem + 1.5vw, 3.25rem)`  |

### Composition Classes

| Class       | Purpose                               | Usage                   |
| ----------- | ------------------------------------- | ----------------------- |
| `.stack`    | Vertical flow with consistent spacing | `<div class="stack">`   |
| `.cluster`  | Horizontal wrapping group             | Button groups, tags     |
| `.center`   | Horizontally center with max-width    | Centered content blocks |
| `.flow`     | Prose rhythm (lobotomized owl)        | Article content         |
| `.sidebar`  | Two-column layout                     | Main + sidebar layouts  |
| `.grid`     | Auto-fill responsive grid             | Card grids, galleries   |
| `.switcher` | Responsive row/column                 | Threshold-based layouts |
| `.cover`    | Vertically center content             | Full-height sections    |
| `.region`   | Section with vertical padding         | Page sections           |
| `.box`      | Generic padded container              | Contained content       |
| `.frame`    | Fixed aspect ratio                    | Images, videos          |

---

## Components

| Component                       | Purpose                                       |
| ------------------------------- | --------------------------------------------- |
| `DancerCalculator`              | Calculate wages for permanent/project dancers |
| `ChoreographerCalculator`       | Calculate choreography fees                   |
| `DancerChoreographerCalculator` | Combined role calculations                    |
| `TeacherCalculator`             | Calculate educator hourly rates               |
| `SelfEmployedPopover`           | Display self-employment markup breakdown      |

All components use the `'use client'` directive for client-side rendering.

---

## Data & Calculations

### Key Constants

| Constant                 | Value         | Description                                 |
| ------------------------ | ------------- | ------------------------------------------- |
| `ANNUAL_WORKING_HOURS`   | 1750          | Standard annual working hours in Norway     |
| `SELF_EMPLOYMENT_MARKUP` | 0.368 (36.8%) | Additional markup for self-employed workers |

### Self-Employment Markup Breakdown

| Component                                  | Percentage |
| ------------------------------------------ | ---------- |
| Employer's national insurance contribution | 15.8%      |
| Holiday pay                                | 12.0%      |
| National insurance contribution increase   | 3.6%       |
| Voluntary occupational injury insurance    | 0.4%       |
| Administrative costs                       | 5.0%       |
| **Total**                                  | **36.8%**  |

### Salary Data Files

| File                                  | Content                           |
| ------------------------------------- | --------------------------------- |
| `dancersSalary.ts`                    | Dancer salary tables by category  |
| `choreographyProjectSalary.ts`        | Project choreography fees         |
| `choreographyTheaterMusicalSalary.ts` | Theater/musical choreography fees |
| `teacherSalary.ts`                    | Teacher hourly rates              |
| `selfEmployedRates.ts`                | Self-employment rate calculations |

---

## Development Workflow

### Available Scripts

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:3000)
npm run lint       # ESLint (strict, 0 warnings)
npm run type-check # TypeScript validation
npm run format     # Prettier formatting
npm run build      # Production build
```

### Quick Start

```bash
git clone <repository-url>
cd NoDa-kalkulator
npm install
npm run dev
```

---

## Deployment

| Setting  | Value                             |
| -------- | --------------------------------- |
| Platform | Vercel                            |
| Region   | `arn1` (Europe North - Stockholm) |
| Trigger  | Auto-deploy on push to `main`     |

### Security Headers (vercel.json)

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Version Control Conventions

### Branching

- **Strategy**: Trunk-based development
- **Main branch**: `main`

### Commit Format

```
<type>: <description>
```

| Type        | Use For               |
| ----------- | --------------------- |
| `feat:`     | New features          |
| `fix:`      | Bug fixes             |
| `refactor:` | Code improvements     |
| `chore:`    | Maintenance tasks     |
| `docs:`     | Documentation changes |

### Pull Requests

- Create PRs for features and fixes
- Ensure lint and type-check pass before merging

---

## Code Style

| Rule       | Setting                                   |
| ---------- | ----------------------------------------- |
| TypeScript | Strict mode enabled                       |
| Formatting | Prettier (single quotes, 2-space indent)  |
| Linting    | ESLint with zero-warning policy           |
| Components | Client-side with `'use client'` directive |

### Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## Accessibility

| Feature            | Implementation                              |
| ------------------ | ------------------------------------------- |
| Language           | Norwegian (`lang="no"`)                     |
| Keyboard shortcuts | Alt+1-4 for calculator selection            |
| Focus styling      | `:focus-visible` with primary color outline |
| Screen reader      | `.sr-only` utility class available          |
| Semantic HTML      | Proper heading hierarchy, labels            |

---

## Updating Salary Data

When tariff rates change, follow these steps:

1. **Locate the file** - Edit the relevant file in `lib/`:
   - Dancer rates: `lib/dancersSalary.ts`
   - Teacher rates: `lib/teacherSalary.ts`
   - Choreography fees: `lib/choreographyProjectSalary.ts` or `lib/choreographyTheaterMusicalSalary.ts`

2. **Update values** - Modify the salary values while maintaining the existing interface structure

3. **Validate** - Run type checking:

   ```bash
   npm run type-check
   ```

4. **Test** - Start the dev server and manually verify calculations:

   ```bash
   npm run dev
   ```

5. **Lint** - Ensure code quality:

   ```bash
   npm run lint
   ```

6. **Commit** - Use a descriptive commit message:
   ```bash
   git commit -m "feat: Update 2025 tariff rates"
   ```

---

## Troubleshooting

### Common Issues

| Issue            | Solution                                    |
| ---------------- | ------------------------------------------- |
| Type errors      | Run `npm run type-check` to identify issues |
| Lint warnings    | Run `npm run lint` and fix all warnings     |
| CSS not applying | Check layer order and specificity           |
| Build failures   | Clear `.next` folder and rebuild            |

### Useful Commands

```bash
# Clear build cache
rm -rf .next && npm run build

# Check for outdated dependencies
npm outdated

# Format all files
npm run format

# Kill orphaned dev server (if port 3000 is stuck)
pkill -f "next dev"

# Or find and kill by port
lsof -ti :3000 | xargs kill -9
```

### Dev Server Issues

If you see "Port 3000 is in use" or "Unable to acquire lock":

1. **Kill all Next.js processes**: `pkill -f "next dev"`
2. **Clear the lock file**: `rm -rf .next`
3. **Restart**: `npm run dev`

This can happen if a dev server process wasn't terminated cleanly (e.g., terminal closed without Ctrl+C).

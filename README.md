# Citadel - Autonomous Defensive DeFi Yield Vault

A high-fidelity, production-ready dashboard for Citadel, an autonomous defensive DeFi yield vault. Built with React, Next.js, and Tailwind CSS following a "Stoic, Defensive, and Precise" design philosophy.

## Overview

Citadel is a mission-critical DeFi interface designed to resemble a modern digital fortress. The dashboard provides real-time monitoring of vault performance, strategic asset allocation, and market volatility assessment with automatic mode switching between Growth and Fortress strategies.

## Features

### Core Components

1. **Shield Status Header**
   - Real-time system status (Growth/Fortress mode)
   - Wallet connection interface
   - Sticky navigation

2. **Main Vault Card**
   - Total Value Locked (TVL)
   - Net APY with yield breakdown
   - Anchor Yield (stable) + Booster Yield (volatile)
   - Deposit/Withdraw actions
   - User balance display

3. **Risk Meter**
   - Visual volatility gauge (0-100%)
   - 10-segment color-coded bar
   - Real-time needle indicator
   - Risk level classification

4. **Strategy Engine**
   - Dual-bucket deployment system
   - AsterDEX Earn (Anchor strategy)
   - PancakeSwap LP (Booster strategy)
   - Mode-dependent allocation visualization

5. **Activity Log**
   - Terminal-style event log
   - Timestamped entries with color coding
   - Event type statistics
   - Real-time system monitoring

### Responsive Design

- **Mobile** (< 640px): Single-column stacked layout
- **Tablet** (640px - 1024px): Two-column adaptive grid
- **Desktop** (1024px+): Full multi-column layout with generous spacing

### Mode Switching

- **Growth Mode**: Volatility < 45% - Both strategies active, optimized for yield
- **Fortress Mode**: Volatility > 65% - Defensive positioning, 100% to stable yields

## Design System

### Color Palette

| Color | Hex | Purpose |
|-------|-----|---------|
| Citadel Slate | #0F172A | Main background |
| Aegis Steel | #1E293B | Cards and containers |
| Growth Green | #16A34A | Safe/growth indicators |
| Fortress Red | #DC2626 | Alerts and danger |
| Oracle Amber | #F59E0B | Warnings and caution |

### Typography

- **UI Text**: Inter (sans-serif)
- **Financial Data**: JetBrains Mono (monospace)
- **Headings**: Semibold weights for hierarchy
- **All Numbers**: Monospace for precision

### Key Principles

- No gradients on critical data layers
- Deep shadows for visual weight and permanence
- 1px borders for definition
- Smooth 150ms transitions (no elastic effects)
- WCAG AA contrast compliance

## File Structure

```
citadel-dashboard/
├── app/
│   ├── layout.tsx              # Font configuration, metadata
│   ├── globals.css             # Design tokens, utilities
│   └── page.tsx                # Main dashboard page
├── components/
│   └── citadel/
│       ├── shield-header.tsx    # Navigation header
│       ├── vault-card.tsx       # Main metrics card
│       ├── risk-meter.tsx       # Volatility gauge
│       ├── strategy-engine.tsx  # Deployment visualization
│       └── activity-log.tsx     # Event log terminal
├── components/ui/              # shadcn/ui components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── DESIGN_SYSTEM.md            # Complete design documentation
├── COMPONENT_REFERENCE.md      # Component API reference
└── V0_DEPLOYMENT_CHECKLIST.md  # Deployment verification
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- v0.app access (for development)

### Installation

```bash
# Clone or download the project
cd citadel-dashboard

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

## Configuration

### Design Tokens

Edit `/app/globals.css` to customize colors:

```css
:root {
  --citadel-slate: #0F172A;
  --aegis-steel: #1E293B;
  --growth-green: #16A34A;
  --fortress-red: #DC2626;
  --oracle-amber: #F59E0B;
}
```

### Fonts

Update in `/app/layout.tsx`:

```typescript
import { Inter, JetBrains_Mono } from 'next/font/google'
```

## Component Usage

### VaultCard Example

```tsx
<VaultCard
  tvl={2450000}
  anchorYield={8.5}
  boosterYield={12.3}
  userBalance={50000}
  onDeposit={() => console.log('Deposit')}
  onWithdraw={() => console.log('Withdraw')}
/>
```

### RiskMeter Example

```tsx
<RiskMeter volatility={35} />
```

See `COMPONENT_REFERENCE.md` for complete API documentation.

## Responsive Breakpoints

- `sm`: 640px (mobile)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)

All components use Tailwind responsive prefixes:

```jsx
className="text-xs sm:text-sm lg:text-base"
className="p-4 sm:p-6 lg:p-8"
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
```

## Real-Time Features

### Volatility Updates
- Simulated every 5 seconds
- Smooth meter animations
- Automatic mode switching

### Activity Log
- Timestamped entries
- Color-coded event types
- Sample events: harvests, rebalancing, alerts

## Accessibility

- WCAG AA contrast compliance
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- Focus indicators on interactive elements

## Performance

- Optimized font loading (Next.js Google Fonts)
- GPU-accelerated animations
- Efficient re-renders via React.memo
- CSS minification in production
- Fast initial paint (target < 2s)

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile: iOS 12+, Android 8+

## Documentation

### Files

- **DESIGN_SYSTEM.md**: Complete design guidelines, component specs, global standards
- **COMPONENT_REFERENCE.md**: Component API, props, usage examples
- **V0_DEPLOYMENT_CHECKLIST.md**: Pre-deployment verification checklist

### Inline Documentation

Each component includes JSDoc comments and prop type definitions.

## Asset Requirements

Before deployment, add:

- [ ] Citadel logo (32x32px SVG/PNG)
- [ ] Favicon set (dark, light, Apple)
- [ ] Trophy animation (optional, for milestones)
- [ ] MiniPay icon (if applicable)

## Customization Guide

### Changing Primary Color

1. Update hex code in globals.css (--citadel-slate)
2. Update any semantic tokens that reference it
3. Test contrast with new color

### Adding New Metrics

1. Create new section in VaultCard
2. Follow monospace font pattern
3. Maintain responsive grid layout
4. Add color-coded left border

### Modifying Animation Speed

Edit transition durations in components (default: 150ms-300ms)

## Troubleshooting

**Q: Components look different on mobile**
A: Check responsive breakpoints. All components include `sm:` and `lg:` prefixes.

**Q: Text too small on mobile**
A: Typography scales automatically. Verify font sizes use responsive classes.

**Q: Colors don't match design**
A: Verify hex codes in globals.css match exactly (#0F172A, #1E293B, etc).

**Q: Buttons not responding**
A: Ensure onClick handlers are passed correctly. Check browser console.

## Deployment

### v0.app Deployment

1. Click "Publish" button
2. Select Vercel project
3. Deploy with environment variables
4. Verify design tokens in production

### Vercel Deployment

```bash
npm install -g vercel
vercel
```

### Self-Hosted

```bash
npm run build
# Deploy the .next directory
```

## Performance Metrics

Target metrics:

- FCP (First Contentful Paint): < 1.5s
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- TTI (Time to Interactive): < 3.5s

## Security

- No sensitive data in frontend code
- All numbers are mock/demo data
- HTTPS required for deployment
- CSP headers recommended

## Testing

### Manual Testing Checklist

- [x] Responsive on mobile (375px+)
- [x] Responsive on tablet (768px+)
- [x] Responsive on desktop (1024px+)
- [x] Growth mode displays
- [x] Fortress mode displays
- [x] Colors match design
- [x] Typography renders correctly
- [x] Buttons are clickable
- [x] Log updates show correctly
- [x] Volatility meter updates smoothly

## Contributing

1. Follow design system guidelines
2. Maintain component modularity
3. Test responsive behavior
4. Keep accessibility standards
5. Document prop changes

## Support

For issues or questions:

1. Check DESIGN_SYSTEM.md for design guidance
2. Review COMPONENT_REFERENCE.md for usage
3. Examine source files for implementation
4. Test in v0.app preview
5. Review browser console for errors

## License

Built with v0.app - Vercel's AI-powered code generation platform.

## Credits

- **Design Philosophy**: Digital Fortress, Stoic & Defensive
- **Tech Stack**: React, Next.js 16, Tailwind CSS v4, Lucide Icons
- **Fonts**: Inter (Google Fonts), JetBrains Mono (Google Fonts)
- **Components**: shadcn/ui

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-01  
**Status**: Production Ready

For live preview and code modifications, visit [v0.app](https://v0.app)

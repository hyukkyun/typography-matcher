// Vercel Web Analytics integration
// This module initializes Vercel Analytics for tracking page views
import { inject } from '../node_modules/@vercel/analytics/dist/index.mjs';

// Inject the analytics script
// The mode will automatically detect the environment:
// - 'production' when deployed to Vercel (sends events to server)
// - 'development' in local development (logs events to console)
inject({
  mode: 'auto',
  debug: true
});

/**
 * Vercel Web Analytics initialization
 * 
 * This script initializes Vercel Web Analytics for the Typography Matcher app.
 * Analytics will track page views and user interactions automatically.
 * 
 * Note: Analytics data will only be collected when deployed on Vercel with
 * Web Analytics enabled in the dashboard.
 */

import { inject } from '@vercel/analytics';

// Initialize Vercel Web Analytics
// In development mode, debug is enabled by default
inject();

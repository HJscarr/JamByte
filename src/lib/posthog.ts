import posthog from 'posthog-js'

// Initialize PostHog with minimal configuration
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
      capture_pageview: true, // Enable pageview capture but we'll customize it
      capture_pageleave: false,
      autocapture: false,
      persistence: 'localStorage',
      disable_session_recording: true, // Disable session recording to reduce data
      property_blacklist: ['$current_url', '$pathname', '$host'], // Reduce property size
    })

    // Add default properties to all events
    posthog.register({
      browser: navigator.userAgent,
      device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
    })
  }
}

// Identify user after login
export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, userProperties)
  }
}

// Capture custom events
export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties)
  }
}

// Track page views with custom properties
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined') {
    posthog.capture('$pageview', {
      path,
      referrer: document.referrer,
    })
  }
}
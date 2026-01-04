import EMPTY_EMAIL_MESSAGE from './sample/empty-email-message';
import ONE_TIME_PASSCODE from './sample/one-time-passcode';
import ORDER_ECOMMERCE from './sample/order-ecommerce';
import POST_METRICS_REPORT from './sample/post-metrics-report';
import RESERVATION_REMINDER from './sample/reservation-reminder';
import RESET_PASSWORD from './sample/reset-password';
import RESPOND_TO_MESSAGE from './sample/respond-to-message';
import SUBSCRIPTION_RECEIPT from './sample/subscription-receipt';
import WELCOME from './sample/welcome';

export default function getConfiguration(template: string) {
  console.log('getConfiguration called with template:', template?.substring(0, 50));

  // PRIORITY 1: Check for pending design from Laravel
  // This is set when Laravel loads a saved template
  try {
    const pendingDesign = localStorage.getItem('__PENDING_DESIGN__');
    if (pendingDesign) {
      console.log('Found __PENDING_DESIGN__ from Laravel');
      
      const config = JSON.parse(pendingDesign);
      
      // Clear pending design after loading
      localStorage.removeItem('__PENDING_DESIGN__');
      
      // Save to standard keys for persistence
      localStorage.setItem('emailDesign', pendingDesign);
      localStorage.setItem('email-builder-design', pendingDesign);
      
      // Update URL hash for bookmarking
      try {
        const encoded = btoa(encodeURIComponent(pendingDesign));
        if (encoded.length < 2000) {
          window.location.hash = '#code/' + encoded;
        }
      } catch (e) {
        console.warn('Cannot update hash:', e);
      }
      
      console.log('Loaded design from Laravel');
      return config;
    }
  } catch (e) {
    console.warn('Error loading __PENDING_DESIGN__:', e);
  }

  // PRIORITY 2: Sample templates
  if (template.startsWith('#sample/')) {
    const sampleName = template.replace('#sample/', '');
    console.log('📦 Loading sample:', sampleName);
    
    switch (sampleName) {
      case 'welcome':
        return WELCOME;
      case 'one-time-password':
        return ONE_TIME_PASSCODE;
      case 'order-ecomerce':
        return ORDER_ECOMMERCE;
      case 'post-metrics-report':
        return POST_METRICS_REPORT;
      case 'reservation-reminder':
        return RESERVATION_REMINDER;
      case 'reset-password':
        return RESET_PASSWORD;
      case 'respond-to-message':
        return RESPOND_TO_MESSAGE;
      case 'subscription-receipt':
        return SUBSCRIPTION_RECEIPT;
    }
  }

  // PRIORITY 3: URL hash with encoded design
  if (template.startsWith('#code/')) {
    const encodedString = template.replace('#code/', '');
    console.log('Loading from URL hash');
    
    try {
      const configurationString = decodeURIComponent(atob(encodedString));
      const config = JSON.parse(configurationString);
      
      // Save to localStorage for persistence
      localStorage.setItem('emailDesign', configurationString);
      localStorage.setItem('email-builder-design', configurationString);
      
      console.log('Loaded from URL hash');
      return config;
    } catch (e) {
      console.error(`Couldn't load configuration from hash:`, e);
    }
  }

  // PRIORITY 4: Load from localStorage (existing saved work)
  try {
    const savedDesign = localStorage.getItem('emailDesign') || 
                       localStorage.getItem('email-builder-design');
    
    if (savedDesign) {
      console.log('Loading from localStorage');
      
      const config = JSON.parse(savedDesign);
      
      // Update URL hash if not already set
      if (!template || template === '') {
        try {
          const encoded = btoa(encodeURIComponent(savedDesign));
          if (encoded.length < 2000) {
            window.location.hash = '#code/' + encoded;
          }
        } catch (e) {
          // Skip if encoding fails
        }
      }
      
      console.log('Loaded from localStorage');
      return config;
    }
  } catch (e) {
    console.warn('Error loading from localStorage:', e);
  }

  // PRIORITY 5: Default empty template
  console.log('ℹUsing default empty template');
  return EMPTY_EMAIL_MESSAGE;
}

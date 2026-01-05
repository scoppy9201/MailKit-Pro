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

  try {
    const pendingDesign = localStorage.getItem('__PENDING_DESIGN__');
    if (pendingDesign) {
      console.log('Found __PENDING_DESIGN__ from Laravel');
      
      let config = JSON.parse(pendingDesign);
      
      if (config.root && !config.body) {
        console.log('Converting old format (root) to new format (body)');
        
        if (config.root.type === 'EmailLayout') {
          const rootData = config.root.data || {};
          const rootChildren = config.root.children || [];
          
          config = {
            body: {
              type: 'Body',
              data: {
                backdropColor: rootData.backdropColor || '#F5F5F5',
                canvasColor: rootData.canvasColor || '#FFFFFF',
                textColor: rootData.textColor || '#262626',
                fontFamily: rootData.fontFamily || 'MODERN_SANS'
              },
              rows: rootChildren.map((child: any, idx: number) => ({
                id: `row-${idx}`,
                type: child.type || 'Row',
                data: child.data || {},
                children: child.children || []
              }))
            }
          };
        } else {
          config = {
            body: config.root
          };
        }
        
        console.log('Converted to new format');
      }
      
      if (!config.body) {
        console.error('No body in config, creating empty');
        config.body = { rows: [] };
      }
      if (!config.body.rows) {
        console.error('No rows in body, creating empty array');
        config.body.rows = [];
      }
      
      console.log('Loaded design from Laravel:', {
        hasBody: !!config.body,
        rowsCount: config.body.rows.length
      });
      
      localStorage.removeItem('__PENDING_DESIGN__');
      
      // Save to standard keys for persistence
      const configStr = JSON.stringify(config);
      localStorage.setItem('emailDesign', configStr);
      localStorage.setItem('email-builder-design', configStr);
      
      // Update URL hash for bookmarking
      try {
        const encoded = btoa(encodeURIComponent(configStr));
        if (encoded.length < 2000) {
          window.location.hash = '#code/' + encoded;
        }
      } catch (e) {
        console.warn('Cannot update hash:', e);
      }
      
      return config;
    } else {
      console.log('No __PENDING_DESIGN__ found');
    }
  } catch (e) {
    console.error('Error loading __PENDING_DESIGN__:', e);
  }

  if (template && template.startsWith('#sample/')) {
    const sampleName = template.replace('#sample/', '');
    console.log('Loading sample:', sampleName);
    
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

  if (template && template.startsWith('#code/')) {
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
      console.error('Couldn\'t load configuration from hash:', e);
    }
  }

  try {
    const savedDesign = localStorage.getItem('emailDesign') || 
                       localStorage.getItem('email-builder-design');
    
    if (savedDesign) {
      console.log('Loading from localStorage');
      
      const config = JSON.parse(savedDesign);
      
      if (!config.body || !config.body.rows) {
        console.warn('Invalid localStorage structure, using default');
        throw new Error('Invalid structure');
      }
      
      console.log('Loaded from localStorage:', {
        hasBody: !!config.body,
        rowsCount: config.body.rows.length
      });
      
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
      
      return config;
    }
  } catch (e) {
    console.warn('Error loading from localStorage:', e);
  }

  console.log('Using default empty template');
  return EMPTY_EMAIL_MESSAGE;
}

import { create } from 'zustand';

import getConfiguration from '../../getConfiguration';
import EMPTY_EMAIL_MESSAGE from '../../getConfiguration/sample/empty-email-message';

import { TEditorConfiguration } from './core';

type TValue = {
  document: TEditorConfiguration;

  selectedBlockId: string | null;
  selectedSidebarTab: 'block-configuration' | 'styles';
  selectedMainTab: 'editor' | 'preview' | 'json' | 'html';
  selectedScreenSize: 'desktop' | 'mobile';

  inspectorDrawerOpen: boolean;
  samplesDrawerOpen: boolean;
};

const initialDocument = getConfiguration(window.location.hash);
console.log('Store initializing with document:', {
  hasRows: initialDocument?.body?.rows?.length || 0,
  source: window.location.hash ? 'hash' : 'default'
});

const editorStateStore = create<TValue>(() => ({
  document: initialDocument,
  selectedBlockId: null,
  selectedSidebarTab: 'styles',
  selectedMainTab: 'editor',
  selectedScreenSize: 'desktop',

  inspectorDrawerOpen: true,
  samplesDrawerOpen: true,
}));

let saveTimeout: NodeJS.Timeout | null = null;
editorStateStore.subscribe((state) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(() => {
    try {
      const designStr = JSON.stringify(state.document);
      localStorage.setItem('emailDesign', designStr);
      localStorage.setItem('email-builder-design', designStr);
      console.log('Auto-saved to localStorage');
      
      try {
        const encoded = btoa(encodeURIComponent(designStr));
        if (encoded.length < 2000) { 
          const newHash = '#' + encoded;
          if (window.location.hash !== newHash) {
            history.replaceState(null, '', newHash);
          }
        }
      } catch (e) {}
    } catch (e) {
      console.error('Auto-save error:', e);
    }
  }, 1000); 
});

export function useDocument() {
  return editorStateStore((s) => s.document);
}

export function useSelectedBlockId() {
  return editorStateStore((s) => s.selectedBlockId);
}

export function useSelectedScreenSize() {
  return editorStateStore((s) => s.selectedScreenSize);
}

export function useSelectedMainTab() {
  return editorStateStore((s) => s.selectedMainTab);
}

export function setSelectedMainTab(selectedMainTab: TValue['selectedMainTab']) {
  return editorStateStore.setState({ selectedMainTab });
}

export function useSelectedSidebarTab() {
  return editorStateStore((s) => s.selectedSidebarTab);
}

export function useInspectorDrawerOpen() {
  return editorStateStore((s) => s.inspectorDrawerOpen);
}

export function useSamplesDrawerOpen() {
  return editorStateStore((s) => s.samplesDrawerOpen);
}

export function setSelectedBlockId(selectedBlockId: TValue['selectedBlockId']) {
  const selectedSidebarTab = selectedBlockId === null ? 'styles' : 'block-configuration';
  const options: Partial<TValue> = {};
  if (selectedBlockId !== null) {
    options.inspectorDrawerOpen = true;
  }
  return editorStateStore.setState({
    selectedBlockId,
    selectedSidebarTab,
    ...options,
  });
}

export function setSidebarTab(selectedSidebarTab: TValue['selectedSidebarTab']) {
  return editorStateStore.setState({ selectedSidebarTab });
}

export function resetDocument(document: TValue['document']) {
  console.log('resetDocument called');
  return editorStateStore.setState({
    document,
    selectedSidebarTab: 'styles',
    selectedBlockId: null,
  });
}

export function setDocument(document: TValue['document']) {
  const originalDocument = editorStateStore.getState().document;
  return editorStateStore.setState({
    document: {
      ...originalDocument,
      ...document,
    },
  });
}

export function toggleInspectorDrawerOpen() {
  const inspectorDrawerOpen = !editorStateStore.getState().inspectorDrawerOpen;
  return editorStateStore.setState({ inspectorDrawerOpen });
}

export function toggleSamplesDrawerOpen() {
  const samplesDrawerOpen = !editorStateStore.getState().samplesDrawerOpen;
  return editorStateStore.setState({ samplesDrawerOpen });
}

export function setSelectedScreenSize(selectedScreenSize: TValue['selectedScreenSize']) {
  return editorStateStore.setState({ selectedScreenSize });
}

export function getCurrentDesign(): TEditorConfiguration {
  return editorStateStore.getState().document;
}

export function loadDesignFromExternal(design: TEditorConfiguration): boolean {
  console.log('loadDesignFromExternal called');
  
  if (!design) {
    console.error('Invalid design structure: design is null/undefined');
    return false;
  }
  
  // Check if has valid structure
  const hasBody = design.body && typeof design.body === 'object';
  const hasRoot = design.root && typeof design.root === 'object';
  
  if (!hasBody && !hasRoot) {
    console.error('Invalid design structure: missing both body and root');
    return false;
  }
  
  try {
    console.log('Design structure:', { hasBody, hasRoot });
    
    resetDocument(design);
    const designStr = JSON.stringify(design);
    localStorage.setItem('emailDesign', designStr);
    localStorage.setItem('email-builder-design', designStr);
    
    console.log('Design loaded successfully');
    return true;
  } catch (e) {
    console.error('Error loading design:', e);
    return false;
  }
}

export function clearDesign(): void {
  console.log('Clearing design...');
  
  resetDocument(EMPTY_EMAIL_MESSAGE);
  
  localStorage.removeItem('emailDesign');
  localStorage.removeItem('email-builder-design');
  localStorage.removeItem('__PENDING_DESIGN__');
  
  window.location.hash = '';
}

export function renderEmailHtml(): string {
  try {
    const root = window.document.getElementById('root');
    if (!root) {
      throw new Error('Root element not found');
    }

    console.log('Searching for email content...');

    // Helper function to clean HTML
    const cleanHtml = (element: HTMLElement): string => {
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Remove all MUI elements
      clone.querySelectorAll('[class*="Mui"]').forEach(el => el.remove());
      clone.querySelectorAll('[class*="css-"]').forEach(el => el.remove());
      
      // Remove inspector/toolbar elements
      clone.querySelectorAll('[class*="inspector"]').forEach(el => el.remove());
      clone.querySelectorAll('[class*="toolbar"]').forEach(el => el.remove());
      clone.querySelectorAll('[class*="styles"]').forEach(el => el.remove());
      
      return clone.outerHTML;
    };

    // Strategy 1: Find preview container
    const previewContainer = root.querySelector('[data-testid="email-preview"]') ||
                            root.querySelector('[id*="preview"]') ||
                            root.querySelector('[class*="preview"]');
    
    if (previewContainer) {
      const table = previewContainer.querySelector('table[role="presentation"]');
      if (table) {
        console.log('Found email via preview container');
        const wrapper = table.closest('div[style*="background"]');
        if (wrapper) {
          return cleanHtml(wrapper as HTMLElement);
        }
        return table.outerHTML;
      }
    }

    // Strategy 2: Find div with background that contains table
    const allDivs = root.querySelectorAll('div[style]');
    for (let i = 0; i < allDivs.length; i++) {
      const div = allDivs[i] as HTMLElement;
      const style = div.getAttribute('style') || '';
      const className = div.className || '';
      
      if (style.includes('background-color') && 
          !className.includes('Mui') && 
          !className.includes('css-') &&
          div.querySelector('table[role="presentation"]')) {
        
        console.log('Found email wrapper with background');
        return cleanHtml(div);
      }
    }

    // Strategy 3: Find table by attributes
    const tables = root.querySelectorAll('table[role="presentation"]');
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i] as HTMLElement;
      const style = table.getAttribute('style') || '';
      const width = table.getAttribute('width');

      // Skip UI tables
      if (table.closest('.MuiDrawer-root') ||
          table.closest('.MuiPaper-root') ||
          table.closest('[class*="Mui"]')) {
        console.log('Skipping UI table');
        continue;
      }
      
      if (width || style.includes('width')) {
        console.log('Found email table by width');
        const wrapper = table.closest('div[style*="background"]');
        if (wrapper) {
          return cleanHtml(wrapper as HTMLElement);
        }
        return table.outerHTML;
      }
    }
    
    // Strategy 4: Find table with most content
    let maxTextLength = 0;
    let bestTable: HTMLElement | null = null;
    
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i] as HTMLElement;
      
      // Skip UI tables
      if (table.closest('.MuiDrawer-root') || 
          table.closest('[class*="Mui"]') ||
          table.closest('[class*="toolbar"]') ||
          table.closest('[class*="inspector"]')) {
        continue;
      }
      
      const textLength = (table.textContent || '').length;
      if (textLength > maxTextLength) {
        maxTextLength = textLength;
        bestTable = table;
      }
    }
    
    if (bestTable) {
      console.log('Found email by max content length:', maxTextLength);
      const wrapper = bestTable.closest('div[style*="background"]');
      if (wrapper) {
        return cleanHtml(wrapper as HTMLElement);
      }
      return bestTable.outerHTML;
    }

    // Strategy 5: Fallback - first valid table
    const firstValidTable = Array.from(tables).find(table => 
      !table.closest('.MuiDrawer-root') && 
      !table.closest('[class*="Mui"]')
    ) as HTMLElement | undefined;
    
    if (firstValidTable) {
      console.warn('Using first valid table fallback');
      const wrapper = firstValidTable.closest('div[style*="background"]');
      if (wrapper) {
        return cleanHtml(wrapper as HTMLElement);
      }
      return firstValidTable.outerHTML;
    }
    
    throw new Error('Email content not found in DOM');
    
  } catch (error) {
    console.error('Render error:', error);
    throw error;
  }
}

export function exportEmail(): { design: TEditorConfiguration; html: string } {
  const design = getCurrentDesign();
  let html = renderEmailHtml();
  
  console.log('Export result (before cleaning):', {
    htmlLength: html.length,
    hasMuiClass: html.includes('Mui'),
  });

  if (html.includes('Mui') || html.includes('css-')) {
    console.log('HTML contains UI elements, cleaning...');

    let previousLength = '';
    let maxIterations = 5;
    
    // Keep cleaning until no more changes or max iterations
    while (html !== previousLength && maxIterations > 0) {
      previousLength = html;
      
      // Pass 1: Remove divs with Mui classes (non-greedy)
      html = html.replace(/<div[^>]*class="[^"]*Mui[^"]*"[^>]*>(?:(?!<div).)*?<\/div>/gi, '');
      html = html.replace(/<div[^>]*class="[^"]*css-[^"]*"[^>]*>(?:(?!<div).)*?<\/div>/gi, '');
      
      // Pass 2: Remove position relative wrappers
      html = html.replace(/<div style="position:\s*relative;">\s*&nbsp;\s*<\/div>/gi, '');
      html = html.replace(/<div style="position:\s*relative;">\s*<\/div>/gi, '');
      
      // Pass 3: Remove any remaining class references
      html = html.replace(/class="[^"]*(?:Mui|css-)[^"]*"/gi, '');
      
      // Pass 4: Remove empty divs
      html = html.replace(/<div[^>]*>\s*<\/div>/gi, '');
      
      maxIterations--;
    }
    
    // Pass 5: Final cleanup - whitespace
    html = html.replace(/(\r?\n\s*){3,}/g, '\n\n');
    html = html.replace(/>\s+</g, '><');
    
    console.log('Cleaned HTML:', {
      htmlLength: html.length,
      hasMuiClass: html.includes('Mui'),
      iterations: 5 - maxIterations
    });
  }

  if (html.includes('MuiDrawer') || html.includes('MuiPaper')) {
    console.warn('WARNING: Some UI elements may remain in HTML');
  }

  if (!html.includes('<table')) {
    console.error('ERROR: No table found in HTML!');
    throw new Error('Export failed: No email table found');
  }
  
  console.log('Export successful:', html.length, 'chars');
  return { design, html };
}

if (typeof window !== 'undefined') {
  (window as any).__EMAIL_BUILDER_STORE__ = editorStateStore;
  (window as any).loadDesignFromExternal = loadDesignFromExternal;
  (window as any).getCurrentDesign = getCurrentDesign;
  (window as any).clearDesign = clearDesign;
  (window as any).renderEmailHtml = renderEmailHtml;
  (window as any).exportEmail = exportEmail;
  
  console.log('Store exposed to window object');
}
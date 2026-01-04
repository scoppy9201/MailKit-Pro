import { create } from 'zustand';

import getConfiguration from '../../getConfiguration';

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

// Initialize with configuration (supports localStorage, URL hash, etc.)
const initialDocument = getConfiguration(window.location.hash);
console.log('📦 Store initializing with document:', {
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
  
  if (!design || !design.body) {
    console.error('Invalid design structure');
    return false;
  }
  
  try {
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
  
  const emptyDesign: TEditorConfiguration = {
    body: {
      rows: []
    }
  } as TEditorConfiguration;
  
  resetDocument(emptyDesign);
  
  localStorage.removeItem('emailDesign');
  localStorage.removeItem('email-builder-design');
  localStorage.removeItem('__PENDING_DESIGN__');
  
  window.location.hash = '';
}

if (typeof window !== 'undefined') {
  (window as any).__EMAIL_BUILDER_STORE__ = editorStateStore;
  (window as any).loadDesignFromExternal = loadDesignFromExternal;
  (window as any).getCurrentDesign = getCurrentDesign;
  (window as any).clearDesign = clearDesign;
  
  console.log('Store exposed to window object');
}

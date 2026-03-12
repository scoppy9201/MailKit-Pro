

import { AppRegistrationOutlined, LastPageOutlined } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';

import { toggleInspectorDrawerOpen, useInspectorDrawerOpen } from '../../documents/editor/EditorContext';

export default function ToggleInspectorPanelButton() {
  const inspectorDrawerOpen = useInspectorDrawerOpen();

  return (
    <Tooltip title={inspectorDrawerOpen ? 'Hide inspector' : 'Show inspector'} placement="left">
      <Box
        onClick={toggleInspectorDrawerOpen}
        style={{ color: inspectorDrawerOpen ? 'var(--brand-color)' : 'var(--crm-text-2)' }}
        sx={{
          width: 32, height: 32,
          borderRadius: '7px',
          border: '1px solid',
          borderColor: inspectorDrawerOpen ? 'var(--brand-color-alpha35)' : 'var(--crm-border)',
          background:  inspectorDrawerOpen ? 'var(--brand-color-alpha12)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s',
          '&:hover': {
            background:  inspectorDrawerOpen ? 'var(--brand-color-alpha18)' : 'var(--crm-border)',
            borderColor: inspectorDrawerOpen ? 'var(--brand-color-alpha50)' : 'var(--crm-text-3)',
            color:       inspectorDrawerOpen ? 'var(--brand-color)'         : 'var(--crm-text-1)',
          },
        }}
      >
        {inspectorDrawerOpen
          ? <LastPageOutlined sx={{ fontSize: 16, color: 'inherit' }} />
          : <AppRegistrationOutlined sx={{ fontSize: 16, color: 'inherit' }} />
        }
      </Box>
    </Tooltip>
  );
}
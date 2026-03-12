

import { FirstPageOutlined, MenuOutlined } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';

import { toggleSamplesDrawerOpen, useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

export default function ToggleSamplesPanelButton() {
  const samplesDrawerOpen = useSamplesDrawerOpen();

  return (
    <Tooltip title={samplesDrawerOpen ? 'Hide templates' : 'Show templates'} placement="right">
      <Box
        onClick={toggleSamplesDrawerOpen}
        style={{ color: samplesDrawerOpen ? 'var(--brand-color)' : 'var(--crm-text-2)' }}
        sx={{
          width: 32, height: 32,
          borderRadius: '7px',
          border: '1px solid',
          borderColor: samplesDrawerOpen ? 'var(--brand-color-alpha35)' : 'var(--crm-border)',
          background:  samplesDrawerOpen ? 'var(--brand-color-alpha12)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s',
          '&:hover': {
            background:  samplesDrawerOpen ? 'var(--brand-color-alpha18)' : 'var(--crm-border)',
            borderColor: samplesDrawerOpen ? 'var(--brand-color-alpha50)' : 'var(--crm-text-3)',
            color:       samplesDrawerOpen ? 'var(--brand-color)'         : 'var(--crm-text-1)',
          },
        }}
      >
        {samplesDrawerOpen
          ? <FirstPageOutlined sx={{ fontSize: 16, color: 'inherit' }} />
          : <MenuOutlined sx={{ fontSize: 16, color: 'inherit' }} />
        }
      </Box>
    </Tooltip>
  );
}
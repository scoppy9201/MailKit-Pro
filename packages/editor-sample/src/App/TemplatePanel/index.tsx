import { MonitorOutlined, PhoneIphoneOutlined } from '@mui/icons-material';
import { Box, Stack, SxProps, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Reader } from '@usewaypoint/email-builder';

import EditorBlock from '../../documents/editor/EditorBlock';
import {
  setSelectedScreenSize,
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
} from '../../documents/editor/EditorContext';
import ToggleInspectorPanelButton from '../InspectorDrawer/ToggleInspectorPanelButton';
import ToggleSamplesPanelButton from '../SamplesDrawer/ToggleSamplesPanelButton';

import DownloadJson from './DownloadJson';
import HtmlPanel from './HtmlPanel';
import ImportJson from './ImportJson';
import JsonPanel from './JsonPanel';
import MainTabsGroup from './MainTabsGroup';
import ShareButton from './ShareButton';

export default function TemplatePanel() {
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();

  let mainBoxSx: SxProps = {
    height: '100%',
  };
  if (selectedScreenSize === 'mobile') {
    mainBoxSx = {
      ...mainBoxSx,
      margin: '32px auto',
      width: 370,
      height: 800,
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      borderRadius: '16px',
      overflow: 'hidden',
    };
  }

  const handleScreenSizeChange = (_: unknown, value: unknown) => {
    switch (value) {
      case 'mobile':
      case 'desktop':
        setSelectedScreenSize(value);
        return;
      default:
        setSelectedScreenSize('desktop');
    }
  };

  const renderMainPanel = () => {
    switch (selectedMainTab) {
      case 'editor':
        return (
          <Box sx={mainBoxSx}>
            <EditorBlock id="root" />
          </Box>
        );
      case 'preview':
        return (
          <Box sx={mainBoxSx}>
            <Reader document={document} rootBlockId="root" />
          </Box>
        );
      case 'html':
        return <HtmlPanel />;
      case 'json':
        return <JsonPanel />;
    }
  };

  return (
    <>
      <Stack
        sx={{
          height: 49,
          borderBottom: '1px solid var(--crm-border)',
          background: 'var(--crm-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 'appBar',
          px: 1.5,
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ToggleSamplesPanelButton />
        </Box>

        <Stack direction="row" alignItems="center" gap={1.5} sx={{ flex: 1, px: 2, flexWrap: 'nowrap', minWidth: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
            <MainTabsGroup />
          </Box>

          <Box sx={{ width: '1px', height: 24, background: 'var(--crm-border)', flexShrink: 0 }} />

            <ToggleButtonGroup
              value={selectedScreenSize}
              exclusive
              size="small"
              onChange={handleScreenSizeChange}
              sx={{
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--crm-border)',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: '0 !important',
                  color: 'var(--crm-text-2)',
                  fontSize: 12,
                  fontWeight: 500,
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.6,
                  gap: 0.5,
                  '&:hover': {
                    background: 'var(--crm-border)',
                    color: 'var(--crm-text-1)',
                  },
                  '&.Mui-selected': {
                    background: 'var(--brand-color-alpha12)',
                    color: 'var(--brand-color)',
                    '&:hover': {
                      background: 'var(--brand-color-alpha20)',
                    },
                  },
                },
              }}
            >
            <ToggleButton value="desktop">
              <Tooltip title="Desktop view">
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <MonitorOutlined sx={{ fontSize: 15 }} />
                  <span>Desktop</span>
                </Stack>
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="mobile">
              <Tooltip title="Mobile view">
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <PhoneIphoneOutlined sx={{ fontSize: 15 }} />
                  <span>Mobile</span>
                </Stack>
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <DownloadJson />
            <ImportJson />
            <ShareButton />
          </Stack>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ToggleInspectorPanelButton />
        </Box>
      </Stack>

      <Box
        sx={{
          height: 'calc(100vh - 49px)',
          overflow: 'auto',
          minWidth: 370,
          background: 'var(--crm-bg)',
        }}
      >
        {renderMainPanel()}
      </Box>
    </>
  );
}
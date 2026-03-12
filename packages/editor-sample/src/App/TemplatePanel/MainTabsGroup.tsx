import { CodeOutlined, DataObjectOutlined, EditOutlined, PreviewOutlined } from '@mui/icons-material';
import { Box, Stack, Tooltip } from '@mui/material';
import { setSelectedMainTab, useSelectedMainTab } from '../../documents/editor/EditorContext';

const TABS = [
  { value: 'editor',  label: 'Edit',    icon: <EditOutlined sx={{ fontSize: 14, color: 'inherit' }} />,      tooltip: 'Edit template' },
  { value: 'preview', label: 'Preview', icon: <PreviewOutlined sx={{ fontSize: 14, color: 'inherit' }} />,   tooltip: 'Preview email' },
  { value: 'html',    label: 'HTML',    icon: <CodeOutlined sx={{ fontSize: 14, color: 'inherit' }} />,       tooltip: 'HTML output' },
  { value: 'json',    label: 'JSON',    icon: <DataObjectOutlined sx={{ fontSize: 14, color: 'inherit' }} />, tooltip: 'JSON output' },
] as const;

export default function MainTabsGroup() {
  const selectedMainTab = useSelectedMainTab();
  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      {TABS.map((tab) => {
        const isActive = selectedMainTab === tab.value;
        return (
          <Tooltip key={tab.value} title={tab.tooltip} placement="bottom">
            <Box
              onClick={() => setSelectedMainTab(tab.value)}
              data-tab-btn=""
              data-active={isActive ? 'true' : 'false'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                px: 1.5,
                py: 0.65,
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.15s',
                color: isActive ? 'var(--brand-color)' : 'var(--crm-text-2)',
                background: isActive ? 'var(--brand-color-alpha12)' : 'transparent',
                '&:hover': {
                  color: 'var(--crm-text-1)',
                  background: 'var(--crm-border)',
                },
              }}
            >
              {tab.icon}
              {tab.label}
            </Box>
          </Tooltip>
        );
      })}
    </Stack>
  );
}
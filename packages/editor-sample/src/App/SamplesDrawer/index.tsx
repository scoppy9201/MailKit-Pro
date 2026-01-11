import React from 'react';

import { Box, Drawer, Stack, Typography, Chip } from '@mui/material';
import { 
  Mail, 
  FileText, 
  Key, 
  Lock, 
  ShoppingCart, 
  CreditCard, 
  Calendar, 
  BarChart, 
  MessageCircle 
} from 'lucide-react';

import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

import SidebarButton from './SidebarButton';

export const SAMPLES_DRAWER_WIDTH = 280;

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
        '& .MuiDrawer-paper': {
          background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
          borderRight: '1px solid #e0e0e0',
        }
      }}
    >
      <Stack 
        spacing={3} 
        py={3} 
        px={2.5} 
        width={SAMPLES_DRAWER_WIDTH} 
        height="100%"
      >
        {/* Header Section */}
        <Box>
          <Typography 
            variant="overline" 
            sx={{ 
              color: '#666',
              fontWeight: 600,
              letterSpacing: 1.2,
              fontSize: '0.7rem'
            }}
          >
            EMAIL TEMPLATES
          </Typography>
          <Chip 
            label="9 Templates" 
            size="small" 
            sx={{ 
              mt: 1,
              height: 20,
              fontSize: '0.7rem',
              bgcolor: '#e3f2fd',
              color: '#1976d2',
              fontWeight: 600
            }} 
          />
        </Box>

        {/* Templates List */}
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: 2, transition: 'all 0.2s', '&:hover': { bgcolor: '#e3f2fd', transform: 'translateX(4px)' } }}>
            <FileText size={18} color="#666" />
            <SidebarButton href="#">Empty</SidebarButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: 2, transition: 'all 0.2s', '&:hover': { bgcolor: '#e3f2fd', transform: 'translateX(4px)' } }}>
            <Mail size={18} color="#666" />
            <SidebarButton href="#sample/welcome">Welcome Email</SidebarButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: 2, transition: 'all 0.2s', '&:hover': { bgcolor: '#e3f2fd', transform: 'translateX(4px)' } }}>
            <Key size={18} color="#666" />
            <SidebarButton href="#sample/one-time-password">One-time Passcode</SidebarButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: 2, transition: 'all 0.2s', '&:hover': { bgcolor: '#e3f2fd', transform: 'translateX(4px)' } }}>
            <Lock size={18} color="#666" />
            <SidebarButton href="#sample/reset-password">Reset Password</SidebarButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: 2, transition: 'all 0.2s', '&:hover': { bgcolor: '#e3f2fd', transform: 'translateX(4px)' } }}>
            <ShoppingCart size={18} color="#666" />
            <SidebarButton href="#sample/order-ecomerce">E-commerce Receipt</SidebarButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: 2, transition: 'all 0.2s', '&:hover': { bgcolor: '#e3f2fd', transform: 'translateX(4px)' } }}>
            <CreditCard size={18} color="#666" />
            <SidebarButton href="#sample/subscription-receipt">Subscription Receipt</SidebarButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: 2, transition: 'all 0.2s', '&:hover': { bgcolor: '#e3f2fd', transform: 'translateX(4px)' } }}>
            <Calendar size={18} color="#666" />
            <SidebarButton href="#sample/reservation-reminder">Reservation Reminder</SidebarButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: 2, transition: 'all 0.2s', '&:hover': { bgcolor: '#e3f2fd', transform: 'translateX(4px)' } }}>
            <BarChart size={18} color="#666" />
            <SidebarButton href="#sample/post-metrics-report">Post Metrics</SidebarButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: 2, transition: 'all 0.2s', '&:hover': { bgcolor: '#e3f2fd', transform: 'translateX(4px)' } }}>
            <MessageCircle size={18} color="#666" />
            <SidebarButton href="#sample/respond-to-message">Respond to Inquiry</SidebarButton>
          </Box>
        </Stack>

        {/* Footer Info */}
        <Box 
          sx={{ 
            mt: 'auto',
            pt: 3,
            borderTop: '1px solid #e0e0e0'
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#999',
              display: 'block',
              textAlign: 'center'
            }}
          >
            Select a template to get started
          </Typography>
        </Box>
      </Stack>
    </Drawer>
  );
}
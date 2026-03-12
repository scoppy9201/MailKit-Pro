import React from 'react';

import { Box, Drawer, Stack, Typography, Chip, Divider, InputBase } from '@mui/material';
import { Search } from '@mui/icons-material';
import {
  Mail, FileText, Key, Lock, ShoppingCart, CreditCard, Calendar,
  BarChart, MessageCircle, Tag, Newspaper, Rocket, RefreshCw, Gift,
  Sun, UserCheck, Handshake, Star, TrendingUp, AlertCircle, Heart, Users,
} from 'lucide-react';

import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';
import SidebarButton from './SidebarButton';

export const SAMPLES_DRAWER_WIDTH = 260;

function TemplateRow({ icon, href, label, tag }: {
  icon: React.ReactNode; href: string; label: string; tag?: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        px: 1.25, py: 0.85,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        border: '1px solid transparent',
        '&:hover': {
          background: 'var(--brand-color-alpha08)',
          borderColor: 'var(--brand-color-alpha15)',
          '& .tpl-label': { color: 'var(--brand-color)' },
        },
      }}
    >
      <Box sx={{
        width: 28, height: 28, borderRadius: '7px',
        background: 'var(--crm-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <SidebarButton href={href}>
          <Typography className="tpl-label" sx={{
            fontSize: '12px', fontWeight: 500,
            color: 'var(--crm-text-2)',
            transition: 'color 0.15s',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {label}
          </Typography>
        </SidebarButton>
      </Box>
      {tag && (
        <Typography sx={{ fontSize: '10px', color: 'var(--crm-text-3)', flexShrink: 0 }}>
          {tag}
        </Typography>
      )}
    </Box>
  );
}

function SectionLabel({ label, count, color, bg }: {
  label: string; count: number; color: string; bg: string;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.25, pt: 1.75, pb: 0.5 }}>
      <Typography sx={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.9px', color: 'var(--crm-text-3)', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Chip label={count} size="small" sx={{
        height: 16, fontSize: '10px', fontWeight: 700,
        bgcolor: bg, color,
        '& .MuiChip-label': { px: '6px' },
      }} />
    </Box>
  );
}

const ic = (C: React.ElementType, color = 'rgba(255,255,255,0.3)') => (
  <C size={14} color={color} style={{ flexShrink: 0 }} />
);

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SAMPLES_DRAWER_WIDTH,
          background: 'var(--crm-surface)',
          borderRight: '1px solid var(--crm-border)',
          overflowX: 'hidden',
        },
      }}
    >
      <Stack height="100%">

        {/* ── Header ── */}
        <Box sx={{
          px: 2, pt: 2, pb: 1.5,
          borderBottom: '1px solid var(--crm-border)',
          background: 'var(--crm-surface)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.9px', color: 'var(--crm-text-3)', textTransform: 'uppercase' }}>
              Templates
            </Typography>
            <Chip label="24" size="small" sx={{
              height: 18, fontSize: '10px', fontWeight: 700,
              bgcolor: 'var(--brand-color-alpha15)',
              color: 'var(--brand-color)',
              border: '1px solid var(--brand-color-alpha20)',
              '& .MuiChip-label': { px: '7px' },
            }} />
          </Box>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            background: 'var(--crm-bg)',
            border: '1px solid var(--crm-border)',
            borderRadius: '8px', px: 1.25, py: 0.75,
            '&:focus-within': {
              borderColor: 'var(--brand-color-alpha40)',
              background: 'var(--brand-color-alpha05)',
            },
          }}>
            <Search sx={{ fontSize: 13, color: 'var(--crm-text-3)' }} />
            <InputBase placeholder="Search templates..." sx={{
              fontSize: '12px', color: 'var(--crm-text-1)', flex: 1,
              '& input::placeholder': { color: 'var(--crm-text-3)', opacity: 1 },
            }} />
          </Box>
        </Box>

        {/* ── List ── */}
        <Box sx={{
          flex: 1, overflowY: 'auto', px: 1, pb: 2,
          '&::-webkit-scrollbar': { width: '3px' },
          '&::-webkit-scrollbar-thumb': { background: 'var(--crm-border)', borderRadius: '3px' },
        }}>
          <SectionLabel label="General" count={5} color="var(--brand-color)" bg="var(--brand-color-alpha12)" />
          <TemplateRow icon={ic(FileText)}      href="#"                           label="Empty"              tag="blank" />
          <TemplateRow icon={ic(Mail)}          href="#sample/welcome"             label="Welcome Email" />
          <TemplateRow icon={ic(Key)}           href="#sample/one-time-password"   label="One-time Passcode" />
          <TemplateRow icon={ic(Lock)}          href="#sample/reset-password"      label="Reset Password" />
          <TemplateRow icon={ic(MessageCircle)} href="#sample/respond-to-message"  label="Respond to Inquiry" />

          <Divider sx={{ borderColor: 'var(--crm-border)', my: 0.5 }} />

          <SectionLabel label="Transactional" count={3} color="#34d399" bg="rgba(52,211,153,0.1)" />
          <TemplateRow icon={ic(ShoppingCart,'rgba(52,211,153,0.55)')}  href="#sample/order-ecomerce"       label="E-commerce Receipt" />
          <TemplateRow icon={ic(CreditCard,  'rgba(52,211,153,0.55)')}  href="#sample/subscription-receipt" label="Subscription Receipt" />
          <TemplateRow icon={ic(Calendar,    'rgba(52,211,153,0.55)')}  href="#sample/reservation-reminder" label="Reservation Reminder" />

          <Divider sx={{ borderColor: 'var(--crm-border)', my: 0.5 }} />

          <SectionLabel label="Marketing" count={6} color="#fb923c" bg="rgba(251,146,60,0.1)" />
          <TemplateRow icon={ic(Newspaper,   'rgba(251,146,60,0.55)')}  href="#sample/newsletter"         label="Newsletter" />
          <TemplateRow icon={ic(Tag,         'rgba(251,146,60,0.55)')}  href="#sample/promotional-offer"  label="Promotional Offer" />
          <TemplateRow icon={ic(ShoppingCart,'rgba(251,146,60,0.55)')}  href="#sample/flash-sale"         label="Flash Sale" />
          <TemplateRow icon={ic(Rocket,      'rgba(251,146,60,0.55)')}  href="#sample/product-launch"     label="Product Launch" />
          <TemplateRow icon={ic(Gift,        'rgba(251,146,60,0.55)')}  href="#sample/referral-program"   label="Referral Program" />
          <TemplateRow icon={ic(Sun,         'rgba(251,146,60,0.55)')}  href="#sample/seasonal-campaign"  label="Seasonal Campaign" />

          <Divider sx={{ borderColor: 'var(--crm-border)', my: 0.5 }} />

          <SectionLabel label="CRM" count={7} color="#c084fc" bg="rgba(192,132,252,0.1)" />
          <TemplateRow icon={ic(UserCheck,  'rgba(192,132,252,0.55)')}  href="#sample/onboarding"        label="Onboarding Series" />
          <TemplateRow icon={ic(Handshake,  'rgba(192,132,252,0.55)')}  href="#sample/follow-up-meeting" label="Follow-up Meeting" />
          <TemplateRow icon={ic(Star,       'rgba(192,132,252,0.55)')}  href="#sample/feedback-survey"   label="Customer Feedback" />
          <TemplateRow icon={ic(TrendingUp, 'rgba(192,132,252,0.55)')}  href="#sample/upsell-crosssell"  label="Upsell / Cross-sell" />
          <TemplateRow icon={ic(RefreshCw,  'rgba(192,132,252,0.55)')}  href="#sample/renewal-reminder"  label="Renewal Reminder" />
          <TemplateRow icon={ic(AlertCircle,'rgba(192,132,252,0.55)')}  href="#sample/churn-prevention"  label="Churn Prevention" />
          <TemplateRow icon={ic(Heart,      'rgba(192,132,252,0.55)')}  href="#sample/loyalty-thankyou"  label="Thank You / Loyalty" />

          <Divider sx={{ borderColor: 'var(--crm-border)', my: 0.5 }} />

          <SectionLabel label="Re-engagement" count={2} color="#f87171" bg="rgba(248,113,113,0.1)" />
          <TemplateRow icon={ic(RefreshCw,'rgba(248,113,113,0.55)')}  href="#sample/winback"      label="Win-back Campaign" />
          <TemplateRow icon={ic(Users,    'rgba(248,113,113,0.55)')}  href="#sample/reactivation" label="Reactivation Email" />

          <Divider sx={{ borderColor: 'var(--crm-border)', my: 0.5 }} />

          <SectionLabel label="Analytics" count={1} color="#60a5fa" bg="rgba(96,165,250,0.1)" />
          <TemplateRow icon={ic(BarChart,'rgba(96,165,250,0.55)')}  href="#sample/post-metrics-report" label="Post Metrics" />

        </Box>

        {/* ── Footer ── */}
        <Box sx={{ px: 2, py: 1.25, borderTop: '1px solid var(--crm-border)' }}>
          <Typography sx={{ fontSize: '11px', color: 'var(--crm-text-3)', textAlign: 'center' }}>
            Click a template to load it
          </Typography>
        </Box>

      </Stack>
    </Drawer>
  );
}
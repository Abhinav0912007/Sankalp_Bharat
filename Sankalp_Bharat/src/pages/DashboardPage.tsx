import React from 'react';
import { Box, Typography, Card, CardContent, useTheme, alpha, Grid } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AssessmentIcon from '@mui/icons-material/Assessment';

/**
 * Dashboard Placeholder — Phase 3 (Sparsh)
 * Will be wired to Jiya's analytics DTOs via Recharts.
 */
const DashboardPage: React.FC = () => {
  const theme = useTheme();

  const placeholderCards = [
    { label: 'Total Emissions', value: '—', icon: <TrendingUpIcon />, color: theme.palette.secondary.main },
    { label: 'Scope 1', value: '—', icon: <DashboardIcon />, color: '#D97706' },
    { label: 'Scope 2', value: '—', icon: <DashboardIcon />, color: '#7C3AED' },
    { label: 'Scope 3 Covered', value: '—', icon: <DashboardIcon />, color: '#2563EB' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" gutterBottom>Dashboard</Typography>
        <Typography variant="subtitle1">
          ESG Control Tower — analytics and charts will be connected in Phase 3
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {placeholderCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: alpha(card.color, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', color: theme.palette.text.disabled }}>
                    {card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 3,
          border: `2px dashed ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 1 }} />
        <Typography variant="h5" sx={{ color: theme.palette.text.secondary }}>
          Charts & Analytics — Phase 3
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mt: 0.5 }}>
          Recharts will render Jiya's aggregated DTO responses here
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 3,
          p: 4,
          borderRadius: 3,
          border: `2px dashed ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <AssessmentIcon sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 1 }} />
        <Typography variant="h5" sx={{ color: theme.palette.text.secondary }}>
          Reports & Scenario Tools — Phase 4
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mt: 0.5 }}>
          What-if scenario sliders and report generation will be built here
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;

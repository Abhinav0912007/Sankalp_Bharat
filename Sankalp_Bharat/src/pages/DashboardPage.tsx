import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, useTheme, alpha, Grid } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

/**
 * Dashboard — Phase 3 (Sparsh)
 * Wired to Jiya's analytics DTOs via Recharts.
 */
const DashboardPage: React.FC = () => {
  const theme = useTheme();

  const [summary, setSummary] = useState<{
    totalEmissions: number;
    scope1: number;
    scope2: number;
    scope3Covered: number;
    dataQualityScore: number;
    openIssues: number;
  } | null>(null);

  const [trends, setTrends] = useState<{ month: string; emissions: number }[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, trendsRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/trends'),
        ]);
        setSummary(summaryRes.data);
        setTrends(trendsRes.data.months || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    { label: 'Total Emissions (tCO₂e)', value: summary ? summary.totalEmissions : '—', icon: <TrendingUpIcon />, color: theme.palette.secondary.main },
    { label: 'Scope 1', value: summary ? summary.scope1 : '—', icon: <DashboardIcon />, color: '#D97706' },
    { label: 'Scope 2', value: summary ? summary.scope2 : '—', icon: <DashboardIcon />, color: '#7C3AED' },
    { label: 'Scope 3 Covered', value: summary ? summary.scope3Covered : '—', icon: <DashboardIcon />, color: '#2563EB' },
  ];

  const pieData = [
    { name: 'Scope 1', value: summary?.scope1 || 0, color: '#D97706' },
    { name: 'Scope 2', value: summary?.scope2 || 0, color: '#7C3AED' },
    { name: 'Scope 3', value: summary?.scope3Covered || 0, color: '#2563EB' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" gutterBottom>Dashboard</Typography>
        <Typography variant="subtitle1">
          ESG Control Tower — Real-time Analytics
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {cards.map((card) => (
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
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', color: theme.palette.text.primary }}>
                    {card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '400px', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.secondary }}>Emission Trends (12 Months)</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
                <Line type="monotone" dataKey="emissions" stroke={theme.palette.primary.main} strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '400px', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.secondary }}>Scope Distribution</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

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

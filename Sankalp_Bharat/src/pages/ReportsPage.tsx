import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

/** Placeholder — Report generation is Phase 4 */
const ReportsPage: React.FC = () => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h2" gutterBottom>Reports</Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Report generation and export — Phase 4 scope
      </Typography>
      <Box sx={{ p: 6, borderRadius: 3, border: `2px dashed ${theme.palette.divider}`, textAlign: 'center' }}>
        <AssessmentIcon sx={{ fontSize: 56, color: theme.palette.text.disabled, mb: 1 }} />
        <Typography variant="h5" sx={{ color: theme.palette.text.secondary }}>Reports — Phase 4</Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>PDF and Excel report generation powered by Jiya's report API</Typography>
      </Box>
    </Box>
  );
};

export default ReportsPage;

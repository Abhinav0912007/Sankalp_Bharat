import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

/** Placeholder — Harsh owns the Supplier Portal UI (Phase 2) */
const SuppliersPage: React.FC = () => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h2" gutterBottom>Suppliers</Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Supplier management portal — owned by Harsh (feature/Harsh-SupplierPortal-Styling)
      </Typography>
      <Box sx={{ p: 6, borderRadius: 3, border: `2px dashed ${theme.palette.divider}`, textAlign: 'center' }}>
        <LocalShippingIcon sx={{ fontSize: 56, color: theme.palette.text.disabled, mb: 1 }} />
        <Typography variant="h5" sx={{ color: theme.palette.text.secondary }}>Supplier Portal — Harsh's Branch</Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>Scope 3 supplier submissions and tracking will be managed here</Typography>
      </Box>
    </Box>
  );
};

export default SuppliersPage;

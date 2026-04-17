import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

/** Placeholder — Atharva owns the Upload UI (Phase 1) */
const UploadPage: React.FC = () => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h2" gutterBottom>Upload Data</Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Drag-and-drop file upload — owned by Atharva (feature/Atharva-Frontend-IngestionUI)
      </Typography>
      <Box sx={{ p: 6, borderRadius: 3, border: `2px dashed ${theme.palette.divider}`, textAlign: 'center' }}>
        <CloudUploadIcon sx={{ fontSize: 56, color: theme.palette.text.disabled, mb: 1 }} />
        <Typography variant="h5" sx={{ color: theme.palette.text.secondary }}>Upload UI — Atharva's Branch</Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>CSV, Excel, PDF, and Image uploads will be handled here</Typography>
      </Box>
    </Box>
  );
};

export default UploadPage;

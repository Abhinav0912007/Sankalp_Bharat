import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  useTheme,
  alpha,
  Fade,
  Card,
  CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import BoltIcon from '@mui/icons-material/Bolt';
import FlightIcon from '@mui/icons-material/Flight';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PropaneIcon from '@mui/icons-material/Propane';
import api, { type Facility, type ManualEntryPayload, type ManualEntryResponse } from '../services/api';
import SOURCE_TYPE_CONFIGS, { type SourceTypeConfig, getSourceTypeConfig } from '../config/sourceTypeConfig';

// Icon mapping
const ICON_MAP: Record<string, React.ReactElement> = {
  LocalGasStation: <LocalGasStationIcon />,
  Bolt: <BoltIcon />,
  Flight: <FlightIcon />,
  Delete: <DeleteIcon />,
  ShoppingCart: <ShoppingCartIcon />,
  Propane: <PropaneIcon />,
};

// Zod validation schema
const manualEntrySchema = z.object({
  facilityId: z.string().min(1, 'Facility is required'),
  sourceType: z.string().min(1, 'Source type is required'),
  activityValue: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number({ message: 'Must be a number' }).positive('Must be greater than 0')
  ),
  periodMonth: z.preprocess((val) => Number(val), z.number().min(1).max(12)),
  periodYear: z.preprocess((val) => Number(val), z.number().min(2020).max(2030)),
  notes: z.string().optional(),
});

type ManualEntryFormInput = {
  facilityId: string;
  sourceType: string;
  activityValue: number | undefined;
  periodMonth: number;
  periodYear: number;
  notes?: string;
};

/**
 * Manual Entry Page — Phase 2 Dynamic Form
 *
 * Toggles input fields based on source type selection:
 * - Fuel types → Liters, Scope 1
 * - Electricity → kWh, Scope 2
 * - Travel → km, Scope 3
 * - Waste → kg, Scope 3
 *
 * All data (facilities, source types) fetched from API — no hardcoded data.
 */
const ManualEntryPage: React.FC = () => {
  const theme = useTheme();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilitiesLoading, setFacilitiesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<ManualEntryResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ManualEntryFormInput>({
    resolver: zodResolver(manualEntrySchema) as any,
    defaultValues: {
      facilityId: '',
      sourceType: '',
      activityValue: undefined,
      periodMonth: new Date().getMonth() + 1,
      periodYear: new Date().getFullYear(),
      notes: '',
    },
    mode: 'onChange',
  });

  const selectedSourceType = watch('sourceType');
  const activeConfig: SourceTypeConfig | undefined = getSourceTypeConfig(selectedSourceType);

  // Fetch facilities from API
  useEffect(() => {
    const fetchFacilities = async () => {
      setFacilitiesLoading(true);
      try {
        const response = await api.get('/facilities');
        const data = response.data?.facilities ?? response.data?.data ?? response.data ?? [];
        setFacilities(Array.isArray(data) ? data : []);
      } catch {
        setFacilities([]);
      } finally {
        setFacilitiesLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  // Submit form
  const onSubmit = async (values: ManualEntryFormInput) => {
    if (!activeConfig) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);

    const payload: ManualEntryPayload = {
      facilityId: values.facilityId,
      sourceType: values.sourceType,
      scope: activeConfig.scope,
      category: activeConfig.category,
      activityValue: values.activityValue!,
      activityUnit: activeConfig.unit,
      periodMonth: values.periodMonth,
      periodYear: values.periodYear,
      notes: values.notes,
    };

    try {
      const response = await api.post('/records/manual', payload);
      setSubmitResult(response.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit record';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setSubmitResult(null);
    setSubmitError(null);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" gutterBottom>
          Manual Data Entry
        </Typography>
        <Typography variant="subtitle1">
          Record emission activity data — form adapts dynamically based on source type
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Form Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '14px',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2.5}>
                {/* Facility Selector */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="facilityId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.facilityId}>
                        <InputLabel id="facility-label">Facility</InputLabel>
                        <Select
                          {...field}
                          labelId="facility-label"
                          label="Facility"
                          disabled={facilitiesLoading}
                        >
                          {facilitiesLoading ? (
                            <MenuItem disabled>Loading facilities...</MenuItem>
                          ) : facilities.length === 0 ? (
                            <MenuItem disabled>No facilities available — check backend</MenuItem>
                          ) : (
                            facilities.map((f) => (
                              <MenuItem key={f.id} value={f.id}>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {f.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                    {f.location} • {f.type}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {errors.facilityId && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                            {errors.facilityId.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Source Type Selector */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="sourceType"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.sourceType}>
                        <InputLabel id="source-type-label">Source Type</InputLabel>
                        <Select
                          {...field}
                          labelId="source-type-label"
                          label="Source Type"
                        >
                          {SOURCE_TYPE_CONFIGS.map((config) => (
                            <MenuItem key={config.key} value={config.key}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ color: config.color, display: 'flex' }}>
                                  {ICON_MAP[config.iconName]}
                                </Box>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {config.label}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                    {config.unitLabel} • {config.scopeLabel.split('—')[0].trim()}
                                  </Typography>
                                </Box>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.sourceType && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                            {errors.sourceType.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Dynamic context indicator */}
                {activeConfig && (
                  <Grid size={12}>
                    <Fade in>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: alpha(activeConfig.color, 0.06),
                          border: `1px solid ${alpha(activeConfig.color, 0.15)}`,
                        }}
                      >
                        <Box sx={{ color: activeConfig.color, display: 'flex' }}>
                          {ICON_MAP[activeConfig.iconName]}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: activeConfig.color }}>
                            {activeConfig.label} — {activeConfig.scopeLabel}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            Category: {activeConfig.category} • Unit: {activeConfig.unitLabel}
                          </Typography>
                        </Box>
                        <Chip
                          label={activeConfig.scope.replace('_', ' ')}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            backgroundColor: alpha(activeConfig.color, 0.12),
                            color: activeConfig.color,
                          }}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                )}

                <Grid size={12}>
                  <Divider />
                </Grid>

                {/* Activity Value — unit dynamically changes */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="activityValue"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Activity Value"
                        type="number"
                        placeholder={activeConfig?.placeholder || 'Enter value'}
                        error={!!errors.activityValue}
                        helperText={errors.activityValue?.message}
                        slotProps={{
                          input: {
                            endAdornment: activeConfig ? (
                              <InputAdornment position="end">
                                <Chip
                                  label={activeConfig.unitLabel}
                                  size="small"
                                  sx={{
                                    fontWeight: 700,
                                    backgroundColor: alpha(activeConfig.color, 0.1),
                                    color: activeConfig.color,
                                    fontSize: '0.7rem',
                                  }}
                                />
                              </InputAdornment>
                            ) : undefined,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Auto-populated scope & category (read-only) */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Emission Scope"
                    value={activeConfig?.scopeLabel || 'Select a source type first'}
                    slotProps={{
                      input: { readOnly: true },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.03),
                      },
                    }}
                  />
                </Grid>

                {/* Period */}
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Controller
                    name="periodMonth"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Month</InputLabel>
                        <Select {...field} label="Month">
                          {months.map((m, i) => (
                            <MenuItem key={i} value={i + 1}>
                              {m}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 3 }}>
                  <Controller
                    name="periodYear"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Year"
                        type="number"
                        slotProps={{
                          htmlInput: { min: 2020, max: 2030 },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Category"
                    value={activeConfig?.category || 'Auto-populated by source type'}
                    slotProps={{
                      input: { readOnly: true },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.03),
                      },
                    }}
                  />
                </Grid>

                {/* Notes */}
                <Grid size={12}>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Notes (optional)"
                        multiline
                        rows={2}
                        placeholder="Add context about this entry..."
                      />
                    )}
                  />
                </Grid>

                {/* Submit */}
                <Grid size={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      disabled={submitting}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      disabled={submitting || !isValid || !activeConfig}
                      startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                      sx={{ minWidth: 160 }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Record'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>

            {/* Error */}
            {submitError && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {submitError}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Right column — Source type cards + Result */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Success result */}
          {submitResult && (
            <Fade in>
              <Card
                sx={{
                  mb: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.success.light, 0.04)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                    <Typography variant="h5" sx={{ color: theme.palette.success.dark }}>
                      Record Created
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Record ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {submitResult.recordId}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Calculated CO₂e</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {submitResult.calculatedEmissions.toLocaleString()} kg
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Status</Typography>
                      <Chip
                        label={submitResult.status}
                        size="small"
                        color="success"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          )}

          {/* Source type quick reference */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '14px',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Source Types
            </Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {SOURCE_TYPE_CONFIGS.map((config) => (
                <Box
                  key={config.key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1,
                    borderRadius: 1.5,
                    backgroundColor:
                      selectedSourceType === config.key
                        ? alpha(config.color, 0.08)
                        : 'transparent',
                    border: `1px solid ${
                      selectedSourceType === config.key
                        ? alpha(config.color, 0.2)
                        : 'transparent'
                    }`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ color: config.color, display: 'flex', fontSize: 18 }}>
                    {ICON_MAP[config.iconName]}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                      {config.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {config.unitLabel}
                    </Typography>
                  </Box>
                  <Chip
                    label={config.scope.replace('_', ' ')}
                    size="small"
                    sx={{
                      fontSize: '0.6rem',
                      height: 20,
                      fontWeight: 700,
                      backgroundColor: alpha(config.color, 0.1),
                      color: config.color,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManualEntryPage;

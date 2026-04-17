import { createTheme, alpha } from '@mui/material/styles';

// CarbonLens "Control Tower" Design System
// Professional, sustainability-focused, trust-inducing

const COLORS = {
  // Primary palette — dark slate command center
  primary: {
    main: '#1B2A3D',
    light: '#2C3E56',
    dark: '#0F1C2E',
    contrastText: '#FFFFFF',
  },
  // Accent — sustainable emerald
  secondary: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  // Semantic
  error: {
    main: '#EF4444',
    light: '#FCA5A5',
    dark: '#DC2626',
  },
  warning: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706',
  },
  info: {
    main: '#3B82F6',
    light: '#93C5FD',
    dark: '#2563EB',
  },
  success: {
    main: '#10B981',
    light: '#6EE7B7',
    dark: '#059669',
  },
  // Neutrals
  background: {
    default: '#F1F5F9',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    disabled: '#94A3B8',
  },
  divider: '#E2E8F0',
};

const carbonLensTheme = createTheme({
  palette: {
    mode: 'light',
    ...COLORS,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
      color: COLORS.text.primary,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      color: COLORS.text.primary,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
      lineHeight: 1.4,
      color: COLORS.text.primary,
    },
    h4: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: COLORS.text.primary,
    },
    h5: {
      fontSize: '0.95rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: COLORS.text.primary,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: COLORS.text.secondary,
    },
    subtitle1: {
      fontSize: '0.95rem',
      fontWeight: 500,
      color: COLORS.text.secondary,
    },
    subtitle2: {
      fontSize: '0.8125rem',
      fontWeight: 500,
      color: COLORS.text.secondary,
    },
    body1: {
      fontSize: '0.9rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      color: COLORS.text.secondary,
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: COLORS.text.secondary,
    },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0,0,0,0.05)',
    '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)',
    '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.04)',
    '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.04)',
    '0 20px 25px -5px rgba(0,0,0,0.07), 0 8px 10px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 25px 30px -6px rgba(0,0,0,0.08), 0 10px 12px -6px rgba(0,0,0,0.04)',
    '0 35px 45px -8px rgba(0,0,0,0.12), 0 15px 20px -8px rgba(0,0,0,0.06)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        body: {
          backgroundColor: COLORS.background.default,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#CBD5E1',
          borderRadius: '3px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#94A3B8',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontSize: '0.8125rem',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&.MuiButton-containedPrimary': {
            background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.light} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${COLORS.primary.dark} 0%, ${COLORS.primary.main} 100%)`,
            },
          },
          '&.MuiButton-containedSecondary': {
            background: `linear-gradient(135deg, ${COLORS.secondary.main} 0%, ${COLORS.secondary.light} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${COLORS.secondary.dark} 0%, ${COLORS.secondary.main} 100%)`,
            },
          },
          '&.MuiButton-outlined': {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid',
          borderColor: COLORS.divider,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.03)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08), 0 4px 10px -4px rgba(0,0,0,0.04)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.7rem',
          letterSpacing: '0.02em',
          borderRadius: 6,
          height: 26,
        },
        colorSuccess: {
          backgroundColor: alpha(COLORS.success.main, 0.12),
          color: COLORS.success.dark,
        },
        colorWarning: {
          backgroundColor: alpha(COLORS.warning.main, 0.12),
          color: COLORS.warning.dark,
        },
        colorError: {
          backgroundColor: alpha(COLORS.error.main, 0.12),
          color: COLORS.error.dark,
        },
        colorInfo: {
          backgroundColor: alpha(COLORS.info.main, 0.12),
          color: COLORS.info.dark,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: COLORS.primary.main,
            color: COLORS.primary.contrastText,
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            padding: '12px 16px',
            borderBottom: 'none',
            whiteSpace: 'nowrap',
          },
          '& .MuiTableCell-head:first-of-type': {
            borderTopLeftRadius: 10,
          },
          '& .MuiTableCell-head:last-of-type': {
            borderTopRightRadius: 10,
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: 'background-color 0.15s ease',
            '&:hover': {
              backgroundColor: alpha(COLORS.secondary.main, 0.04),
            },
            '&:last-of-type .MuiTableCell-body': {
              borderBottom: 'none',
            },
          },
          '& .MuiTableCell-body': {
            fontSize: '0.8125rem',
            padding: '10px 16px',
            borderBottomColor: COLORS.divider,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${COLORS.divider}`,
          overflow: 'hidden',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: COLORS.secondary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: COLORS.secondary.main,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.875rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: COLORS.primary.main,
          fontSize: '0.75rem',
          borderRadius: 6,
          padding: '6px 12px',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.08)',
          },
        },
      },
    },
  },
});

export default carbonLensTheme;

import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Chip,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TableChartIcon from '@mui/icons-material/TableChart';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GavelIcon from '@mui/icons-material/Gavel';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

const DRAWER_WIDTH = 272;
const DRAWER_COLLAPSED_WIDTH = 72;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Upload Data', path: '/upload', icon: <CloudUploadIcon /> },
  { label: 'Records', path: '/records', icon: <TableChartIcon />, badge: 'Grid' },
  { label: 'Manual Entry', path: '/manual-entry', icon: <EditNoteIcon /> },
  { label: 'Suppliers', path: '/suppliers', icon: <LocalShippingIcon /> },
  { label: 'Governance', path: '/governance', icon: <GavelIcon />, badge: 'Review' },
  { label: 'Reports', path: '/reports', icon: <AssessmentIcon /> },
];

const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentWidth = collapsed && !isMobile ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* Logo / Brand */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: collapsed ? 1.5 : 2.5,
          py: 2.5,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 14px ${alpha(theme.palette.secondary.main, 0.4)}`,
            flexShrink: 0,
          }}
        >
          <EnergySavingsLeafIcon sx={{ fontSize: 22, color: '#fff' }} />
        </Box>
        {!collapsed && (
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              CarbonLens
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: alpha('#FFFFFF', 0.55), fontSize: '0.65rem', letterSpacing: '0.06em' }}
            >
              ESG CONTROL TOWER
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), mx: collapsed ? 1 : 2 }} />

      {/* Navigation */}
      <List sx={{ flex: 1, py: 1.5, px: collapsed ? 0.75 : 1.5 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Tooltip
              key={item.path}
              title={collapsed ? item.label : ''}
              placement="right"
              arrow
            >
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                sx={{
                  borderRadius: '10px',
                  mb: 0.5,
                  px: collapsed ? 1.5 : 2,
                  py: 1.1,
                  minHeight: 44,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  backgroundColor: isActive ? alpha('#FFFFFF', 0.12) : 'transparent',
                  backdropFilter: isActive ? 'blur(8px)' : 'none',
                  borderLeft: isActive ? `3px solid ${theme.palette.secondary.main}` : '3px solid transparent',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: alpha('#FFFFFF', 0.08),
                    transform: 'translateX(2px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? theme.palette.secondary.light : alpha('#FFFFFF', 0.6),
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: 'center',
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <>
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: '0.82rem',
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? '#FFFFFF' : alpha('#FFFFFF', 0.75),
                            letterSpacing: '0.01em',
                          },
                        },
                      }}
                    />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                          color: theme.palette.secondary.light,
                          letterSpacing: '0.04em',
                        }}
                      />
                    )}
                  </>
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), mx: collapsed ? 1 : 2 }} />

      {/* User Profile */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: collapsed ? 1.5 : 2.5,
          py: 2,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Avatar
          sx={{
            width: 34,
            height: 34,
            fontSize: '0.8rem',
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
          }}
        >
          SP
        </Avatar>
        {!collapsed && (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              variant="body2"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              Sparsh
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: alpha('#FFFFFF', 0.5), fontSize: '0.65rem' }}
            >
              Dashboard & Analytics
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Desktop drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: currentWidth,
            flexShrink: 0,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& .MuiDrawer-paper': {
              width: currentWidth,
              border: 'none',
              overflow: 'hidden',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'auto',
        }}
      >
        {/* Top bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 3,
            py: 1.5,
            backgroundColor: alpha('#FFFFFF', 0.7),
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${theme.palette.divider}`,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)} size="small">
              <MenuIcon />
            </IconButton>
          )}
          {!isMobile && (
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': { color: theme.palette.primary.main },
              }}
            >
              {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
            </IconButton>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontSize: '1.15rem' }}>
              {NAV_ITEMS.find((item) => item.path === location.pathname)?.label || 'CarbonLens'}
            </Typography>
          </Box>
          <Chip
            label="Phase 1 & 2"
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;

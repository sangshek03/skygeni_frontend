"use client";
import React from "react";
import { Box, AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

interface Route {
  label: string;
  path: string;
}

const routes: Route[] = [
  { label: "Account Industry", path: "/account-industry" },
  { label: "ACV Range", path: "/acv-range" },
  { label: "Customer Type", path: "/customer-type" },
  { label: "Team Performance", path: "/team" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#f8fafc' }}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = routes.findIndex((route) => pathname.startsWith(route.path));

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    router.push(routes[newValue].path);
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div>
    <Box>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar sx={{ 
          display: "flex", 
          justifyContent: "space-between",
          padding: { xs: '0 16px', md: '0 24px' },
          minHeight: '64px'
        }}>
          <Typography 
            variant="h5" 
            component="div"
            onClick={handleLogoClick}
            sx={{
              cursor: "pointer",
              fontWeight: 700,
              letterSpacing: '0.5px',
              color: 'white',
              fontFamily: '"Inter", sans-serif',
              "&:hover": {
                opacity: 0.9,
              },
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 800
            }}>
              SKYGENI
            </span>
            <span style={{ fontWeight: 300 }}>DATA</span>
          </Typography>
          <Tabs
            value={currentTab >= 0 ? currentTab : false}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="secondary"
            aria-label="navigation tabs"
            sx={{
              '& .MuiTabs-indicator': {
                height: '4px',
                backgroundColor: '#ffffff'
              },
              '& .MuiTab-root': {
                minWidth: 'auto',
                padding: '12px 16px',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                letterSpacing: '0.5px',
                color: 'rgba(255, 255, 255, 0.8)',
                '&.Mui-selected': {
                  color: 'white',
                  fontWeight: 600
                },
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }
            }}
          >
            {routes.map((route) => (
              <Tab 
                key={route.path} 
                label={route.label} 
                aria-label={`Navigate to ${route.label}`}
              />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Box 
        component="main" 
        sx={{
          p: 3,
          maxWidth: '1600px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {children}
      </Box>
    </Box>
    </div>
  );
}
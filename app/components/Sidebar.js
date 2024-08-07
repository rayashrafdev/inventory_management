'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import CameraIcon from '@mui/icons-material/Camera';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: 250,
        bgcolor: '#f5f5f5',
        height: '100vh',
        paddingTop: 2,
        paddingBottom: 2,
        borderRight: '4px solid #000', // Add a bold black border to the right
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)', // Optional: Add a slight shadow for a better effect
      }}
    >
      <List>
        {[
          { text: 'Home', icon: <HomeIcon />, href: '/' },
          { text: 'Inventory', icon: <InventoryIcon />, href: '/inventory' },
          { text: 'AI Camera', icon: <CameraIcon />, href: '/camera' },
        ].map((item) => (
          <Link key={item.text} href={item.href} passHref legacyBehavior>
            <ListItem button component="a" selected={pathname === item.href} sx={{
              paddingTop: 3,
              paddingBottom: 3,
              paddingLeft: 4,
              paddingRight: 4,
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{
                fontWeight: 'bold',
                color: pathname === item.href ? 'primary.main' : 'text.primary',
              }} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;

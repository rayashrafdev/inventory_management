import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Inventory, AddShoppingCart, CameraAlt } from '@mui/icons-material';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <List>
        <ListItem button component={Link} href="/">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} href="/inventory">
          <ListItemIcon>
            <AddShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Inventory" />
        </ListItem>
        <ListItem button component={Link} href="/camera">
          <ListItemIcon>
            <CameraAlt />
          </ListItemIcon>
          <ListItemText primary="AI Camera" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;

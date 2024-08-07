import Link from 'next/link';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import CameraIcon from '@mui/icons-material/Camera';

const Sidebar = () => {
  return (
    <List>
      <Link href="/" passHref>
        <ListItem button>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </Link>
      <Link href="/inventory" passHref>
        <ListItem button>
          <ListItemIcon>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText primary="Inventory" />
        </ListItem>
      </Link>
      <Link href="/camera" passHref>
        <ListItem button>
          <ListItemIcon>
            <CameraIcon />
          </ListItemIcon>
          <ListItemText primary="AI Camera" />
        </ListItem>
      </Link>
    </List>
  );
};

export default Sidebar;

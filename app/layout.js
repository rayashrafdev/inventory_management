import { Inter } from "next/font/google";
import Sidebar from './components/Sidebar';
import { CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pantry Tracker",
  description: "Manage your pantry efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box
            component="main"
            width="100%"
            sx={{ backgroundColor: 'white' }}
          >
            {children}
          </Box>
        </Box>
      </body>
    </html>
  );
}

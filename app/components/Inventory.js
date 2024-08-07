'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Stack, TextField, Typography, Paper, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { firestore } from '../../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setInventory(items);
  };

  const addItem = async (name, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: docSnap.data().quantity + parseInt(quantity) });
    } else {
      await setDoc(docRef, { quantity: parseInt(quantity) });
    }
    updateInventory();
  };

  const removeItem = async (name) => {
    const docRef = doc(collection(firestore, 'inventory'), name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const newQuantity = docSnap.data().quantity - 1;
      if (newQuantity > 0) {
        await setDoc(docRef, { quantity: newQuantity });
      } else {
        await deleteDoc(docRef);
      }
      updateInventory();
    }
  };

  const handleQuantityChange = (value) => {
    if (value >= 1) {
      setItemQuantity(value);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        bgcolor: '#f5f5f5',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Inventory
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Item
      </Button>
      <Stack spacing={2} width="100%" maxWidth="600px">
        {inventory.map((item) => (
          <Paper key={item.id} elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {item.id}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Quantity: {item.quantity}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" color="success" onClick={() => addItem(item.id, 1)}>
                  Add
                </Button>
                <Button variant="contained" color="error" onClick={() => removeItem(item.id)}>
                  Remove
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Add Item
          </Typography>
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => handleQuantityChange(itemQuantity - 1)}>
              <Remove />
            </IconButton>
            <TextField
              label="Quantity"
              variant="outlined"
              type="number"
              value={itemQuantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              sx={{ mb: 2 }}
              inputProps={{ min: 1 }}
            />
            <IconButton onClick={() => handleQuantityChange(itemQuantity + 1)}>
              <Add />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              addItem(itemName, itemQuantity);
              setItemName('');
              setItemQuantity(1);
              handleClose();
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

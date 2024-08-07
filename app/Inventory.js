'use client';

import React, { useState, useEffect } from "react";
import { Box, Button, Stack, TextField, Typography, Paper } from '@mui/material';
import { firestore } from '../firebase'; // Adjust the import path if necessary
import { collection, getDoc, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const Inventory = () => {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addItem = async (name) => {
    try {
      const docRef = doc(firestore, "inventory", name);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, { quantity: docSnap.data().quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }
      updateInventory();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const removeItem = async (name) => {
    try {
      const docRef = doc(firestore, "inventory", name);
      await deleteDoc(docRef);
      updateInventory();
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  const updateInventory = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "inventory"));
      const items = snapshot.docs.map(doc => ({ name: doc.id, ...doc.data() }));
      setInventory(items);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      p={2}
      bgcolor="#f5f5f5"
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Inventory Items
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Item
      </Button>
      <Stack spacing={2} mt={2} width="80%">
        {inventory.map(({ name, quantity }) => (
          <Paper key={name} elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="subtitle1">
              Quantity: {quantity}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Button variant="contained" color="success" onClick={() => addItem(name)}>
                Add
              </Button>
              <Button variant="contained" color="error" onClick={() => removeItem(name)}>
                Remove
              </Button>
              <Button variant="contained" onClick={() => updateItem(name)}>
                Update
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default Inventory;

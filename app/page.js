<<<<<<< HEAD
'use client';

import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import axios from 'axios';
import { Box, Button, Modal, Stack, TextField, Typography, Paper } from '@mui/material';
import { CameraAlt, Close } from '@mui/icons-material';
import { firestore } from '../firebase'; // Adjust the import path if necessary
import { collection, getDoc, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import Sidebar from './components/Sidebar'; // Add this import
=======
'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
>>>>>>> 591627a71416a913a67a02b87c03a4aa84c9606c

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
<<<<<<< HEAD
};

const Home = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [inventory, setInventory] = useState([]);
  const [prediction, setPrediction] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    updateInventory();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPrediction(response.data.predicted_class);
      setConfirmOpen(true); // Open the confirmation modal
    } catch (error) {
      console.error('Error uploading the file:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirmClose = () => setConfirmOpen(false);

  const handleConfirm = async () => {
    await addItem(prediction);
    setConfirmOpen(false);
    setPrediction('');
  };

  const handleReject = () => {
    setConfirmOpen(false);
    setPrediction('');
  };

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

  const handleTakePhoto = () => {
    try {
      if (camera.current) {
        const photo = camera.current.takePhoto();
        setImage(photo);
        setCameraVisible(false);
      } else {
        throw new Error("Camera not initialized");
      }
    } catch (error) {
      setCameraError(error.message);
      console.error(error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'white', p: 3 }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Pantry Tracker!
        </Typography>
        <Box display="flex" justifyContent="center" width="100%" gap={2}>
          <Paper elevation={3} sx={{ p: 2, width: '40%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Inventory Items
            </Typography>
            <Button variant="contained" color="primary" fullWidth onClick={handleOpen}>
              Add New Item
            </Button>
            <Stack spacing={2} mt={2}>
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
          </Paper>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            width="40%"
            component={Paper}
            elevation={3}
            p={2}
          >
            {cameraVisible && (
              <Box
                position="relative"
                width="300px"
                height="300px"
                border="1px solid #000"
                bgcolor="#fff"
              >
                <Camera ref={camera} style={{ width: '100%', height: '100%' }} />
              </Box>
            )}
            <Box display="flex" justifyContent="center" gap={2} mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setCameraVisible(!cameraVisible)}
                startIcon={cameraVisible ? <Close /> : <CameraAlt />}
              >
                {cameraVisible ? 'Close Camera' : 'Open Camera'}
              </Button>
              {cameraVisible && (
                <Button variant="contained" color="primary" onClick={handleTakePhoto}>
                  Capture
                </Button>
              )}
            </Box>
            <input type="file" onChange={handleFileChange} />
            <Button variant="contained" onClick={handleUpload}>
              Upload and Predict
            </Button>
            {cameraError && (
              <Typography color="error" variant="subtitle1">
                {cameraError}
              </Typography>
            )}
            {prediction && (
              <Modal
                open={confirmOpen}
                onClose={handleConfirmClose}
                aria-labelledby="confirm-title"
                aria-describedby="confirm-description"
              >
                <Box sx={style}>
                  <Typography id="confirm-title" variant="h6" component="h2">
                    Confirm Item
                  </Typography>
                  <Typography id="confirm-description" sx={{ mt: 2 }}>
                    Is this item correct? {prediction}
                  </Typography>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="success" onClick={handleConfirm}>
                      Confirm
                    </Button>
                    <Button variant="contained" color="error" onClick={handleReject}>
                      Reject
                    </Button>
                  </Box>
                </Box>
              </Modal>
            )}
          </Box>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Home;
=======
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    if (!firestore) return;

    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    if (!firestore) return;

    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    if (!firestore) return;

    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const updateItem = async (item, newItemName) => {
    if (!firestore) return;

    const itemRef = doc(collection(firestore, 'inventory'), item)
    const newItemRef = doc(collection(firestore, 'inventory'), newItemName)
    const itemSnap = await getDoc(itemRef)
    if (itemSnap.exists()) {
      const data = itemSnap.data()
      await setDoc(newItemRef, data)
      await deleteDoc(itemRef)
    }
    await updateInventory()
  }

  const handleOpen = () => {
    setEditMode(false)
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const handleUpdateOpen = (item) => {
    setEditMode(true)
    setCurrentItem(item)
    setItemName(item)
    setOpen(true)
  }

  const handleUpdate = () => {
    updateItem(currentItem, itemName)
    setItemName('')
    setCurrentItem(null)
    setOpen(false)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query === '') {
      setFilteredInventory(inventory)
    } else {
      const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredInventory(filtered)
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {editMode ? 'Update Item' : 'Add Item'}
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                if (editMode) {
                  handleUpdate()
                } else {
                  addItem(itemName)
                }
                setItemName('')
                handleClose()
              }}
            >
              {editMode ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <TextField
        id="search-field"
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Box border={'1px solid #333'} mt={2}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
                <Button variant="contained" onClick={() => handleUpdateOpen(name)}>
                  Update
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
>>>>>>> 591627a71416a913a67a02b87c03a4aa84c9606c

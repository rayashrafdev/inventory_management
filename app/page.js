'use client';

import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import axios from 'axios';
import { Box, Button, Modal, Stack, TextField, Typography, Paper } from '@mui/material';
import { CameraAlt, Close } from '@mui/icons-material';
import { firestore } from '../firebase'; // Adjust the import path if necessary
import { collection, getDoc, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import Sidebar from './components/Sidebar'; // Add this import

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

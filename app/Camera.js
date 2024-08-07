'use client';

import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import axios from 'axios';
import { Box, Button, Typography, Paper, Modal } from '@mui/material';
import { CameraAlt, Close } from '@mui/icons-material';

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

const AICamera = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraError, setCameraError] = useState('');

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

  const handleConfirmClose = () => setConfirmOpen(false);

  const handleConfirm = async () => {
    // Add item logic goes here
    setConfirmOpen(false);
    setPrediction('');
  };

  const handleReject = () => {
    setConfirmOpen(false);
    setPrediction('');
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
        AI Camera
      </Typography>
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
  );
};

export default AICamera;

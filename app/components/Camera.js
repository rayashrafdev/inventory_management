'use client';

import React, { useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { firestore } from '../../firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const CameraComponent = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const openCamera = async () => {
    setIsCameraOpen(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    let tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setImage(dataUrl);
    closeCamera();
  };

  const handleUploadAndPredict = () => {
    if (!image) {
      alert('Please capture or upload an image first.');
      return;
    }
    // Add your prediction logic here
    const fakePrediction = 'apple'; // Replace this with your actual prediction logic
    setPrediction(fakePrediction);
  };

  const addItemToPantry = async () => {
    const docRef = doc(collection(firestore, 'inventory'), prediction);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: docSnap.data().quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setPrediction(''); // Clear the previous prediction when a new image is uploaded
      };
      reader.readAsDataURL(file);
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
      }}
    >
      <Typography variant="h3" gutterBottom>
        AI Camera
      </Typography>
      <Typography variant="body1" gutterBottom>
        Use the camera to capture an image or upload from your device to predict.
      </Typography>
      {isCameraOpen && (
        <Box
          component="video"
          ref={videoRef}
          autoPlay
          sx={{ width: '100%', maxWidth: 400, mb: 2, border: 'none' }}
        />
      )}
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{ display: 'none', width: '100%', maxWidth: 400 }}
      />
      {image && (
        <Box
          component="img"
          src={image}
          alt="Captured"
          sx={{ width: '100%', maxWidth: 400, mb: 2 }}
        />
      )}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={openCamera} disabled={isCameraOpen}>
          Open Camera
        </Button>
        <Button variant="contained" color="primary" onClick={captureImage} disabled={!isCameraOpen}>
          Capture
        </Button>
        <Button variant="contained" color="primary" onClick={closeCamera} disabled={!isCameraOpen}>
          Close Camera
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="file-input"
          type="file"
          onChange={handleImageUpload}
        />
        <Button variant="contained" color="primary" onClick={() => document.getElementById('file-input').click()}>
          Upload File
        </Button>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUploadAndPredict}
        sx={{ mb: 2 }}
      >
        Upload and Predict
      </Button>
      {prediction && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Prediction: {prediction}
          </Typography>
          <Button variant="contained" onClick={addItemToPantry}>
            Add to Pantry
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CameraComponent;

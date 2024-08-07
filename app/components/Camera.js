import React, { useState, useRef } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';

const Camera = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    setImage(null);
  };

  const captureImage = () => {
    // Assuming you have a way to capture the image from the camera
    // Placeholder code for capturing an image
    const capturedImage = 'data:image/jpeg;base64,...'; // Replace with actual captured image data
    setImage(capturedImage);
    setIsCameraOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box p={4} textAlign="center">
      <Typography variant="h4" component="h1" gutterBottom>
        AI Camera
      </Typography>
      <Typography variant="body1" gutterBottom>
        Use the camera to capture an image or upload from your device to predict.
      </Typography>
      {isCameraOpen ? (
        <Box mt={2}>
          {/* Placeholder for camera view */}
          <Box width="100%" height="300px" bgcolor="black" mb={2}></Box>
          <Button variant="contained" color="primary" onClick={captureImage} sx={{ mr: 2 }}>
            Capture
          </Button>
          <Button variant="contained" color="secondary" onClick={closeCamera}>
            Close Camera
          </Button>
        </Box>
      ) : (
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={openCamera} sx={{ mr: 2 }}>
            Open Camera
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component="label"
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </Button>
        </Box>
      )}
      {image && (
        <Box mt={4}>
          <Typography variant="h6" component="h2" gutterBottom>
            Uploaded Image:
          </Typography>
          <Box
            component="img"
            src={image}
            alt="Uploaded"
            sx={{ width: '100%', maxWidth: 300, borderRadius: 2, boxShadow: 2 }}
          />
          <Button variant="contained" color="secondary" onClick={() => setImage(null)} sx={{ mt: 2 }}>
            Remove Image
          </Button>
        </Box>
      )}
      <Button variant="contained" color="success" sx={{ mt: 2 }}>
        Upload and Predict
      </Button>
    </Box>
  );
};

export default Camera;

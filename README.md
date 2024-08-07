# Inventory Management and AI Camera Application

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Image Classification Model](#image-classification-model)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction
This project is an Inventory Management and AI Camera Application that allows users to manage their inventory and classify food items using image recognition. The application consists of two main parts:
1. **Inventory Management**: Users can add, update, and remove items from their inventory.
2. **AI Camera**: Users can capture images or upload files to classify food items and add them to their inventory.

## Features
- **Inventory Management**:
  - Add new items with specified quantities.
  - Update item quantities.
  - Remove items from the inventory.
- **AI Camera**:
  - Capture images using the device's camera.
  - Upload images from the device.
  - Classify food items using a pre-trained image classification model.
  - Add classified items to the inventory.

## Setup and Installation
### Prerequisites
- Node.js
- Firebase account for Firestore
- Python for training the image classification model
- Required Python packages

### Clone the Repository
```bash
git clone https://github.com/rayashrafdev/inventory_management.git
cd inventory_management

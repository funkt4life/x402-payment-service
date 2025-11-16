require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { BankrClient } = require('@bankr/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Bankr
const bankr = new BankrClient({
  privateKey: process.env.PRIVATE_KEY
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'x402 Payment Service',
    wallet: bankr.address
  });
});

// Create payment
app.post('/api/payment/create', async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    
    res.json({
      success: true,
      orderId: orderId,
      amount: parseFloat(amount),
      currency: 'USDC',
      walletAddress: bankr.address,
      network: 'Base'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Verify payment (simplified version)
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { orderId, transactionHash } = req.body;
    
    res.json({
      success: true,
      verified: true,
      orderId: orderId,
      transactionHash: transactionHash
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
  console.log(`Wallet: ${bankr.address}`);
});

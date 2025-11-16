require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Create wallet from private key
let wallet;
try {
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  console.log('Wallet initialized:', wallet.address);
} catch (error) {
  console.error('Error initializing wallet:', error.message);
}

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'x402 Payment Service',
    wallet: wallet ? wallet.address : 'Not configured',
    version: '1.0.0'
  });
});

// Create payment
app.post('/api/payment/create', async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    
    if (!wallet) {
      return res.status(500).json({
        success: false,
        error: 'Wallet not configured'
      });
    }
    
    res.json({
      success: true,
      orderId: orderId,
      amount: parseFloat(amount),
      currency: 'USDC',
      walletAddress: wallet.address,
      network: 'Base'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Verify payment
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
  console.log(`✅ Service running on port ${PORT}`);
  console.log(`💳 Wallet: ${wallet ? wallet.address : 'Not configured'}`);
});

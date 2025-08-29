import express from 'express';
import Database from '@replit/database';
import DatabaseService from './database.js';
import crypto from 'crypto';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const db = new Database();
const pgDb = new DatabaseService();

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PORT = process.env.PORT || 5000;

// Paystack API base URL
const PAYSTACK_API_BASE = 'https://api.paystack.co';

// Utility functions
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const generateUniqueId = (prefix) => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const calculateUserPayment = (amount) => {
  if (amount <= 29950) {
    return Math.ceil((amount + 50) / 0.99);
  } else {
    return amount + 350;
  }
};

const calculatePaystackFee = (amount) => {
  return Math.min(0.01 * amount, 300) + 50;
};

const calculateSplit = (originalAmount, userPayment) => {
  const paystackFee = Math.min(0.01 * userPayment, 300);
  const amountCredited = userPayment - paystackFee;
  const ownerAmount = 0.9 * originalAmount + 50;
  const platformAmount = amountCredited - ownerAmount;
  
  return {
    userPayment,
    paystackFee,
    amountCredited,
    ownerAmount,
    platformAmount
  };
};

// Health check
app.get('/api/health', async (req, res) => {
  const dbConnected = await pgDb.testConnection();
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'Connected' : 'Disconnected'
  });
});

// PostgreSQL-based endpoints
// Get all facilities
app.get('/api/pg/facilities', async (req, res) => {
  try {
    const facilities = await pgDb.getAllFacilities();
    res.json(facilities);
  } catch (error) {
    console.error('Get facilities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a user (PostgreSQL)
app.post('/api/pg/users', async (req, res) => {
  try {
    const { username, email, password, user_type, full_name, phone } = req.body;
    
    // Simple password hashing (in production, use bcrypt)
    const password_hash = crypto.createHash('sha256').update(password).digest('hex');
    
    const userData = {
      username,
      email,
      password_hash,
      user_type,
      full_name,
      phone
    };
    
    const user = await pgDb.createUser(userData);
    res.json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user bookings (PostgreSQL)
app.get('/api/pg/users/:userId/bookings', async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await pgDb.getBookingsByUser(userId);
    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create User
app.post('/api/users', async (req, res) => {
  try {
    const { email, firstName, lastName, phone, referredBy } = req.body;
    const userId = generateUniqueId('user');
    const referralCode = generateReferralCode();

    const user = {
      email,
      firstName,
      lastName,
      phone,
      referralCode,
      referredBy: referredBy || null,
      referralWalletBalance: 0
    };

    await db.set(`user:${userId}`, user);
    res.json({ userId, user });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Owner
app.post('/api/owners', async (req, res) => {
  try {
    const { email, firstName, lastName, phone } = req.body;
    const ownerId = generateUniqueId('owner');

    const owner = {
      email,
      firstName,
      lastName,
      phone,
      dvaDetails: null
    };

    await db.set(`owner:${ownerId}`, owner);
    res.json({ ownerId, owner });
  } catch (error) {
    console.error('Owner creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get User
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.get(`user:${userId}`);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Owner DVA
app.post('/api/owners/:ownerId/dva', async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const owner = await db.get(`owner:${ownerId}`);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    if (owner.dvaDetails && owner.dvaDetails.accountNumber) {
      return res.json({ dvaDetails: owner.dvaDetails });
    }

    const response = await axios.post(`${PAYSTACK_API_BASE}/dedicated_account`, {
      customer: ownerId,
      preferred_bank: 'titan-paystack'
    }, {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status) {
      const dvaDetails = {
        accountNumber: response.data.data.account_number,
        bankName: response.data.data.bank.name,
        accountName: response.data.data.account_name,
        dvaId: response.data.data.id
      };

      const updatedOwner = { ...owner, dvaDetails };
      await db.set(`owner:${ownerId}`, updatedOwner);

      res.json({ dvaDetails });
    } else {
      res.status(400).json({ error: 'Failed to create DVA', details: response.data });
    }
  } catch (error) {
    console.error('DVA creation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Internal server error', details: error.response?.data });
  }
});

// Fetch Owner DVA
app.get('/api/owners/:ownerId/dva', async (req, res) => {
  try {
    const { ownerId } = req.params;
    const owner = await db.get(`owner:${ownerId}`);
    
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    if (owner.dvaDetails) {
      res.json({ dvaDetails: owner.dvaDetails });
    } else {
      res.status(404).json({ error: 'DVA not found for this owner' });
    }
  } catch (error) {
    console.error('Fetch DVA error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { userId, ownerId, amount, referralCode } = req.body;

    const user = await db.get(`user:${userId}`);
    const owner = await db.get(`owner:${ownerId}`);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    if (!owner.dvaDetails) {
      return res.status(400).json({ error: 'Owner DVA not set up' });
    }

    const userPayment = calculateUserPayment(amount);
    const split = calculateSplit(amount, userPayment);

    const bookingId = generateUniqueId('booking');
    const transactionReference = generateUniqueId('txn');

    const booking = {
      userId,
      ownerId,
      amount: userPayment,
      originalAmount: amount,
      status: 'pending',
      referralCode: referralCode || null,
      transactionReference,
      split,
      createdAt: new Date().toISOString()
    };

    await db.set(`booking:${bookingId}`, booking);

    res.json({
      bookingId,
      booking,
      dvaDetails: owner.dvaDetails,
      paymentAmount: userPayment
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Apply Referral Discount
app.post('/api/bookings/apply-discount', async (req, res) => {
  try {
    const { userId, bookingId } = req.body;

    const user = await db.get(`user:${userId}`);
    const booking = await db.get(`booking:${bookingId}`);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (user.referralWalletBalance < 100) {
      return res.status(400).json({ error: 'Insufficient referral balance' });
    }

    user.referralWalletBalance -= 100;
    await db.set(`user:${userId}`, user);

    booking.amount -= 100;
    booking.discountApplied = true;
    await db.set(`booking:${bookingId}`, booking);

    res.json({ booking, user });
  } catch (error) {
    console.error('Apply discount error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Paystack Webhook
app.post('/api/webhooks/paystack', async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const payload = JSON.stringify(req.body);
    
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(payload).digest('hex');
    
    if (hash !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference } = event.data;
      
      const bookings = await db.list();
      for (const key of bookings.filter(k => k.startsWith('booking:'))) {
        const booking = await db.get(key);
        if (booking && booking.transactionReference === reference) {
          const verifyResponse = await axios.get(`${PAYSTACK_API_BASE}/transaction/verify/${reference}`, {
            headers: {
              'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
            }
          });

          if (verifyResponse.data.status && verifyResponse.data.data.status === 'success') {
            booking.status = 'success';
            booking.completedAt = new Date().toISOString();
            await db.set(key, booking);

            if (booking.referralCode) {
              const users = await db.list();
              for (const userKey of users.filter(k => k.startsWith('user:'))) {
                const user = await db.get(userKey);
                if (user && user.referralCode === booking.referralCode) {
                  user.referralWalletBalance += 100;
                  await db.set(userKey, user);

                  const cashbackId = generateUniqueId('cashback');
                  const cashback = {
                    userId: userKey.replace('user:', ''),
                    bookingId: key.replace('booking:', ''),
                    amount: 100,
                    createdAt: new Date().toISOString()
                  };
                  await db.set(`cashback:${cashbackId}`, cashback);
                  break;
                }
              }
            }
          }
          break;
        }
      }
    } else if (event.event === 'charge.failed') {
      const { reference } = event.data;
      
      const bookings = await db.list();
      for (const key of bookings.filter(k => k.startsWith('booking:'))) {
        const booking = await db.get(key);
        if (booking && booking.transactionReference === reference) {
          booking.status = 'failed';
          booking.failedAt = new Date().toISOString();
          await db.set(key, booking);
          break;
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Booking
app.get('/api/bookings/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await db.get(`booking:${bookingId}`);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${PAYSTACK_SECRET_KEY ? 'Configured' : 'Missing Paystack Key'}`);
});

export default app;
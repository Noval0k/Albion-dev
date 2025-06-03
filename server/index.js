import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory orders list for demo purposes
const orders = [];

// List all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Add a new order
app.post('/api/orders', (req, res) => {
  const order = req.body;
  order.id = orders.length + 1;
  orders.push(order);
  res.status(201).json(order);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// List all inventory
app.get('/', async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create item
app.post('/', async (req, res) => {
  try {
    const item = await prisma.inventoryItem.create({
      data: {
        ...req.body,
        lastRestocked: new Date(req.body.lastRestocked)
      }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update stock (restock)
app.patch('/:id/restock', async (req, res) => {
  const { quantity } = req.body;
  try {
    const item = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: { 
        quantity: { increment: quantity },
        lastRestocked: new Date(),
        updatedAt: new Date()
      }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Consume stock
app.patch('/:id/consume', async (req, res) => {
  const { quantity } = req.body;
  try {
    const item = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: { 
        quantity: { decrement: quantity },
        updatedAt: new Date()
      }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item
app.delete('/:id', async (req, res) => {
  try {
    await prisma.inventoryItem.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Inventory Service running on port ${PORT}`);
});

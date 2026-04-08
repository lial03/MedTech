import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// List all work orders
app.get('/', async (req, res) => {
  try {
    const orders = await prisma.workOrder.findMany({
      orderBy: { createdAt: 'desc' }
    });
    // Parse partsUsed from JSON
    const parsed = orders.map(o => ({
      ...o,
      partsUsed: JSON.parse(o.partsUsed || '[]')
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create work order
app.post('/', async (req, res) => {
  try {
    const order = await prisma.workOrder.create({
      data: {
        ...req.body,
        partsUsed: JSON.stringify(req.body.partsUsed || [])
      }
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update assignment
app.patch('/:id/assign', async (req, res) => {
  const { assignedTo } = req.body;
  try {
    const order = await prisma.workOrder.update({
      where: { id: req.params.id },
      data: { 
        assignedTo,
        status: 'in-progress',
        updatedAt: new Date()
      }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete work order
app.patch('/:id/complete', async (req, res) => {
  const { partsUsed, laborHours } = req.body;
  try {
    const order = await prisma.workOrder.update({
      where: { id: req.params.id },
      data: {
        status: 'completed',
        partsUsed: JSON.stringify(partsUsed || []),
        laborHours: parseFloat(laborHours),
        completedAt: new Date(),
        updatedAt: new Date()
      }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Technicians
app.get('/technicians', async (req, res) => {
  try {
    const techs = await prisma.technician.findMany();
    res.json(techs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/technicians', async (req, res) => {
  try {
    const tech = await prisma.technician.create({
      data: {
        ...req.body,
        specialization: Array.isArray(req.body.specialization) ? req.body.specialization.join(',') : req.body.specialization
      }
    });
    res.status(201).json(tech);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/technicians/:id', async (req, res) => {
  try {
    await prisma.technician.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Work Order Service running on port ${PORT}`);
});

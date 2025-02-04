// src/index.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { taskSchema } from './validation';
import { ZodError } from 'zod';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Utiliser le middleware JSON intégré à Express
app.use(express.json());

// Créer une tâche avec validation via Zod
app.post('/tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    // Validation et parsing du body de la requête à l'aide du schéma Zod
    const parsedData = taskSchema.parse(req.body);

    // Si la validation est réussie, créer la tâche dans la base de données
    const task = await prisma.task.create({
      data: parsedData,
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    // Si l'erreur provient de Zod, renvoyer les détails de validation
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Erreur lors de la création de la tâche' });
    }
  }
});

// Lire toutes les tâches
app.get('/tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
  }
});

// Lire une tâche par ID
app.get('/tasks/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      res.status(404).json({ error: 'Tâche non trouvée.' });
      return;
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la tâche' });
  }
});

// Mettre à jour une tâche (sans validation Zod pour l'instant)
app.put('/tasks/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    // Ici, on attend que le body contienne les champs (ex: title, description, completed)
    const { text, deadline, completed } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        text,
        completed,
        deadline,
      },
    });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche' });
  }
});

// Supprimer une tâche
app.delete('/tasks/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

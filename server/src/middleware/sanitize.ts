// src/middleware/sanitize.ts
import { Request, Response, NextFunction } from 'express';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Créer une instance de window via JSDOM (pour DOMPurify côté serveur)
const window = new JSDOM('').window;
// Initialiser DOMPurify avec cette fenêtre
const DOMPurify = createDOMPurify(window);

/**
 * Middleware qui nettoie les champs 'title' et 'description' dans req.body.
 * Vous pouvez ajouter d'autres champs si nécessaire.
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.title && typeof req.body.title === 'string') {
    req.body.title = DOMPurify.sanitize(req.body.title);
  }
  if (req.body.description && typeof req.body.description === 'string') {
    req.body.description = DOMPurify.sanitize(req.body.description);
  }
  next();
};

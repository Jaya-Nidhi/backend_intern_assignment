import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createNote = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content } = req.body;
    const note = await prisma.note.create({
      data: { title, content, userId: req.user!.id },
      include: { user: { select: { email: true } } },
    });
    res.status(201).json({ success: true, message: 'Note created', data: note });
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, page = '1', limit = '20' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = req.user!.role === 'ADMIN'
      ? search ? { OR: [{ title: { contains: search, mode: 'insensitive' as const } }, { content: { contains: search, mode: 'insensitive' as const } }] } : {}
      : { userId: req.user!.id, ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' as const } }, { content: { contains: search, mode: 'insensitive' as const } }] } : {}) };

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        include: { user: { select: { email: true } } },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.note.count({ where }),
    ]);

    res.json({
      success: true,
      data: notes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const note = await prisma.note.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });

    if (!note) {
      res.status(404).json({ success: false, error: 'Note not found' });
      return;
    }
    if (note.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Forbidden: Access denied' });
      return;
    }

    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      res.status(404).json({ success: false, error: 'Note not found' });
      return;
    }
    if (note.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Forbidden: You cannot edit this note' });
      return;
    }

    const updated = await prisma.note.update({
      where: { id },
      data: req.body,
      include: { user: { select: { email: true } } },
    });

    res.json({ success: true, message: 'Note updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      res.status(404).json({ success: false, error: 'Note not found' });
      return;
    }
    if (note.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Forbidden: You cannot delete this note' });
      return;
    }

    await prisma.note.delete({ where: { id } });
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

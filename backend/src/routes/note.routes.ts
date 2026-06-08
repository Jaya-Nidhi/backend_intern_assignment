import { Router } from 'express';
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from '../controllers/note.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { NoteSchema, UpdateNoteSchema } from '../schemas/auth.schema';

const router = Router();

router.use(authenticateJWT);

router.get('/', getNotes);
router.post('/', validate(NoteSchema), createNote);
router.get('/:id', getNoteById);
router.patch('/:id', validate(UpdateNoteSchema), updateNote);
router.delete('/:id', deleteNote);

export default router;

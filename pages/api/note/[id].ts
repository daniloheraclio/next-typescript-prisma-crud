import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const noteId = req.query.id;

  if (req.method === 'DELETE') {
    const note = await prisma.note.delete({
      where: {
        id: Number(noteId),
      },
    });

    res.status(204).json({ note });
  }

  if (req.method === 'PUT') {
    const { title, content } = req.body;
    const note = await prisma.note.update({
      where: {
        id: Number(noteId),
      },
      data: {
        title,
        content,
      },
    });

    res.status(204).json(note);
  }
}

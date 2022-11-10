import { INote } from '../pages/index';
import { Pencil } from 'phosphor-react';

interface NoteProp {
  note: INote;
  action: 'NEW' | 'EDIT';
  handleUpdate: (note: INote) => void;
  handleDelete: (noteId: string) => void;
}

export function NoteItem({ note, action, handleUpdate, handleDelete }: NoteProp) {
  return (
    <li className="flex flex-row justify-between items-center bg-gray-100 w-[400px] px-4 py-2 rounded border-blue-400 border-l-2">
      <div>
        <p className="font-bold uppercase">{note.title}</p>
        <p className="text-sm">{note.content}</p>
      </div>
      <div className="flex flex-row gap-x-2">
        <button
          className="flex items-center justify-center w-8 h-8 text-xs text-gray-500  font-bold bg-gray-300 rounded hover:bg-blue-300 hover:cursor-pointer"
          onClick={() => handleUpdate(note)}
        >
          <Pencil color="#3482F6" weight="duotone" size={20} />
        </button>
        <button
          disabled={action === 'EDIT'}
          className="w-8 h-8 bg-gray-300 rounded hover:bg-red-400 hover:cursor-pointer disabled:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
          onClick={() => handleDelete(note.id)}
        >
          x
        </button>
      </div>
    </li>
  );
}

import { INote } from '../pages/index';

interface NoteProp {
  note: INote;
  handleDelete: (noteId: string) => void;
}

export function NoteItem({ note, handleDelete }: NoteProp) {
  return (
    <li className="flex flex-row justify-between items-center bg-gray-100 w-[400px] px-4 py-2 rounded border-blue-400 border-l-2">
      <div>
        <p className="font-bold uppercase">{note.title}</p>
        <p className="text-sm">{note.content}</p>
      </div>
      <button
        className="w-8 h-8 bg-gray-300 rounded hover:bg-red-400 hover:cursor-pointer"
        onClick={() => handleDelete(note.id)}
      >
        x
      </button>
    </li>
  );
}

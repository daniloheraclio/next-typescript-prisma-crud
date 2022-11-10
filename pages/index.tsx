import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';
import { prisma } from '../lib/prisma';

import { NoteItem } from '../components/NoteItem';

interface NotesProps {
  notes: {
    id: string;
    title: string;
    content: string;
  }[];
}

export interface INote {
  title: string;
  content: string;
  id: string;
}

const Home = ({ notes }: NotesProps) => {
  const router = useRouter();
  const [note, setNote] = useState<INote>({ title: '', content: '', id: '' } as INote);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function handleSubmit(note: INote) {
    try {
      fetch('http://localhost:3000/api/create', {
        method: 'POST',
        body: JSON.stringify(note),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(() => {
        setNote({ title: '', content: '', id: '' });
        refreshData();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id: string) {
    try {
      fetch(`http://localhost:3000/api/note/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(() => {
        refreshData();
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Head>
        <title>Next Typescript Prisma app</title>
        <meta name="description" content="A very nice app built with love" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="h-screen w-screen flex flex-col justify-start items-center">
        <h1 className="text-5xl text-center font-bold my-4">Notes</h1>
        <div className="mx-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(note);
            }}
            className="w-lg mx-auto space-y-6 items-stretch"
          >
            <input
              className="w-full border-2 border-gray-400 rounded-md p-1"
              type="text"
              placeholder="Note title"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
            />
            <textarea
              className="w-full h-32 w-lg border-2 border-gray-400 rounded-md p-1"
              placeholder="Content"
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
            />
            <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded ">
              Add +
            </button>
          </form>
        </div>

        <div className="mt-20 mx-auto">
          <ul className="flex flex-col gap-4 justify-between w-full">
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                handleDelete={() => handleDelete(note.id)}
              />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      content: true,
    },
  });

  return {
    props: {
      notes,
    },
  };
};

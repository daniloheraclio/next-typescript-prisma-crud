import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { prisma } from '../lib/prisma';

import { NoteItem } from '../components/NoteItem';
import { validateConfig } from 'next/dist/server/config-shared';

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
  const [action, setAction] = useState<'NEW' | 'EDIT'>('NEW');
  const [isValid, setIsValid] = useState(false);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    setIsValid(!!(note.title && note.content));
  }, [note]);

  async function handleSubmit(note: INote) {
    setIsValid(!!(note.title && note.content));

    if (!isValid) return;

    console.log(note);
    const action = note.id ? 'EDIT' : 'NEW';
    setAction(action);

    if (action === 'NEW') {
      try {
        fetch(`https://next-typescript-prisma-crud.vercel.app/api/create`, {
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

    if (action === 'EDIT') {
      try {
        await fetch(
          `https://next-typescript-prisma-crud.vercel.app/api/note/${note.id}`,
          {
            method: 'PUT',
            body: JSON.stringify(note),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        ).then(() => {
          resetData();
          refreshData();
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      fetch(`https://next-typescript-prisma-crud.vercel.app/api/note/${note.id}`, {
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

  async function handleUpdate(note: INote) {
    setAction('EDIT');
    setNote(note);
  }

  function resetData() {
    setNote({ id: '', title: '', content: '' });
    setAction('NEW');
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
        <div className="mx-2 max-w-[400px]">
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
            {action === 'EDIT' && (
              <button
                type="button"
                className="w-full py-2 bg-red-500 text-white rounded"
                onClick={resetData}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!isValid}
              className="w-full py-2 bg-blue-500 text-white rounded disabled:bg-gray-600 disabled:text-zinc-300 disabled:cursor-not-allowed"
            >
              {action === 'NEW' ? 'Add +' : 'Save'}
            </button>
          </form>
        </div>

        <div className="mt-20 mx-auto">
          <ul className="flex flex-col gap-4 justify-between w-full">
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                action={action}
                handleUpdate={() => handleUpdate(note)}
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

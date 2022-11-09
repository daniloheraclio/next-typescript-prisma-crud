import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';
import { prisma } from '../lib/prisma';

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

  async function create(data: INote) {
    try {
      fetch('http://localhost:3000/api/create', {
        method: 'POST',
        body: JSON.stringify(data),
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
  async function handleSubmit(note: INote) {
    try {
      await create(note);
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
      <section className="h-screen w-screen flex flex-col justify-center items-center">
        <h1 className="text-5xl text-center font-bold my-4">Notes</h1>
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
            className="w-full w-lg border-2 border-gray-400 rounded-md p-1"
            placeholder="Content"
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
          />
          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded ">
            Add +
          </button>
        </form>

        <div className="mt-20 mx-auto ">
          <ul className="flex flex-col gap-4 justify-between w-full">
            {notes.map((note) => (
              <li
                key={note.id}
                className="bg-gray-100 w-[400px] px-4 py-2 rounded border-l border-blue-400 border-l-2"
              >
                <p className="font-bold uppercase">{note.title}</p>
                <p className="text-sm">{note.content}</p>
              </li>
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

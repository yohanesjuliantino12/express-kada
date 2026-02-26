const notes = [
  {
    id: 1,
    title: 'first note',
    content: 'My first note is here.',
  },
];

// Menggunakan named export untuk menggantikan exports.list
export const list = () => {
  return notes.map(({ id, title }) => ({
    id,
    title,
  }));
};

export const get = (id) => {
    const note = notes.find(
        (note) => note.id === id
    );

    if(!note){
        throw new Error('Note not found');
    }

    return note;
}

// Diasumsikan variabel 'notes' didefinisikan di luar fungsi ini
export const create = (title, content) => {
  // Mengambil id dari note terakhir untuk auto-increment sederhana
  const { id: lastId } = notes[notes.length - 1];

  const newNote = {
    id: lastId + 1,
    title,
    content,
  };

  notes.push(newNote);
  return newNote;
};

export const update = (id, title, content) => {
  const index = notes.findIndex(
    (note) => note.id === id
  );

  if (index < 0) {
    throw new Error('Note not found for update');
  }

  const note = notes[index];
  note.title = title;
  note.content = content;
  notes[index] = note;

  return note;
};

export const remove = (id) => {
  // Cari index dari note yang ingin dihapus
  const index = notes.findIndex((note) => note.id === id);

  // Jika index tidak ditemukan (-1), lempar error
  if (index === -1) {
    throw new Error('Note not found for delete');
  }

  // Menghapus 1 elemen pada posisi index tersebut (modifikasi array asli)
  notes.splice(index, 1);
  
  return;
};
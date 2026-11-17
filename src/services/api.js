const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/siswa';

/**
 * Mengambil semua data siswa, dengan opsional parameter pencarian (search)
 */
export async function fetchSiswa(search = '') {
  const url = search ? `${API_BASE_URL}?search=${encodeURIComponent(search)}` : API_BASE_URL;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal mengambil data siswa');
  }
  return data.data || [];
}

/**
 * Mengambil satu data siswa berdasarkan ID
 */
export async function fetchSiswaById(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal mengambil detail siswa');
  }
  return data.data;
}

/**
 * Menambahkan data siswa baru
 */
export async function createSiswa(payload) {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal menambahkan data siswa');
  }
  return data.data;
}

/**
 * Memperbarui data siswa berdasarkan ID
 */
export async function updateSiswa(id, payload) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memperbarui data siswa');
  }
  return data.data;
}

/**
 * Menghapus data siswa berdasarkan ID
 */
export async function deleteSiswa(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal menghapus data siswa');
  }
  return data;
}

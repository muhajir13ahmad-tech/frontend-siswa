const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/siswa';

/**
 * Mengambil semua data siswa dari MySQL, mendukung pencarian
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
 * Mengambil satu data siswa berdasarkan kode_siswa
 */
export async function fetchSiswaByKode(kode) {
  const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(kode)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal mengambil detail siswa');
  }
  return data.data;
}

/**
 * Menambahkan data siswa baru ke tabel siswa
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
 * Memperbarui data siswa berdasarkan kode_siswa
 */
export async function updateSiswa(kode, payload) {
  const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(kode)}`, {
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
 * Menghapus data siswa berdasarkan kode_siswa
 */
export async function deleteSiswa(kode) {
  const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(kode)}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal menghapus data siswa');
  }
  return data;
}

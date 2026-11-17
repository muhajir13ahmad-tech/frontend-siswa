import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchSiswa,
  createSiswa,
  updateSiswa,
  deleteSiswa
} from './services/api';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import SiswaModal from './components/SiswaModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconMapPin,
  IconGraduationCap
} from './components/Icons';
import './App.css';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

// Berikan styling warna badge unik sesuai jurusan
function getJurusanBadgeClass(jurusan = '') {
  const lower = jurusan.toLowerCase();
  if (lower.includes('rekayasa') || lower.includes('rpl')) return 'badge-rpl';
  if (lower.includes('jaringan') || lower.includes('tkj')) return 'badge-tkj';
  if (lower.includes('multimedia') || lower.includes('dkv')) return 'badge-mm';
  if (lower.includes('sistem')) return 'badge-sija';
  return 'badge-default';
}

function App() {
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTarget, setDeletingTarget] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current && current.message === message ? null : current));
    }, 3500);
  }, []);

  // Fetch data siswa dari backend
  const loadData = useCallback(async (keyword = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSiswa(keyword);
      setSiswaList(data);
      setIsConnected(true);
    } catch (err) {
      console.error('Error fetching siswa:', err);
      setError(err.message || 'Gagal terhubung ke Backend API');
      setIsConnected(false);
      showToast('Gagal terhubung ke backend: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Search Input (bisa debounced / enter / live)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter siswa berdasarkan search input dan jurusan dropdown
  const filteredSiswa = useMemo(() => {
    return siswaList.filter((s) => {
      const matchSearch =
        searchTerm === '' ||
        s.kode_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.alamat_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.jurusan_siswa.toLowerCase().includes(searchTerm.toLowerCase());

      const matchJurusan =
        selectedJurusan === 'ALL' || s.jurusan_siswa === selectedJurusan;

      return matchSearch && matchJurusan;
    });
  }, [siswaList, searchTerm, selectedJurusan]);

  // Daftar unik jurusan untuk filter dropdown
  const uniqueJurusanOptions = useMemo(() => {
    const setJur = new Set(siswaList.map((s) => s.jurusan_siswa).filter(Boolean));
    return Array.from(setJur);
  }, [siswaList]);

  // Saran kode siswa berikutnya (contoh SIS-005)
  const nextKodeSuggestion = useMemo(() => {
    if (siswaList.length === 0) return 'SIS-001';
    let maxNum = 0;
    siswaList.forEach((s) => {
      const match = s.kode_siswa.match(/(\d+)/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const nextNum = maxNum + 1;
    return `SIS-${String(nextNum).padStart(3, '0')}`;
  }, [siswaList]);

  // Open Modal untuk Tambah
  const handleOpenAddModal = () => {
    setEditingSiswa(null);
    setIsModalOpen(true);
  };

  // Open Modal untuk Edit
  const handleOpenEditModal = (siswa) => {
    setEditingSiswa(siswa);
    setIsModalOpen(true);
  };

  // Simpan Siswa (Create / Update)
  const handleSaveSiswa = async (formData, id) => {
    if (id) {
      // Update
      const updated = await updateSiswa(id, formData);
      setSiswaList((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast(`Data "${updated.nama_siswa}" berhasil diperbarui!`, 'success');
    } else {
      // Create
      const created = await createSiswa(formData);
      setSiswaList((prev) => [created, ...prev]);
      showToast(`Siswa "${created.nama_siswa}" (${created.kode_siswa}) berhasil ditambahkan!`, 'success');
    }
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (siswa) => {
    setDeletingTarget(siswa);
    setIsDeleteModalOpen(true);
  };

  // Konfirmasi Delete
  const handleConfirmDelete = async (id) => {
    try {
      await deleteSiswa(id);
      setSiswaList((prev) => prev.filter((s) => s.id !== id));
      showToast('Data siswa berhasil dihapus!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal menghapus siswa', 'error');
      throw err;
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header & Navbar */}
      <Navbar
        onRefresh={() => loadData(searchTerm)}
        isConnected={isConnected}
        loading={loading}
      />

      <main className="main-container">
        {/* Statistics Cards */}
        <StatsCards siswaList={siswaList} />

        {/* Action Bar (Search, Filter, Tambah) */}
        <section className="controls-card">
          <div className="controls-left">
            <div className="search-wrapper">
              <IconSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Cari berdasarkan kode, nama, jurusan..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              )}
            </div>

            <div className="filter-wrapper">
              <select
                className="filter-select"
                value={selectedJurusan}
                onChange={(e) => setSelectedJurusan(e.target.value)}
              >
                <option value="ALL">Semua Jurusan ({siswaList.length})</option>
                {uniqueJurusanOptions.map((jur) => (
                  <option key={jur} value={jur}>
                    {jur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="controls-right">
            <button
              type="button"
              className="btn btn-primary btn-add"
              onClick={handleOpenAddModal}
            >
              <IconPlus />
              <span>Tambah Siswa Baru</span>
            </button>
          </div>
        </section>

        {/* Error Alert jika backend mati */}
        {error && (
          <div className="alert-box alert-danger">
            <strong>Koneksi Bermasalah:</strong> {error}
            <div className="mt-1">
              Pastikan backend Express berjalan di <code>http://localhost:5000</code>.
            </div>
          </div>
        )}

        {/* Table Data Siswa */}
        <section className="table-card">
          <div className="table-card-header">
            <div className="table-title-group">
              <h2 className="table-title">Daftar Data Siswa</h2>
              <span className="table-count-badge">
                Menampilkan {filteredSiswa.length} dari {siswaList.length} siswa
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No</th>
                  <th style={{ width: '130px' }}>Kode Siswa</th>
                  <th>Nama Lengkap</th>
                  <th>Jurusan</th>
                  <th>Tanggal Lahir</th>
                  <th>Alamat Domisili</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8">
                      <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Memuat data siswa dari database...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredSiswa.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8">
                      <div className="empty-state">
                        <IconGraduationCap className="empty-icon" />
                        <h3>Tidak Ada Data Siswa</h3>
                        <p>
                          {searchTerm || selectedJurusan !== 'ALL'
                            ? 'Tidak ditemukan siswa dengan kata kunci / filter yang dipilih.'
                            : 'Belum ada data siswa tersimpan. Silakan klik "Tambah Siswa Baru".'}
                        </p>
                        {searchTerm && (
                          <button
                            type="button"
                            className="btn btn-secondary mt-2"
                            onClick={() => {
                              setSearchTerm('');
                              setSelectedJurusan('ALL');
                            }}
                          >
                            Reset Filter Pencarian
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSiswa.map((siswa, index) => (
                    <tr key={siswa.id} className="table-row">
                      <td className="text-muted font-medium">{index + 1}</td>
                      <td>
                        <span className="badge-kode">{siswa.kode_siswa}</span>
                      </td>
                      <td className="font-semibold text-main">
                        {siswa.nama_siswa}
                      </td>
                      <td>
                        <span className={`badge-jurusan ${getJurusanBadgeClass(siswa.jurusan_siswa)}`}>
                          {siswa.jurusan_siswa}
                        </span>
                      </td>
                      <td>
                        <div className="cell-with-icon">
                          <IconCalendar className="cell-icon text-muted" />
                          <span>{formatDate(siswa.tgl_siswa)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="cell-with-icon">
                          <IconMapPin className="cell-icon text-muted" />
                          <span className="truncate-text" title={siswa.alamat_siswa}>
                            {siswa.alamat_siswa}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons-wrapper">
                          <button
                            type="button"
                            className="action-btn action-btn-edit"
                            onClick={() => handleOpenEditModal(siswa)}
                            title="Edit Siswa"
                          >
                            <IconEdit />
                          </button>
                          <button
                            type="button"
                            className="action-btn action-btn-delete"
                            onClick={() => handleOpenDeleteModal(siswa)}
                            title="Hapus Siswa"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal Tambah / Edit */}
      <SiswaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSiswa}
        editingSiswa={editingSiswa}
        nextKodeSuggestion={nextKodeSuggestion}
      />

      {/* Modal Konfirmasi Hapus */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        siswa={deletingTarget}
      />

      <footer className="footer-container">
        <p>
          Ujian Praktik Keahlian: <strong>Pengembangan Web dengan Node.js dan React</strong>
        </p>
        <p className="footer-sub">
          FullStack Web Developer &copy; {new Date().getFullYear()} — Backend (Express.js) & Frontend (React.js)
        </p>
      </footer>
    </div>
  );
}

export default App;

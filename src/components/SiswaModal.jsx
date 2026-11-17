import React, { useState, useEffect } from 'react';
import { IconClose } from './Icons';

const JURUSAN_OPTIONS = [
  'Rekayasa Perangkat Lunak',
  'Teknik Komputer & Jaringan',
  'Multimedia',
  'Sistem Informasi Jaringan & Aplikasi',
  'Desain Komunikasi Visual',
  'Teknik Elektronika Industri',
  'Akuntansi dan Keuangan Lembaga',
  'Bisnis Daring dan Pemasaran'
];

export default function SiswaModal({ isOpen, onClose, onSave, editingSiswa, nextKodeSuggestion }) {
  const [formData, setFormData] = useState({
    kode_siswa: '',
    nama_siswa: '',
    alamat_siswa: '',
    tgl_siswa: '',
    jurusan_siswa: JURUSAN_OPTIONS[0]
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingSiswa) {
      setFormData({
        kode_siswa: editingSiswa.kode_siswa || '',
        nama_siswa: editingSiswa.nama_siswa || '',
        alamat_siswa: editingSiswa.alamat_siswa || '',
        tgl_siswa: editingSiswa.tgl_siswa ? editingSiswa.tgl_siswa.substring(0, 10) : '',
        jurusan_siswa: editingSiswa.jurusan_siswa || JURUSAN_OPTIONS[0]
      });
    } else {
      setFormData({
        kode_siswa: nextKodeSuggestion || '',
        nama_siswa: '',
        alamat_siswa: '',
        tgl_siswa: new Date().toISOString().substring(0, 10),
        jurusan_siswa: JURUSAN_OPTIONS[0]
      });
    }
    setErrorMsg('');
  }, [editingSiswa, nextKodeSuggestion, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validasi
    if (
      !formData.kode_siswa.trim() ||
      !formData.nama_siswa.trim() ||
      !formData.alamat_siswa.trim() ||
      !formData.tgl_siswa.trim() ||
      !formData.jurusan_siswa.trim()
    ) {
      setErrorMsg('Harap isi semua kolom formulir!');
      return;
    }

    try {
      setSubmitting(true);
      await onSave(formData, editingSiswa ? editingSiswa.kode_siswa : null);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data ke MySQL');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {editingSiswa ? '✏️ Edit Data Siswa' : '➕ Tambah Data Siswa'}
            </h2>
            <p className="modal-desc">
              {editingSiswa ? `Perbarui data siswa (${editingSiswa.kode_siswa})` : 'Isi formulir lengkap untuk menyimpan siswa ke database'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <IconClose />
          </button>
        </div>

        {errorMsg && (
          <div className="alert-box alert-danger">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="kode_siswa">
              Kode Siswa (Primary Key) <span className="text-danger">*</span>
            </label>
            <input
              id="kode_siswa"
              name="kode_siswa"
              type="text"
              className="form-input"
              placeholder="Contoh: SIS-001"
              value={formData.kode_siswa}
              onChange={handleChange}
              required
            />
            <small className="form-help">Kode unik pengenal identitas siswa di database</small>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="nama_siswa">
              Nama Siswa <span className="text-danger">*</span>
            </label>
            <input
              id="nama_siswa"
              name="nama_siswa"
              type="text"
              className="form-input"
              placeholder="Masukkan nama lengkap siswa"
              value={formData.nama_siswa}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="tgl_siswa">
                Tgl Siswa (Tanggal Lahir) <span className="text-danger">*</span>
              </label>
              <input
                id="tgl_siswa"
                name="tgl_siswa"
                type="date"
                className="form-input"
                value={formData.tgl_siswa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="jurusan_siswa">
                Jurusan Siswa <span className="text-danger">*</span>
              </label>
              <select
                id="jurusan_siswa"
                name="jurusan_siswa"
                className="form-input"
                value={formData.jurusan_siswa}
                onChange={handleChange}
                required
              >
                {JURUSAN_OPTIONS.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="alamat_siswa">
              Alamat Siswa <span className="text-danger">*</span>
            </label>
            <textarea
              id="alamat_siswa"
              name="alamat_siswa"
              rows="3"
              className="form-input"
              placeholder="Masukkan alamat domisili lengkap siswa"
              value={formData.alamat_siswa}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : (editingSiswa ? 'Simpan Perubahan' : 'Tambahkan Siswa')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

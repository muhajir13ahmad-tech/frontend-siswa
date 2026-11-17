import React, { useState } from 'react';
import { IconTrash, IconClose } from './Icons';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, siswa }) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !siswa) return null;

  const handleConfirm = async () => {
    try {
      setDeleting(true);
      await onConfirm(siswa.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-box-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="icon-delete-circle">
            <IconTrash className="w-6 h-6 text-danger" />
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <IconClose />
          </button>
        </div>

        <div className="modal-body text-center">
          <h3 className="modal-confirm-title">Hapus Data Siswa?</h3>
          <p className="modal-confirm-desc">
            Apakah Anda yakin ingin menghapus data siswa:
            <br />
            <strong>{siswa.nama_siswa}</strong> ({siswa.kode_siswa})?
            <br />
            <span className="text-muted small">Tindakan ini tidak dapat dibatalkan.</span>
          </p>
        </div>

        <div className="modal-footer justify-center">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

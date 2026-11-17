import React from 'react';
import { IconUsers, IconGraduationCap, IconCalendar } from './Icons';

export default function StatsCards({ siswaList }) {
  const totalSiswa = siswaList.length;

  // Hitung jumlah unik jurusan
  const jurusanMap = siswaList.reduce((acc, curr) => {
    const jur = curr.jurusan_siswa || 'Lainnya';
    acc[jur] = (acc[jur] || 0) + 1;
    return acc;
  }, {});

  const totalJurusan = Object.keys(jurusanMap).length;

  // Jurusan paling populer
  let topJurusan = '-';
  let maxCount = 0;
  for (const [jurusan, count] of Object.entries(jurusanMap)) {
    if (count > maxCount) {
      maxCount = count;
      topJurusan = jurusan;
    }
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-primary">
          <IconUsers className="stat-icon" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Siswa Terdaftar</span>
          <span className="stat-value">{totalSiswa} <small>Siswa</small></span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-accent">
          <IconGraduationCap className="stat-icon" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Jurusan Aktif</span>
          <span className="stat-value">{totalJurusan} <small>Program</small></span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-success">
          <IconCalendar className="stat-icon" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Jurusan Terbanyak</span>
          <span className="stat-value truncate" title={topJurusan}>
            {topJurusan} {maxCount > 0 ? `(${maxCount})` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

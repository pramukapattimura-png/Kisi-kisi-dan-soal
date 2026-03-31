import React from 'react';
import { AppData } from '../types';

interface Step2Props {
  data: AppData;
  onChange: (data: Partial<AppData>) => void;
  onPrev: () => void;
  onGenerate: () => void;
}

export const Step2: React.FC<Step2Props> = ({ data, onChange, onPrev, onGenerate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      onChange({ [name]: parseInt(value) || 0 });
    } else {
      onChange({ [name]: value });
    }
  };

  const isComplete = data.mapel && data.kelas && data.cp && data.tp && data.materiEsensial;

  return (
    <div className="space-y-6 max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-[#E0F2F1]">
      <div className="border-b border-[#E0F2F1] pb-4">
        <h2 className="text-2xl font-bold text-[#00796B]">Detail Pembelajaran & Soal</h2>
        <p className="text-sm text-gray-500">Masukkan detail kurikulum dan jumlah soal yang diinginkan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Fase *</label>
          <select
            name="fase"
            value={data.fase}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none"
          >
            <option value="A">Fase A (Kelas 1-2)</option>
            <option value="B">Fase B (Kelas 3-4)</option>
            <option value="C">Fase C (Kelas 5-6)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Kelas *</label>
          <select
            name="kelas"
            value={data.kelas}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none"
          >
            <option value="">Pilih Kelas</option>
            <option value="Kelas 1">Kelas 1</option>
            <option value="Kelas 2">Kelas 2</option>
            <option value="Kelas 3">Kelas 3</option>
            <option value="Kelas 4">Kelas 4</option>
            <option value="Kelas 5">Kelas 5</option>
            <option value="Kelas 6">Kelas 6</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Mata Pelajaran *</label>
          <select
            name="mapel"
            value={data.mapel}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none"
          >
            <option value="">Pilih Mata Pelajaran</option>
            <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
            <option value="Akidah Akhlak">Akidah Akhlak</option>
            <option value="Fikih">Fikih</option>
            <option value="SKI">SKI</option>
            <option value="Bahasa Arab">Bahasa Arab</option>
            <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Matematika">Matematika</option>
            <option value="IPAS">IPAS</option>
            <option value="PJOK">PJOK</option>
            <option value="Seni dan Budaya">Seni dan Budaya</option>
            <option value="Bahasa Inggris">Bahasa Inggris</option>
            <option value="Koding dan KA">Koding dan KA</option>
            <option value="Bahasa Sunda">Bahasa Sunda</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Tahun Pelajaran *</label>
          <input
            type="text"
            name="tahunPelajaran"
            value={data.tahunPelajaran}
            onChange={handleChange}
            placeholder="2025/2026"
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Semester *</label>
          <select
            name="semester"
            value={data.semester}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none"
          >
            <option value="Ganjil">Ganjil</option>
            <option value="Genap">Genap</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Capaian Pembelajaran (CP) *</label>
          <textarea
            name="cp"
            value={data.cp}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none resize-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Tujuan Pembelajaran (TP) *</label>
          <textarea
            name="tp"
            value={data.tp}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none resize-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Materi Esensial *</label>
          <input
            type="text"
            name="materiEsensial"
            value={data.materiEsensial}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#F0FDF4] rounded-xl border border-[#B2DFDB]">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#00796B] uppercase">Jumlah PG</label>
          <input
            type="number"
            name="jumlahPG"
            value={data.jumlahPG}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-[#B2DFDB]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#00796B] uppercase">Jumlah Isian</label>
          <input
            type="number"
            name="jumlahIsian"
            value={data.jumlahIsian}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-[#B2DFDB]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#00796B] uppercase">Jumlah Uraian</label>
          <input
            type="number"
            name="jumlahUraian"
            value={data.jumlahUraian}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-[#B2DFDB]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600 uppercase">Level L1 (%)</label>
          <input
            type="number"
            name="persenL1"
            value={data.persenL1}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-[#B2DFDB]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600 uppercase">Level L2 (%)</label>
          <input
            type="number"
            name="persenL2"
            value={data.persenL2}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-[#B2DFDB]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600 uppercase">Level L3 (%)</label>
          <input
            type="number"
            name="persenL3"
            value={data.persenL3}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-[#B2DFDB]"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-8 py-3 border-2 border-[#00796B] text-[#00796B] font-bold rounded-xl hover:bg-[#E0F2F1] transition-all"
        >
          Kembali
        </button>
        <button
          onClick={onGenerate}
          disabled={!isComplete}
          className="px-8 py-3 bg-[#00796B] text-white font-bold rounded-xl hover:bg-[#004D40] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md"
        >
          Generate Soal & Kisi
        </button>
      </div>
    </div>
  );
};

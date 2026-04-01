import React from 'react';
import { AppData } from '../types';

interface Step1Props {
  data: AppData;
  onChange: (data: Partial<AppData>) => void;
  onNext: () => void;
}

export const Step1: React.FC<Step1Props> = ({ data, onChange, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ [e.target.name]: e.target.value });
  };

  const isComplete = data.namaSatuanPendidikan && data.namaGuru && data.namaKepalaMadrasah && data.jenisAsesmen && data.mapel && data.fase && data.kelas;

  return (
    <div className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-[#E0F2F1]">
      <div className="border-b border-[#E0F2F1] pb-4">
        <h2 className="text-2xl font-bold text-[#00796B]">Identitas Satuan Pendidikan</h2>
        <p className="text-sm text-gray-500">Lengkapi data identitas sekolah dan guru.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Jenis Asesmen *</label>
            <select
              name="jenisAsesmen"
              value={data.jenisAsesmen}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
              required
            >
              <option value="ASESMEN FORMATIF / PENILAIAN HARIAN">ASESMEN FORMATIF / PENILAIAN HARIAN</option>
              <option value="ASESMEN SUMATIF AKHIR SEMESTER (ASAS)">ASESMEN SUMATIF AKHIR SEMESTER (ASAS)</option>
              <option value="ASESMEN SUMATIF AKHIR TAHUN (ASAT)">ASESMEN SUMATIF AKHIR TAHUN (ASAT)</option>
              <option value="TRY OUT UJIAN MADRASAH">TRY OUT UJIAN MADRASAH</option>
              <option value="UJIAN MADRASAH">UJIAN MADRASAH</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Mata Pelajaran *</label>
            <select
              name="mapel"
              value={data.mapel}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
              required
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
            <label className="text-sm font-semibold text-gray-700">Fase *</label>
            <select
              name="fase"
              value={data.fase}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
              required
            >
              <option value="A">Fase A</option>
              <option value="B">Fase B</option>
              <option value="C">Fase C</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Kelas *</label>
            <select
              name="kelas"
              value={data.kelas}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
              required
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
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Nama Satuan Pendidikan *</label>
          <input
            type="text"
            name="namaSatuanPendidikan"
            value={data.namaSatuanPendidikan}
            onChange={handleChange}
            placeholder="Contoh: MI Al-Ikhlas"
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Nama Guru *</label>
            <input
              type="text"
              name="namaGuru"
              value={data.namaGuru}
              onChange={handleChange}
              placeholder="Nama Lengkap"
              className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">NIP Guru</label>
            <input
              type="text"
              name="nipGuru"
              value={data.nipGuru}
              onChange={handleChange}
              placeholder="NIP"
              className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Nama Kepala Madrasah *</label>
            <input
              type="text"
              name="namaKepalaMadrasah"
              value={data.namaKepalaMadrasah}
              onChange={handleChange}
              placeholder="Nama Lengkap"
              className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">NIP Kepala Madrasah</label>
            <input
              type="text"
              name="nipKepalaMadrasah"
              value={data.nipKepalaMadrasah}
              onChange={handleChange}
              placeholder="NIP"
              className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Metode Input *</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onChange({ inputMethod: 'manual' })}
              className={`px-4 py-3 rounded-lg border-2 font-bold transition-all ${
                data.inputMethod === 'manual'
                  ? 'border-[#00796B] bg-[#E0F2F1] text-[#00796B]'
                  : 'border-gray-200 text-gray-400 hover:border-[#B2DFDB]'
              }`}
            >
              Manual
            </button>
            <button
              type="button"
              onClick={() => onChange({ inputMethod: 'pdf' })}
              className={`px-4 py-3 rounded-lg border-2 font-bold transition-all ${
                data.inputMethod === 'pdf'
                  ? 'border-[#00796B] bg-[#E0F2F1] text-[#00796B]'
                  : 'border-gray-200 text-gray-400 hover:border-[#B2DFDB]'
              }`}
            >
              File PDF
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="px-8 py-3 bg-[#00796B] text-white font-bold rounded-xl hover:bg-[#004D40] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
};

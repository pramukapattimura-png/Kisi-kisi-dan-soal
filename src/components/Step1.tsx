import React from 'react';
import { AppData } from '../types';

interface Step1Props {
  data: AppData;
  onChange: (data: Partial<AppData>) => void;
  onNext: () => void;
}

export const Step1: React.FC<Step1Props> = ({ data, onChange, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [e.target.name]: e.target.value });
  };

  const isComplete = data.namaSatuanPendidikan && data.namaGuru && data.namaKepalaMadrasah;

  return (
    <div className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-[#E0F2F1]">
      <div className="border-b border-[#E0F2F1] pb-4">
        <h2 className="text-2xl font-bold text-[#00796B]">Identitas Satuan Pendidikan</h2>
        <p className="text-sm text-gray-500">Lengkapi data identitas sekolah dan guru.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
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

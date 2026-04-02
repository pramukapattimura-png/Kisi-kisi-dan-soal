import React, { useState } from 'react';
import { AppData } from '../types';
import { analyzePdfKisiKisi } from '../services/geminiService';
import { Loader2, CheckCircle2, AlertCircle, Edit3, Check } from 'lucide-react';

interface Step2Props {
  data: AppData;
  onChange: (data: Partial<AppData>) => void;
  onPrev: () => void;
  onGenerate: () => void;
}

export const Step2: React.FC<Step2Props> = ({ data, onChange, onPrev, onGenerate }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isEditingAnalysis, setIsEditingAnalysis] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      onChange({ [name]: parseInt(value) || 0 });
    } else {
      onChange({ [name]: value });
    }
  };

  const isComplete = data.inputMethod === 'manual' 
    ? (data.cp && data.tp && data.materiEsensial)
    : (!!data.pdfData && (data.jumlahPG > 0 || data.jumlahIsian > 0 || data.jumlahUraian > 0));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAnalyzing(true);
      setAnalysisError(null);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;
          const base64 = base64String.split(',')[1];
          
          // Analyze PDF
          const analysis = await analyzePdfKisiKisi(base64);
          
          if (analysis.jumlahPG === 0 && analysis.jumlahIsian === 0 && analysis.jumlahUraian === 0) {
            setAnalysisError('AI tidak menemukan detail jumlah soal secara otomatis. Silakan isi jumlah soal secara manual di bawah.');
          }

          onChange({ 
            pdfData: base64,
            jumlahPG: analysis.jumlahPG,
            jumlahIsian: analysis.jumlahIsian,
            jumlahUraian: analysis.jumlahUraian,
            persenL1: analysis.persenL1,
            persenL2: analysis.persenL2,
            persenL3: analysis.persenL3
          });
        } catch (error) {
          console.error('Error analyzing PDF:', error);
          setAnalysisError('Terjadi kesalahan saat menganalisa PDF. Silakan isi detail soal secara manual.');
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-[#E0F2F1]">
      <div className="border-b border-[#E0F2F1] pb-4">
        <h2 className="text-2xl font-bold text-[#00796B]">
          {data.inputMethod === 'manual' ? 'Detail Pembelajaran & Soal' : 'Upload Kisi-kisi PDF'}
        </h2>
        <p className="text-sm text-gray-500">
          {data.inputMethod === 'manual' 
            ? 'Masukkan detail kurikulum dan jumlah soal yang diinginkan.' 
            : 'Upload file PDF berisi kisi-kisi sebagai acuan pembuatan soal.'}
        </p>
      </div>

      {data.inputMethod === 'manual' && (
        <div className="grid grid-cols-1 gap-4">
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
        </div>
      )}

      {data.inputMethod === 'manual' ? (
        <>
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
        </>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Upload Kisi-kisi (PDF) *</label>
            <div className="relative border-2 border-dashed border-[#B2DFDB] rounded-xl p-8 text-center hover:border-[#00796B] transition-all bg-gray-50">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="flex justify-center">
                  <svg className="w-12 h-12 text-[#00796B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {data.pdfData ? 'File terpilih (PDF)' : 'Klik atau seret file PDF di sini'}
                </p>
                <p className="text-xs text-gray-500">Hanya file PDF yang diperbolehkan</p>
              </div>
            </div>
            
            {isAnalyzing && (
              <div className="flex items-center justify-center p-4 bg-[#E0F2F1] rounded-xl border border-[#B2DFDB] animate-pulse">
                <Loader2 className="w-5 h-5 text-[#00796B] animate-spin mr-2" />
                <span className="text-sm font-medium text-[#00796B]">Menganalisa kisi-kisi...</span>
              </div>
            )}

            {analysisError && (
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <div className="text-sm">
                    <p className="font-bold">Analisa Otomatis Gagal</p>
                    <p>AI kesulitan membaca detail soal dari PDF ini. Jangan khawatir, Anda tetap bisa melanjutkan dengan mengisi detail soal secara manual di bawah.</p>
                  </div>
                </div>
                
                <div className="p-6 bg-white rounded-xl border-2 border-[#00796B] space-y-4 shadow-sm">
                  <div className="flex items-center text-[#00796B] font-bold text-sm mb-2">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Isi Detail Soal Secara Manual:
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Jumlah PG</label>
                      <input
                        type="number"
                        name="jumlahPG"
                        value={data.jumlahPG}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Jumlah Isian</label>
                      <input
                        type="number"
                        name="jumlahIsian"
                        value={data.jumlahIsian}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Jumlah Uraian</label>
                      <input
                        type="number"
                        name="jumlahUraian"
                        value={data.jumlahUraian}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Level L1 (%)</label>
                      <input
                        type="number"
                        name="persenL1"
                        value={data.persenL1}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Level L2 (%)</label>
                      <input
                        type="number"
                        name="persenL2"
                        value={data.persenL2}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Level L3 (%)</label>
                      <input
                        type="number"
                        name="persenL3"
                        value={data.persenL3}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {data.pdfData && !isAnalyzing && !analysisError && (
              <div className="space-y-4">
                {/* Read-only Analysis Results */}
                <div className="p-6 bg-[#F0FDF4] rounded-xl border border-[#B2DFDB] space-y-4">
                  <div className="flex items-center text-[#00796B] font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Hasil Analisa AI Studio:
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-[#B2DFDB] shadow-sm">
                      <span className="text-gray-500 block mb-1">Jumlah PG</span>
                      <span className="font-bold text-xl text-[#00796B]">{data.jumlahPG}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#B2DFDB] shadow-sm">
                      <span className="text-gray-500 block mb-1">Jumlah Isian</span>
                      <span className="font-bold text-xl text-[#00796B]">{data.jumlahIsian}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#B2DFDB] shadow-sm">
                      <span className="text-gray-500 block mb-1">Jumlah Uraian</span>
                      <span className="font-bold text-xl text-[#00796B]">{data.jumlahUraian}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#B2DFDB] shadow-sm">
                      <span className="text-gray-500 block mb-1">Level L1</span>
                      <span className="font-bold text-xl text-[#00796B]">{data.persenL1}%</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#B2DFDB] shadow-sm">
                      <span className="text-gray-500 block mb-1">Level L2</span>
                      <span className="font-bold text-xl text-[#00796B]">{data.persenL2}%</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#B2DFDB] shadow-sm">
                      <span className="text-gray-500 block mb-1">Level L3</span>
                      <span className="font-bold text-xl text-[#00796B]">{data.persenL3}%</span>
                    </div>
                  </div>
                </div>

                {/* Edit Toggle Question */}
                <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-xl border border-[#B2DFDB] gap-4">
                  <span className="text-sm font-medium text-gray-700">Apakah Anda ingin mengedit hasil analisa di atas?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditingAnalysis(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isEditingAnalysis ? 'bg-[#00796B] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      <div className="flex items-center">
                        <Check className="w-4 h-4 mr-1.5" />
                        Tidak, Langsung Generate
                      </div>
                    </button>
                    <button
                      onClick={() => setIsEditingAnalysis(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isEditingAnalysis ? 'bg-[#00796B] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      <div className="flex items-center">
                        <Edit3 className="w-4 h-4 mr-1.5" />
                        Ya, Edit Hasil Analisa
                      </div>
                    </button>
                  </div>
                </div>

                {/* Editable Fields (Conditional) */}
                {isEditingAnalysis && (
                  <div className="p-6 bg-white rounded-xl border-2 border-[#00796B] space-y-4 shadow-inner">
                    <div className="flex items-center text-[#00796B] font-bold text-sm mb-2">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Hasil Analisa & Konfirmasi:
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Jumlah PG</label>
                        <input
                          type="number"
                          name="jumlahPG"
                          value={data.jumlahPG}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Jumlah Isian</label>
                        <input
                          type="number"
                          name="jumlahIsian"
                          value={data.jumlahIsian}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Jumlah Uraian</label>
                        <input
                          type="number"
                          name="jumlahUraian"
                          value={data.jumlahUraian}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Level L1 (%)</label>
                        <input
                          type="number"
                          name="persenL1"
                          value={data.persenL1}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Level L2 (%)</label>
                        <input
                          type="number"
                          name="persenL2"
                          value={data.persenL2}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Level L3 (%)</label>
                        <input
                          type="number"
                          name="persenL3"
                          value={data.persenL3}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#00796B] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {data.inputMethod === 'manual' && (
        <>
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
        </>
      )}

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-8 py-3 border-2 border-[#00796B] text-[#00796B] font-bold rounded-xl hover:bg-[#E0F2F1] transition-all"
        >
          Kembali
        </button>
        <button
          onClick={onGenerate}
          disabled={!isComplete || isAnalyzing}
          className="px-8 py-3 bg-[#00796B] text-white font-bold rounded-xl hover:bg-[#004D40] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md"
        >
          {isAnalyzing ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Menganalisa...
            </div>
          ) : 'Generate Soal & Kisi'}
        </button>
      </div>
    </div>
  );
};

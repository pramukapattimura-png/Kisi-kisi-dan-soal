/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';
import { AppData, GeneratedContent } from './types';
import { generateSoalAndKisi } from './services/geminiService';
import { Loader2, AlertCircle } from 'lucide-react';

const initialData: AppData = {
  namaSatuanPendidikan: '',
  namaGuru: '',
  nipGuru: '',
  namaKepalaMadrasah: '',
  nipKepalaMadrasah: '',
  fase: 'B',
  kelas: '',
  mapel: '',
  tahunPelajaran: '2025/2026',
  semester: 'Ganjil',
  cp: '',
  tp: '',
  materiEsensial: '',
  jumlahPG: 10,
  jumlahIsian: 5,
  jumlahUraian: 5,
  persenL1: 30,
  persenL2: 40,
  persenL3: 30,
};

export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AppData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set favicon
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    (link as any).rel = 'icon';
    (link as any).href = 'https://i.imgur.com/gUuF59Z.png';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  const handleDataChange = (newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const content = await generateSoalAndKisi(data);
      setGeneratedContent(content);
      setStep(3);
    } catch (err) {
      console.error(err);
      setError('Gagal menghasilkan soal. Silakan periksa koneksi internet atau coba lagi nanti.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setGeneratedContent(null);
    setError(null);
  };

  const handleEdit = () => {
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-16">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step >= s ? 'bg-[#00796B] text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 transition-all duration-300 ${step > s ? 'bg-[#00796B]' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <Loader2 className="w-12 h-12 text-[#00796B] animate-spin" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#00796B]">Sedang Menghasilkan Soal...</h3>
                <p className="text-gray-500">AI sedang merancang kisi-kisi dan butir soal terbaik untuk Anda.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <Step1 
                  data={data} 
                  onChange={handleDataChange} 
                  onNext={() => setStep(2)} 
                />
              )}
              {step === 2 && (
                <Step2 
                  data={data} 
                  onChange={handleDataChange} 
                  onPrev={() => setStep(1)} 
                  onGenerate={handleGenerate}
                />
              )}
              {step === 3 && generatedContent && (
                <Step3 
                  data={data} 
                  content={generatedContent} 
                  onReset={handleReset}
                  onEdit={handleEdit}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

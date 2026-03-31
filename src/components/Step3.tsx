import React from 'react';
import { AppData, GeneratedContent } from '../types';
import { Download, FileText, CheckCircle, Table, Printer } from 'lucide-react';

interface Step3Props {
  data: AppData;
  content: GeneratedContent;
  onReset: () => void;
  onEdit: () => void;
}

export const Step3: React.FC<Step3Props> = ({ data, content, onReset, onEdit }) => {
  const handlePrint = () => {
    window.print();
  };

  const downloadDoc = () => {
    const html = document.getElementById('output-content')?.innerHTML || '';
    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>Export</title>
          <style>
            @page { size: 21cm 29.7cm; margin: 2cm; }
            body { font-family: 'Times New Roman', serif; font-size: 11pt; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
            th, td { border: 1px solid black; padding: 5px; text-align: left; vertical-align: top; }
            th { background-color: #E0F2F1; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            .underline { text-decoration: underline; }
            .mt-4 { margin-top: 1rem; }
            .mb-4 { margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Soal_${data.mapel}_Kelas${data.kelas}.doc`;
    link.click();
  };

  const cleanOption = (opt: string) => {
    // Menghapus awalan seperti "a. ", "a) ", "A. ", "A) " di awal string
    return opt.replace(/^[a-dA-D][.)]\s*/, '').trim();
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <div className="no-print flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#E0F2F1]">
        <div>
          <h2 className="text-2xl font-bold text-[#00796B]">Hasil Generasi</h2>
          <p className="text-sm text-gray-500">Kisi-kisi, Soal, dan Kunci Jawaban telah siap.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onEdit}
            className="px-6 py-2 border-2 border-[#00796B] text-[#00796B] font-bold rounded-lg hover:bg-[#E0F2F1] transition-all"
          >
            Edit
          </button>
          <button
            onClick={downloadDoc}
            className="flex items-center gap-2 px-6 py-2 bg-[#00796B] text-white font-bold rounded-lg hover:bg-[#004D40] transition-all shadow-md"
          >
            <Download size={18} />
            Download Word
          </button>
        </div>
      </div>

      <div id="output-content" className="print-container space-y-12 bg-white p-8 rounded-2xl shadow-xl border border-[#E0F2F1]">
        {/* KISI-KISI SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-[#00796B] pb-2 no-print">
            <Table className="text-[#00796B]" />
            <h3 className="text-xl font-bold text-[#00796B]">KISI-KISI SOAL</h3>
          </div>
          
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold uppercase">KISI-KISI PENULISAN SOAL</h4>
            <h4 className="text-lg font-bold uppercase">{data.namaSatuanPendidikan}</h4>
          </div>

          <table className="w-full text-sm mb-6 border-collapse">
            <tbody>
              <tr>
                <td className="py-1 w-[200px]">Nama Guru</td>
                <td className="py-1 w-4">:</td>
                <td className="py-1 font-medium">{data.namaGuru}</td>
              </tr>
              <tr>
                <td className="py-1">Nama Satuan Pendidikan</td>
                <td className="py-1">:</td>
                <td className="py-1 font-medium">{data.namaSatuanPendidikan}</td>
              </tr>
              <tr>
                <td className="py-1">Mata Pelajaran</td>
                <td className="py-1">:</td>
                <td className="py-1 font-medium">{data.mapel}</td>
              </tr>
              <tr>
                <td className="py-1">Topik Pembelajaran</td>
                <td className="py-1">:</td>
                <td className="py-1 font-medium">{data.materiEsensial}</td>
              </tr>
              <tr>
                <td className="py-1">Fase / Kelas / Semester</td>
                <td className="py-1">:</td>
                <td className="py-1 font-medium">{data.fase} / {data.kelas} / {data.semester}</td>
              </tr>
              <tr>
                <td className="py-1">Tahun Pelajaran</td>
                <td className="py-1">:</td>
                <td className="py-1 font-medium">{data.tahunPelajaran}</td>
              </tr>
            </tbody>
          </table>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-xs">
              <thead>
                <tr className="bg-[#E0F2F1]">
                  <th className="border border-black p-2 text-center w-8">NO</th>
                  <th className="border border-black p-2 text-center w-12">FASE</th>
                  <th className="border border-black p-2 text-center">CAPAIAN PEMBELAJARAN (CP)</th>
                  <th className="border border-black p-2 text-center">MATERI ESENSIAL</th>
                  <th className="border border-black p-2 text-center">INDIKATOR</th>
                  <th className="border border-black p-2 text-center w-20">LEVEL KOGNITIF</th>
                  <th className="border border-black p-2 text-center w-12">NO SOAL</th>
                  <th className="border border-black p-2 text-center w-20">BENTUK SOAL</th>
                </tr>
              </thead>
              <tbody>
                {content.kisiKisi.map((row) => (
                  <tr key={row.no}>
                    <td className="border border-black p-2 text-center">{row.no}</td>
                    <td className="border border-black p-2 text-center">{row.fase}</td>
                    <td className="border border-black p-2">{row.cp}</td>
                    <td className="border border-black p-2">{row.materiEsensial}</td>
                    <td className="border border-black p-2">{row.indikator}</td>
                    <td className="border border-black p-2 text-center">{row.levelKognitif}</td>
                    <td className="border border-black p-2 text-center">{row.noSoal}</td>
                    <td className="border border-black p-2 text-center">{row.bentukSoal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 mt-12 text-sm">
            <div className="text-center">
              <p>Mengetahui,</p>
              <p>Kepala Madrasah</p>
              <div className="h-24"></div>
              <p className="font-bold underline">{data.namaKepalaMadrasah}</p>
              <p>NIP. {data.nipKepalaMadrasah || '-'}</p>
            </div>
            <div className="text-center">
              <p>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p>Guru Mata Pelajaran</p>
              <div className="h-24"></div>
              <p className="font-bold underline">{data.namaGuru}</p>
              <p>NIP. {data.nipGuru || '-'}</p>
            </div>
          </div>
        </section>

        {/* SOAL SECTION */}
        <section className="space-y-8 pt-12 border-t-2 border-dashed border-gray-200">
          <div className="flex items-center gap-2 border-b-2 border-[#00796B] pb-2 no-print">
            <FileText className="text-[#00796B]" />
            <h3 className="text-xl font-bold text-[#00796B]">NASKAH SOAL</h3>
          </div>

          <div className="text-center space-y-1 mb-8">
            <h4 className="text-lg font-bold uppercase">PENILAIAN AKHIR SEMESTER {data.semester.toUpperCase()}</h4>
            <h4 className="text-lg font-bold uppercase">{data.namaSatuanPendidikan}</h4>
            <p className="text-sm">Tahun Pelajaran {data.tahunPelajaran}</p>
          </div>

          <table className="w-full text-sm border-2 border-black mb-8">
            <tbody>
              <tr>
                <td className="p-2 border-r border-black w-1/2">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-32">Mata Pelajaran</td>
                        <td className="w-4">:</td>
                        <td>{data.mapel}</td>
                      </tr>
                      <tr>
                        <td>Kelas</td>
                        <td>:</td>
                        <td>{data.kelas}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="p-2 w-1/2">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-32">Nama</td>
                        <td className="w-4">:</td>
                        <td className="border-b border-dotted border-black">............................</td>
                      </tr>
                      <tr>
                        <td>No. Absen</td>
                        <td>:</td>
                        <td className="border-b border-dotted border-black">............................</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="space-y-8">
            {/* PG */}
            <div>
              <h5 className="font-bold mb-4">I. Berilah tanda silang (X) pada huruf a, b, c, atau d di depan jawaban yang paling benar!</h5>
              <div className="space-y-6">
                {content.soal.filter(s => s.tipe === 'PG').map((s) => (
                  <div key={s.no} className="mb-4">
                    <table className="w-full border-none">
                      <tbody>
                        <tr>
                          <td className="w-6 align-top">{s.no}. </td>
                          <td className="align-top">
                            <p className="mb-2">{s.pertanyaan}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                              {s.opsi?.map((opt, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <span className="font-semibold">{String.fromCharCode(97 + idx)}.</span>
                                  <span>{cleanOption(opt)}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>

            {/* ISIAN */}
            <div>
              <h5 className="font-bold mb-4">II. Isilah titik-titik di bawah ini dengan jawaban yang singkat dan benar!</h5>
              <div className="space-y-4">
                {content.soal.filter(s => s.tipe === 'Isian').map((s) => (
                  <div key={s.no} className="mb-2">
                    <table className="w-full border-none">
                      <tbody>
                        <tr>
                          <td className="w-6 align-top">{s.no}. </td>
                          <td className="align-top">{s.pertanyaan}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>

            {/* URAIAN */}
            <div>
              <h5 className="font-bold mb-4">III. Jawablah pertanyaan-pertanyaan di bawah ini dengan uraian yang jelas dan benar!</h5>
              <div className="space-y-6">
                {content.soal.filter(s => s.tipe === 'Uraian').map((s) => (
                  <div key={s.no} className="mb-4">
                    <table className="w-full border-none">
                      <tbody>
                        <tr>
                          <td className="w-6 align-top">{s.no}. </td>
                          <td className="align-top">{s.pertanyaan}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* KUNCI JAWABAN SECTION */}
        <section className="space-y-6 pt-12 border-t-2 border-dashed border-gray-200">
          <div className="flex items-center gap-2 border-b-2 border-[#00796B] pb-2 no-print">
            <CheckCircle className="text-[#00796B]" />
            <h3 className="text-xl font-bold text-[#00796B]">KUNCI JAWABAN</h3>
          </div>
          
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold uppercase">KUNCI JAWABAN</h4>
            <h4 className="text-lg font-bold uppercase">{data.mapel} KELAS {data.kelas}</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h5 className="font-bold text-sm">I. Pilihan Ganda</h5>
              <div className="grid grid-cols-5 gap-2">
                {content.kunciJawaban.filter(k => content.soal.find(s => s.no === k.no)?.tipe === 'PG').map(k => (
                  <div key={k.no} className="text-xs border border-black p-1 text-center">
                    {k.no}. {k.jawaban}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h5 className="font-bold text-sm mb-2">II. Isian</h5>
                <div className="space-y-1">
                  {content.kunciJawaban.filter(k => content.soal.find(s => s.no === k.no)?.tipe === 'Isian').map(k => (
                    <p key={k.no} className="text-xs">{k.no}. {k.jawaban}</p>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-bold text-sm mb-2">III. Uraian</h5>
                <div className="space-y-1">
                  {content.kunciJawaban.filter(k => content.soal.find(s => s.no === k.no)?.tipe === 'Uraian').map(k => (
                    <p key={k.no} className="text-xs">{k.no}. {k.jawaban}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

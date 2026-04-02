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
    const contentElement = document.getElementById('output-content');
    if (!contentElement) return;

    // Clone element to modify it for export without affecting UI
    const clone = contentElement.cloneNode(true) as HTMLElement;
    
    // Remove elements that shouldn't be in the Word doc
    clone.querySelectorAll('.no-print').forEach(el => el.remove());
    
    // Remove all SVGs (icons)
    clone.querySelectorAll('svg').forEach(el => el.remove());

    const html = clone.innerHTML;
    
    // Process clone for Word-specific layout (using tables for alignment)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Transform question rows to tables
    tempDiv.querySelectorAll('.question-row').forEach(row => {
      const numEl = row.querySelector('.question-num');
      const contentEl = row.querySelector('.question-content');
      if (numEl && contentEl) {
        const num = numEl.textContent;
        const content = contentEl.innerHTML;
        const table = document.createElement('table');
        table.className = 'border-none';
        table.style.marginBottom = '6pt';
        table.style.width = '100%';
        table.innerHTML = `
          <tr>
            <td style="width: 25pt; font-weight: bold; vertical-align: top; padding: 0; border: none;">${num}</td>
            <td style="vertical-align: top; padding: 0; border: none;">${content}</td>
          </tr>
        `;
        row.parentNode?.replaceChild(table, row);
      }
    });

    // Transform answer rows (Isian/Uraian)
    tempDiv.querySelectorAll('.answer-row').forEach(row => {
      const numEl = row.querySelector('.font-bold');
      const contentEl = row.querySelector('.flex-1');
      if (numEl && contentEl) {
        const num = numEl.textContent;
        const content = contentEl.innerHTML;
        const table = document.createElement('table');
        table.className = 'border-none';
        table.style.marginBottom = '2pt';
        table.style.width = '100%';
        table.innerHTML = `
          <tr>
            <td style="width: 25pt; font-weight: bold; vertical-align: top; padding: 0; border: none;">${num}</td>
            <td style="vertical-align: top; padding: 0; border: none;">${content}</td>
          </tr>
        `;
        row.parentNode?.replaceChild(table, row);
      }
    });

    // Transform PG answer grid
    tempDiv.querySelectorAll('.answer-grid').forEach(grid => {
      const items = Array.from(grid.querySelectorAll('.answer-item'));
      if (items.length > 0) {
        const table = document.createElement('table');
        table.className = 'border-none';
        table.style.width = '100%';
        let tableBody = '';
        for (let i = 0; i < items.length; i += 5) {
          tableBody += '<tr>';
          for (let j = 0; j < 5; j++) {
            const item = items[i + j];
            if (item) {
              const num = item.querySelector('.font-bold')?.textContent || '';
              const val = item.querySelector('span:last-child')?.textContent || '';
              tableBody += `
                <td style="width: 20%; padding: 2pt; border: none; font-size: 10pt;">
                  <span style="font-weight: bold;">${num}</span> ${val}
                </td>
              `;
            } else {
              tableBody += '<td style="width: 20%; border: none;"></td>';
            }
          }
          tableBody += '</tr>';
        }
        table.innerHTML = tableBody;
        grid.parentNode?.replaceChild(table, grid);
      }
    });

    // Transform option grids to tables
    tempDiv.querySelectorAll('.grid').forEach(grid => {
      const options = Array.from(grid.querySelectorAll('.option-row'));
      if (options.length === 4) {
        // Special handling for 4 options to get a|c, b|d layout
        const table = document.createElement('table');
        table.className = 'border-none';
        table.style.marginTop = '2pt';
        table.style.width = '100%';
        
        const getOptHtml = (opt: Element) => {
          const letter = opt.querySelector('.option-letter')?.textContent || '';
          const text = opt.querySelector('span:last-child')?.textContent || '';
          return `<span style="font-weight: bold;">${letter}</span> ${text}`;
        };

        table.innerHTML = `
          <tr>
            <td style="width: 50%; padding: 0; vertical-align: top; border: none;">${getOptHtml(options[0])}</td>
            <td style="width: 50%; padding: 0; vertical-align: top; border: none;">${getOptHtml(options[2])}</td>
          </tr>
          <tr>
            <td style="width: 50%; padding: 0; vertical-align: top; border: none;">${getOptHtml(options[1])}</td>
            <td style="width: 50%; padding: 0; vertical-align: top; border: none;">${getOptHtml(options[3])}</td>
          </tr>
        `;
        grid.parentNode?.replaceChild(table, grid);
      } else if (options.length > 0) {
        // Fallback for other number of options
        const table = document.createElement('table');
        table.className = 'border-none';
        table.style.marginTop = '2pt';
        table.style.width = '100%';
        let tableBody = '';
        for (let i = 0; i < options.length; i += 2) {
          tableBody += '<tr>';
          const opt1 = options[i];
          const letter1 = opt1.querySelector('.option-letter')?.textContent || '';
          const text1 = opt1.querySelector('span:last-child')?.textContent || '';
          tableBody += `
            <td style="width: 50%; padding: 0; vertical-align: top; border: none;">
              <span style="font-weight: bold;">${letter1}</span> ${text1}
            </td>
          `;
          const opt2 = options[i+1];
          if (opt2) {
            const letter2 = opt2.querySelector('.option-letter')?.textContent || '';
            const text2 = opt2.querySelector('span:last-child')?.textContent || '';
            tableBody += `
              <td style="width: 50%; padding: 0; vertical-align: top; border: none;">
                <span style="font-weight: bold;">${letter2}</span> ${text2}
              </td>
            `;
          } else {
            tableBody += '<td style="width: 50%; border: none;"></td>';
          }
          tableBody += '</tr>';
        }
        table.innerHTML = tableBody;
        grid.parentNode?.replaceChild(table, grid);
      }
    });

    const processedHtml = tempDiv.innerHTML;

    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>Export</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            @page { 
              size: 21cm 29.7cm; 
              margin: 2cm 2cm 2cm 2cm; 
              mso-page-orientation: portrait;
            }
            body { 
              font-family: 'Times New Roman', serif; 
              font-size: 11pt; 
              line-height: 1.0;
              color: black;
              mso-line-height-rule: exactly;
            }
            p { 
              margin: 0; 
              padding: 0; 
              line-height: 1.0;
              mso-line-height-rule: exactly;
            }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin-bottom: 10px; 
              border: 1px solid black;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
            th, td { 
              border: 1px solid black; 
              padding: 4px; 
              text-align: left; 
              vertical-align: top; 
            }
            .border-none, .border-none td, .border-none th {
              border: none !important;
            }
            .border-dotted {
              border-bottom: 1px dotted black !important;
            }
            .border-b {
              border-bottom: 1px solid black;
            }
            .border-r {
              border-right: 1px solid black;
            }
            th { 
              background-color: #f3f4f6; 
              font-weight: bold;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-justify { text-align: justify; }
            .font-bold { font-weight: bold; }
            .font-medium { font-weight: 500; }
            .uppercase { text-transform: uppercase; }
            .underline { text-decoration: underline; }
            .mt-4 { margin-top: 1rem; }
            .mt-8 { margin-top: 2rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .question-row { margin-bottom: 6pt; }
            .option-row { margin-bottom: 2pt; }
            .w-full { width: 100%; }
            .bg-[#E0F2F1] { background-color: #E0F2F1; }
            .no-print { display: none !important; }
            section { page-break-after: always; }
          </style>
        </head>
        <body>
          ${processedHtml}
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
            <h4 className="text-lg font-bold uppercase">KISI-KISI {data.jenisAsesmen}</h4>
            <h4 className="text-lg font-bold uppercase">{data.namaSatuanPendidikan}</h4>
            <h4 className="text-lg font-bold uppercase">TAHUN PELAJARAN {data.tahunPelajaran}</h4>
          </div>

          <table className="w-full text-sm mb-6 border-collapse">
            <tbody>
              <tr>
                <td className="py-1 w-[160px]" style={{ width: '120pt' }}>Nama Guru</td>
                <td className="py-1 w-4" style={{ width: '10pt' }}>:</td>
                <td className="py-1 font-medium">{data.namaGuru}</td>
              </tr>
              <tr>
                <td className="py-1" style={{ width: '120pt' }}>Nama Satuan Pendidikan</td>
                <td className="py-1" style={{ width: '10pt' }}>:</td>
                <td className="py-1 font-medium">{data.namaSatuanPendidikan}</td>
              </tr>
              <tr>
                <td className="py-1" style={{ width: '120pt' }}>Mata Pelajaran</td>
                <td className="py-1" style={{ width: '10pt' }}>:</td>
                <td className="py-1 font-medium">{data.mapel}</td>
              </tr>
              <tr>
                <td className="py-1" style={{ width: '120pt' }}>Fase / Kelas</td>
                <td className="py-1" style={{ width: '10pt' }}>:</td>
                <td className="py-1 font-medium">{data.fase} / {data.kelas}</td>
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

          <table className="w-full mt-12 text-sm border-none">
            <tbody>
              <tr>
                <td className="text-center border-none w-1/2">
                  <p>Mengetahui,</p>
                  <p>Kepala Madrasah</p>
                  <div className="h-24"></div>
                  <p className="font-bold underline">{data.namaKepalaMadrasah}</p>
                  <p>NIP. {data.nipKepalaMadrasah || '-'}</p>
                </td>
                <td className="text-center border-none w-1/2">
                  <p>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p>Guru Mata Pelajaran</p>
                  <div className="h-24"></div>
                  <p className="font-bold underline">{data.namaGuru}</p>
                  <p>NIP. {data.nipGuru || '-'}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* SOAL SECTION */}
        <section className="space-y-8 pt-12 border-t-2 border-dashed border-gray-200">
          <div className="flex items-center gap-2 border-b-2 border-[#00796B] pb-2 no-print">
            <FileText className="text-[#00796B]" />
            <h3 className="text-xl font-bold text-[#00796B]">NASKAH SOAL</h3>
          </div>

          <div className="text-center space-y-1 mb-8">
            <h4 className="text-lg font-bold uppercase">{data.jenisAsesmen}</h4>
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
                        <td className="w-32" style={{ width: '100pt' }}>Mata Pelajaran</td>
                        <td className="w-4" style={{ width: '10pt' }}>:</td>
                        <td>{data.mapel}</td>
                      </tr>
                      <tr>
                        <td style={{ width: '100pt' }}>Kelas</td>
                        <td style={{ width: '10pt' }}>:</td>
                        <td>{data.kelas}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="p-2 w-1/2">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-32" style={{ width: '80pt' }}>Nama</td>
                        <td className="w-4" style={{ width: '10pt' }}>:</td>
                        <td className="border-b border-dotted border-black">............................</td>
                      </tr>
                      <tr>
                        <td style={{ width: '80pt' }}>No. Absen</td>
                        <td style={{ width: '10pt' }}>:</td>
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
                  <div key={s.no} className="question-row flex gap-3">
                    <div className="question-num font-bold min-w-[25px]">{s.no}.</div>
                    <div className="question-content flex-1">
                      <p className="mb-2 text-justify">{s.pertanyaan}</p>
                      <div className="grid grid-flow-col grid-rows-2 gap-x-8 gap-y-1 mt-2">
                        {s.opsi?.map((opt, idx) => (
                          <div key={idx} className="option-row flex gap-2">
                            <span className="option-letter font-semibold">{String.fromCharCode(97 + idx)}.</span>
                            <span>{cleanOption(opt)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="clear"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* ISIAN */}
            <div>
              <h5 className="font-bold mb-4">II. Isilah titik-titik di bawah ini dengan jawaban yang singkat dan benar!</h5>
              <div className="space-y-4">
                {content.soal.filter(s => s.tipe === 'Isian').map((s) => (
                  <div key={s.no} className="question-row flex gap-3">
                    <div className="question-num font-bold min-w-[25px]">{s.no}.</div>
                    <div className="question-content flex-1 text-justify">
                      {s.pertanyaan}
                    </div>
                    <div className="clear"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* URAIAN */}
            <div>
              <h5 className="font-bold mb-4">III. Jawablah pertanyaan-pertanyaan di bawah ini dengan uraian yang jelas dan benar!</h5>
              <div className="space-y-6">
                {content.soal.filter(s => s.tipe === 'Uraian').map((s) => (
                  <div key={s.no} className="question-row flex gap-3">
                    <div className="question-num font-bold min-w-[25px]">{s.no}.</div>
                    <div className="question-content flex-1 text-justify">
                      {s.pertanyaan}
                    </div>
                    <div className="clear"></div>
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
            <h4 className="text-lg font-bold uppercase">KUNCI JAWABAN {data.jenisAsesmen}</h4>
            <h4 className="text-lg font-bold uppercase">{data.mapel} KELAS {data.kelas}</h4>
            <h4 className="text-lg font-bold uppercase">TAHUN PELAJARAN {data.tahunPelajaran}</h4>
          </div>

          <div className="space-y-6">
            <div>
              <h5 className="font-bold text-sm mb-2">I. Pilihan Ganda</h5>
              <div className="answer-grid grid grid-cols-5 gap-2">
                {content.kunciJawaban
                  .filter(k => content.soal.find(s => s.no === k.no)?.tipe === 'PG')
                  .map((k) => (
                    <div key={k.no} className="answer-item flex gap-1 text-sm">
                      <span className="font-bold">{k.no}.</span>
                      <span>{k.jawaban}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-2">II. Isian</h5>
              <div className="space-y-1">
                {content.kunciJawaban
                  .filter(k => content.soal.find(s => s.no === k.no)?.tipe === 'Isian')
                  .map((k) => (
                    <div key={k.no} className="answer-row flex gap-3 text-sm">
                      <div className="font-bold min-w-[25px]">{k.no}.</div>
                      <div className="flex-1 text-justify">{k.jawaban}</div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-2">III. Uraian</h5>
              <div className="space-y-2">
                {content.kunciJawaban
                  .filter(k => content.soal.find(s => s.no === k.no)?.tipe === 'Uraian')
                  .map((k) => (
                    <div key={k.no} className="answer-row flex gap-3 text-sm">
                      <div className="font-bold min-w-[25px]">{k.no}.</div>
                      <div className="flex-1 text-justify">{k.jawaban}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

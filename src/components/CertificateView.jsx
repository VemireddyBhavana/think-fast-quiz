import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Award } from 'lucide-react';

export default function CertificateView({ certificate, user }) {
  const certificateRef = useRef(null);

  const downloadPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(data, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${user.name}_Certificate_${certificate.certificateId}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    }
  };

  if (!certificate || !user) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <button 
        onClick={downloadPDF}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all"
      >
        <Download size={20} /> Download PDF
      </button>

      {/* The Certificate UI */}
      <div className="overflow-x-auto w-full flex justify-center">
        <div 
          ref={certificateRef}
          className="relative w-[800px] h-[600px] bg-white border-[16px] border-slate-800 p-8 shadow-2xl flex flex-col items-center justify-center text-center select-none"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {/* Decorative Corner Borders */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-yellow-500"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-yellow-500"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-yellow-500"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-yellow-500"></div>

          <Award className="text-yellow-500 w-24 h-24 mb-6" />
          
          <h1 className="text-5xl font-bold text-slate-800 uppercase tracking-widest mb-2">Certificate of Achievement</h1>
          <p className="text-xl text-slate-500 italic mb-8">This is to certify that</p>
          
          <h2 className="text-4xl font-bold text-indigo-700 mb-6 border-b-2 border-slate-200 pb-2 px-12 inline-block">
            {user.name}
          </h2>
          
          <p className="text-xl text-slate-600 mb-4">
            has successfully completed the quiz
          </p>
          <h3 className="text-2xl font-bold text-slate-800 mb-8 uppercase">
            {certificate.quizCategory}
          </h3>
          
          <div className="flex justify-between w-full px-20 mt-8 items-end">
            <div className="text-left border-t-2 border-slate-300 pt-2 w-48">
              <p className="font-bold text-slate-800">Date</p>
              <p className="text-slate-600">{new Date(certificate.dateIssued).toLocaleDateString()}</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-4 border-yellow-500 flex items-center justify-center mx-auto mb-2 text-yellow-600 font-bold text-xl rotate-12">
                {certificate.score}%
              </div>
              <p className="font-bold text-slate-400 text-sm">Score</p>
            </div>

            <div className="text-right border-t-2 border-slate-300 pt-2 w-48">
              <p className="font-bold text-slate-800">Certificate ID</p>
              <p className="text-slate-600 text-sm">{certificate.certificateId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

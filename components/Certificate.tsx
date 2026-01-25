import React from 'react';
import { QuizResult } from '../types';
import { Award, CheckCircle, Star, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CertificateProps {
  result: QuizResult;
  userName: string;
}

const SingleCertificate: React.FC<CertificateProps> = ({ result, userName }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 border border-gray-200 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-600 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="w-full h-full max-w-lg border-4 border-double border-indigo-100 p-6 relative flex flex-col justify-between">

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Trophy size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">Certificate</h1>
          <h2 className="text-xs font-medium text-indigo-600 tracking-widest uppercase">Of Achievement</h2>
        </div>

        {/* Content */}
        <div className="text-center flex-1 flex flex-col justify-center py-4">
          <p className="text-sm text-gray-500 italic mb-2">Presented to</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 border-b-2 border-indigo-100 inline-block px-6 pb-1">
            {userName}
          </h3>
          <p className="text-xs text-gray-500 mb-4">For successfully completing the quiz</p>

          <div className="bg-indigo-50 rounded-lg py-2 mb-4">
            <h4 className="text-lg font-bold text-indigo-900">{result.topic}</h4>
            <div className="flex justify-center gap-4 text-[10px] text-indigo-700 font-medium uppercase mt-1">
              <span>{result.difficulty}</span>
              <span>•</span>
              <span>{result.date}</span>
            </div>
          </div>

          {/* Stats - Compact */}
          <div className="flex justify-center gap-4 mb-2">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{result.scorePercentage}%</div>
              <div className="text-[10px] text-gray-400 uppercase">Score</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{result.correctAnswers}/{result.totalQuestions}</div>
              <div className="text-[10px] text-gray-400 uppercase">Questions</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-100">
          <div className="text-center">
            <div className="w-24 border-b border-gray-300 mb-1"></div>
            <p className="text-[10px] text-gray-400 uppercase">Date</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white mb-1 shadow-sm">
              <CheckCircle size={14} />
            </div>
            <span className="text-[8px] font-bold text-indigo-900 uppercase">Verified</span>
          </div>

          <div className="text-center">
            <div className="w-24 border-b border-gray-300 mb-1">
              <span className="text-xs font-bold text-indigo-600 block mb-1">MindSpark AI</span>
            </div>
            <p className="text-[10px] text-gray-400 uppercase">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Certificate: React.FC<CertificateProps> = ({ result, userName }) => {
  return (
    <div className="fixed inset-0 bg-white w-full h-full flex items-center justify-center p-0 m-0">
      <div className="w-[297mm] h-[210mm] border-[20px] border-double border-indigo-100 p-12 relative flex flex-col justify-between overflow-hidden bg-white mx-auto my-auto shadow-none">

        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Header */}
        <div className="text-center relative z-10 pt-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center shadow-sm">
              <Trophy size={48} className="text-indigo-600" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 tracking-tight uppercase font-serif mb-2">Certificate</h1>
          <h2 className="text-xl font-medium text-indigo-600 tracking-[0.5em] uppercase">Of Achievement</h2>
        </div>

        {/* Content */}
        <div className="text-center flex-1 flex flex-col justify-center py-8 relative z-10">
          <p className="text-xl text-gray-500 italic mb-4 font-serif">This certifcate is proudly presented to</p>

          <h3 className="text-5xl font-bold text-gray-900 mb-6 border-b-4 border-indigo-100 inline-block px-12 pb-2 font-serif">
            {userName}
          </h3>

          <p className="text-lg text-gray-500 mb-8">For successfully completing the quiz assessment on</p>

          <div className="bg-indigo-50/50 rounded-2xl py-6 px-12 mb-8 inline-block mx-auto border border-indigo-100">
            <h4 className="text-3xl font-bold text-indigo-900 mb-2">{result.topic}</h4>
            <div className="flex justify-center gap-8 text-sm text-indigo-700 font-medium uppercase tracking-wider mt-2">
              <span className="flex items-center gap-2">
                <Star size={16} fill="currentColor" /> {result.difficulty} Level
              </span>
              <span>•</span>
              <span>Completed on {result.date}</span>
            </div>
          </div>

          {/* Stats Display */}
          <div className="flex justify-center gap-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-1">{result.scorePercentage}%</div>
              <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Total Score</div>
            </div>
            <div className="w-px bg-gray-200 self-stretch"></div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-1">{result.correctAnswers}/{result.totalQuestions}</div>
              <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Correct Answers</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-8 pt-8 border-t-2 border-gray-100 relative z-10 px-12">
          <div className="text-center">
            <div className="w-64 border-b-2 border-gray-300 mb-3 mx-auto"></div>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Date of Issue</p>
          </div>

          <div className="flex flex-col items-center -mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white mb-2 shadow-lg ring-4 ring-indigo-100">
              <CheckCircle size={32} />
            </div>
          </div>

          <div className="text-center">
            <div className="w-64 border-b-2 border-gray-300 mb-3 mx-auto flex flex-col items-center justify-end h-8">
              <span className="text-xl font-bold text-indigo-600 font-serif leading-none pb-1">MindSpark AI</span>
            </div>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Authorized Signature</p>
          </div>
        </div>

        {/* ID */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-gray-300 uppercase tracking-widest">
          Certificate ID: {result.id}
        </div>

      </div>
      {/* CSS for printing A4 Landscape */}
      <style>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default Certificate;
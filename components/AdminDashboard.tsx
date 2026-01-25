import React from 'react';
import { storageService } from '../services/storageService';
import { User, QuizResult } from '../types';
import { Users, FileText, BarChart3, Search, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const users = storageService.getUsers();
  
  // Calculate Global Stats
  const totalQuizzes = users.reduce((acc, user) => acc + user.history.length, 0);
  const totalAvgScore = users.reduce((acc, user) => {
    const userTotal = user.history.reduce((sum, q) => sum + q.scorePercentage, 0);
    return acc + userTotal;
  }, 0) / (totalQuizzes || 1);

  const allQuizzes: { user: string; quiz: QuizResult }[] = users.flatMap(user => 
    user.history.map(quiz => ({ user: user.name, quiz }))
  ).sort((a, b) => new Date(b.quiz.date).getTime() - new Date(a.quiz.date).getTime());

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Activity size={24} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">{t('admin')} Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <Users size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{t('totalUsers')}</p>
              <p className="text-3xl font-extrabold text-gray-800 mt-1">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 p-4 rounded-2xl text-purple-600">
              <FileText size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{t('totalQuizzes')}</p>
              <p className="text-3xl font-extrabold text-gray-800 mt-1">{totalQuizzes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-4 rounded-2xl text-green-600">
              <BarChart3 size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{t('avgGlobalScore')}</p>
              <p className="text-3xl font-extrabold text-gray-800 mt-1">{Math.round(totalAvgScore)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 backdrop-blur-sm sticky top-0">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText size={20} className="text-indigo-500" />
                {t('recentQuizzes')}
            </h2>
          </div>
          <div className="overflow-y-auto flex-1">
            {allQuizzes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                  <p>{t('noQuizzes')}</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider sticky top-0">
                  <tr>
                    <th className="px-6 py-4">{t('user')}</th>
                    <th className="px-6 py-4">{t('topic')}</th>
                    <th className="px-6 py-4 text-center">{t('score')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allQuizzes.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.user}</td>
                      <td className="px-6 py-4 text-gray-600">{item.quiz.topic}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.quiz.scorePercentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.quiz.scorePercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 backdrop-blur-sm sticky top-0">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users size={20} className="text-indigo-500" />
                {t('registeredUsers')}
            </h2>
          </div>
          <div className="overflow-y-auto flex-1">
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider sticky top-0">
                  <tr>
                    <th className="px-6 py-4">{t('name')}</th>
                    <th className="px-6 py-4">{t('email')}</th>
                    <th className="px-6 py-4">{t('role')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                      <td className="px-6 py-4 text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
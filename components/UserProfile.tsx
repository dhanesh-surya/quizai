import React, { useState, useRef } from 'react';
import { User, QuizResult } from '../types';
import { Award, Calendar, CheckCircle, Download, TrendingUp, User as UserIcon, Mail, Lock, Camera, Edit2, X, Save, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/apiService';

interface UserProfileProps {
  user: User;
  onDownloadCertificate: (result: QuizResult) => void;
  onReview: (result: QuizResult) => void;
  onUpdateUser: (updatedUser: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onDownloadCertificate, onReview, onUpdateUser }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit Form State
  const [formData, setFormData] = useState({
    first_name: user.name,
    email: user.email,
    password: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar ? `http://localhost:8000${user.avatar}` : null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync avatar preview when user changes
  React.useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(user.avatar ? `http://localhost:8000${user.avatar}` : null);
    }
  }, [user.avatar, avatarFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = new FormData();
      if (formData.first_name !== user.name) data.append('first_name', formData.first_name);
      if (formData.email !== user.email) data.append('email', formData.email);
      if (formData.password) data.append('password', formData.password);
      if (avatarFile) data.append('avatar', avatarFile);

      // Only submit if there are changes
      if (Array.from(data.keys()).length === 0) {
        setIsEditing(false);
        setIsLoading(false);
        return;
      }

      const response = await apiService.updateProfile(data);

      const updatedUser: User = {
        ...user,
        id: response.user.id.toString(),
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatar,
        role: response.user.is_admin ? 'admin' : 'user',
      };

      onUpdateUser(updatedUser);

      // Reset avatar states after successful update
      setAvatarFile(null);
      setAvatarPreview(response.user.avatar ? `http://localhost:8000${response.user.avatar}` : null);

      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' })); // Clear password
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Construct absolute URL for avatar if needed
  const getAvatarUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000${path}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-6 animate-fade-in relative">

      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-xl shadow-indigo-50 border border-white overflow-hidden mb-8 transform transition-all hover:shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg">
                {user.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar) || ''}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 p-2 bg-white text-indigo-600 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                title="Edit Profile"
              >
                <Edit2 size={18} />
              </button>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                {user.role === 'admin' && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">Admin</span>
                )}
              </div>
              <p className="opacity-80 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {user.email}
              </p>

              <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
                  <span className="block text-3xl font-bold">{user.history.length}</span>
                  <span className="text-xs opacity-80 uppercase tracking-wider">{t('quizzesTaken')}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
                  <span className="block text-3xl font-bold flex items-center gap-1">
                    {Math.round(user.history.reduce((acc, curr) => acc + curr.scorePercentage, 0) / (user.history.length || 1))}%
                    <TrendingUp size={20} className="opacity-70" />
                  </span>
                  <span className="text-xs opacity-80 uppercase tracking-wider">{t('avgScore')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Edit2 size={20} className="text-indigo-600" />
                Edit Profile
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                  <XCircle size={16} /> {error}
                </div>
              )}

              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-3 mb-2">
                <div className="w-24 h-24 rounded-full border-4 border-indigo-100 overflow-hidden bg-gray-100 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <UserIcon size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-indigo-600 font-semibold hover:text-indigo-800">
                  Change Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your User Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">New Password <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="Leave blank to keep current"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz History Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 px-2">
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
          <Award size={24} />
        </div>
        {t('quizHistory')}
      </h2>

      {user.history.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Calendar size={32} />
          </div>
          <p className="text-gray-500 font-medium">{t('noQuizzes')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {user.history.map((quiz, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-4 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="font-bold text-lg text-gray-800">{quiz.topic}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${quiz.scorePercentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-5 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-gray-400" />
                    {quiz.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle size={16} className="text-gray-400" />
                    {quiz.correctAnswers}/{quiz.totalQuestions} {t('correct')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-8 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-2 md:mt-0">
                <div className="text-right">
                  <span className={`block text-3xl font-bold ${quiz.scorePercentage >= 70 ? 'text-green-600' : 'text-indigo-600'
                    }`}>
                    {quiz.scorePercentage}%
                  </span>
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t('score')}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onReview(quiz)}
                    className="bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-600 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-bold shadow-sm hover:shadow-md"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => onDownloadCertificate(quiz)}
                    className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 p-3.5 rounded-xl transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                    title={t('downloadCert')}
                  >
                    <Download size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
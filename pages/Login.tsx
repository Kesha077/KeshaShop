import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Language } from '../types';
import { ShieldCheck, User as UserIcon, Lock, CheckCircle } from 'lucide-react';
import { APP_CONFIG } from '../constants';

export const Login: React.FC = () => {
  const { setCurrentUser, t, language, setLanguage, registerUser, loginUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // -- Signup Form State --
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountryCode, setRegCountryCode] = useState('+993');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [successNewUser, setSuccessNewUser] = useState<User | null>(null);

  // -- Login Form State --
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // -- Admin Form State --
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  
  const [error, setError] = useState('');

  const generateUniqueId = (): string => {
      // Simple random 5-digit generation
      return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const handleAdminLogin = () => {
      // Use credentials from constants.ts
      if (adminUser === APP_CONFIG.adminUsername && adminPass === APP_CONFIG.adminPassword) {
          const admin: User = {
              id: 'admin',
              name: 'Admin',
              identifier: 'admin',
              role: 'admin'
          };
          setCurrentUser(admin);
      } else {
          setError(t.loginError);
      }
  };

  const handleSignup = () => {
      if (!regName || !regPhone || !regPassword || !regConfirmPassword) {
          setError(t.fillAllFields);
          return;
      }

      if (regPassword !== regConfirmPassword) {
          setError(t.passwordMismatch);
          return;
      }

      const newId = generateUniqueId();
      const newUser: User = {
          id: Date.now().toString(),
          name: regName,
          identifier: `${regCountryCode} ${regPhone}`, // Stored for contact purposes
          password: regPassword,
          role: 'customer',
          fiveDigitId: newId
      };

      const success = registerUser(newUser);
      if(success) {
          setSuccessNewUser(newUser);
          setError('');
      } else {
          setError("Error creating user. Try again.");
      }
  };

  const handleCustomerLogin = () => {
      if (!loginId || !loginPassword) {
          setError(t.fillAllFields);
          return;
      }
      
      const user = loginUser(loginId, loginPassword);
      if (user) {
          setCurrentUser(user);
      } else {
          setError(t.loginError);
      }
  };

  const resetForm = () => {
      setRegName('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirmPassword('');
      setError('');
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'ru', label: 'RU' },
    { code: 'tr', label: 'TR' },
    { code: 'tm', label: 'TM' },
    { code: 'en', label: 'EN' },
  ];

  // --- Render: Successful Registration Screen ---
  if (successNewUser) {
      return (
          <div className="min-h-screen bg-teal-600 flex flex-col items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                      <CheckCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.registrationSuccess}</h2>
                  <p className="text-sm text-gray-500 mb-6">{t.saveYourId}</p>
                  
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 mb-6">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">{t.customerID}</p>
                      <div className="text-4xl font-mono font-bold text-teal-600 tracking-widest">
                          {successNewUser.fiveDigitId}
                      </div>
                  </div>

                  <button 
                    onClick={() => {
                        setMode('login');
                        setLoginId(successNewUser.fiveDigitId || '');
                        setSuccessNewUser(null);
                        resetForm();
                    }}
                    className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-200"
                  >
                      {t.loginToContinue}
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 flex bg-white rounded-full shadow-sm p-1">
          {languages.map(l => (
              <button 
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${language === l.code ? 'bg-teal-600 text-white' : 'text-gray-500'}`}
              >
                  {l.label}
              </button>
          ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="bg-teal-600 p-8 text-center text-white">
            {/* UPDATED LOGO CONTAINER: Height increased, width auto, removed rounded-2xl clipping to allow shape */}
            <div className="h-24 mx-auto flex items-center justify-center mb-4">
                {APP_CONFIG.logoUrl ? (
                    <img src={APP_CONFIG.logoUrl} className="h-full w-auto object-contain drop-shadow-md" alt="Logo"/>
                ) : (
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-2xl font-serif font-bold">KS</span>
                    </div>
                )}
            </div>
            <h1 className="text-2xl font-bold font-serif tracking-wide">KESHA SHOP</h1>
            <p className="text-teal-100 text-sm mt-1">{t.welcome}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => { setActiveTab('customer'); setError(''); resetForm(); }}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'customer' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-400'}`}
            >
                <UserIcon size={18} />
                {t.customerLogin}
            </button>
             <button 
                onClick={() => { setActiveTab('admin'); setError(''); }}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'admin' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-400'}`}
            >
                <ShieldCheck size={18} />
                {t.adminLogin}
            </button>
        </div>

        <div className="p-6">
            {error && (
                <div className="mb-4 bg-red-50 text-red-600 text-xs p-3 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            {activeTab === 'admin' ? (
                // --- ADMIN LOGIN FORM ---
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{t.username}</label>
                        <div className="relative">
                            <UserIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input 
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-gray-800 focus:outline-none"
                                value={adminUser}
                                onChange={e => setAdminUser(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{t.password}</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input 
                                type="password"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-gray-800 focus:outline-none"
                                value={adminPass}
                                onChange={e => setAdminPass(e.target.value)}
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handleAdminLogin}
                        className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl mt-2 active:scale-95 transition-transform"
                    >
                        {t.login}
                    </button>
                </div>
            ) : (
                // --- CUSTOMER FORM ---
                <div className="space-y-4">
                     {/* Toggle Mode */}
                     <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                        <button 
                            onClick={() => { setMode('login'); setError(''); resetForm(); }}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'login' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'}`}
                        >
                            {t.login}
                        </button>
                        <button 
                            onClick={() => { setMode('signup'); setError(''); }}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'signup' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'}`}
                        >
                            {t.signup}
                        </button>
                     </div>

                    {mode === 'login' ? (
                        // Login Inputs
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t.enterCustomerId}</label>
                                <input 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-center font-mono text-lg tracking-widest focus:border-teal-500 focus:outline-none"
                                    placeholder="XXXXX"
                                    maxLength={5}
                                    value={loginId}
                                    onChange={e => setLoginId(e.target.value.replace(/\D/g,''))}
                                />
                            </div>
                             <div className="mt-4">
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t.password}</label>
                                <input 
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:outline-none"
                                    value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                />
                            </div>
                            <button 
                                onClick={handleCustomerLogin}
                                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl mt-4 shadow-lg shadow-teal-200 active:scale-95 transition-transform"
                            >
                                {t.login}
                            </button>
                        </div>
                    ) : (
                        // Signup Flow
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t.fullName}</label>
                                <input 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:outline-none"
                                    placeholder="John Doe"
                                    value={regName}
                                    onChange={e => setRegName(e.target.value)}
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t.contact}</label>
                                <div className="flex gap-2">
                                    <select 
                                        className="px-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                                        value={regCountryCode}
                                        onChange={e => setRegCountryCode(e.target.value)}
                                    >
                                        <option value="+993">TM +993</option>
                                        <option value="+90">TR +90</option>
                                        <option value="+7">RU +7</option>
                                        <option value="+1">US +1</option>
                                        <option value="+86">CN +86</option>
                                    </select>
                                    <input 
                                        type="tel"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:outline-none"
                                        placeholder="65 123456"
                                        value={regPhone}
                                        onChange={e => setRegPhone(e.target.value.replace(/\D/g,''))}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t.createPassword}</label>
                                <input 
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:outline-none"
                                    value={regPassword}
                                    onChange={e => setRegPassword(e.target.value)}
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t.confirmPassword}</label>
                                <input 
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:outline-none"
                                    value={regConfirmPassword}
                                    onChange={e => setRegConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button 
                                onClick={handleSignup}
                                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl mt-6 shadow-lg shadow-teal-200 active:scale-95 transition-transform"
                            >
                                {t.signup}
                            </button>
                         </div>
                    )}
                </div>
            )}
        </div>
      </div>
      <p className="mt-8 text-xs text-gray-400">© 2025 Kesha Shop App</p>
    </div>
  );
};
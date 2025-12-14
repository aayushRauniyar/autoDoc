import React, { useState } from 'react';
import { useAppContext } from '../App';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { Wrench, Car, ArrowRight, User, Settings, Check, Briefcase, LogIn } from 'lucide-react';
import { UserRole } from '../types';

export const Login = () => {
  const { login, users } = useAppContext();
  const [step, setStep] = useState<'WELCOME' | 'ROLE' | 'FORM' | 'LOGIN'>('WELCOME');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    abn: '',
    experienceYears: '',
    bio: ''
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && selectedRole) {
       // Simple check if user already exists during signup
       if (users.find(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
           alert("Account already exists. Redirecting to login.");
           setStep('LOGIN');
           setLoginEmail(formData.email);
           return;
       }

       login({
           name: formData.name,
           email: formData.email,
           role: selectedRole,
           phone: formData.phone,
           abn: formData.abn,
           experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : 0,
           bio: formData.bio,
           skills: selectedRole === UserRole.MECHANIC ? ['General Repair', 'Diagnostics'] : undefined // Default skills for MVP
       });
    }
  };

  const handleExistingLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError('');
      
      const user = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
      
      if (user) {
          login({ email: user.email });
      } else {
          setLoginError('No account found. Please check email or sign up.');
      }
  };

  const handleQuickLogin = (role: UserRole) => {
      const email = role === UserRole.CUSTOMER ? 'sarah@example.com' : 'mike@mechanic.com';
      login({ email, role });
  }

  // --- Step 1: Welcome Screen ---
  if (step === 'WELCOME') {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm flex flex-col items-center text-center space-y-10">
          
          <div className="space-y-4">
             <div className="flex items-center justify-center gap-2 mb-2">
                 {/* Small Icon Badge */}
                 <div className="bg-secondary/20 p-2 rounded-lg">
                    <Wrench className="w-6 h-6 text-secondary" />
                 </div>
                 <span className="text-xs font-bold tracking-widest text-secondary uppercase">The Car Doctor</span>
             </div>
             <h1 className="text-5xl font-mono font-bold text-primary tracking-tighter">
               AutoDoc
             </h1>
             <p className="text-gray-600 font-medium">
               Expert mechanics, on demand.<br/>Trustworthy & verified.
             </p>
          </div>

          {/* Logo / Sketch Illustration */}
          <div className="relative w-64 h-64 group cursor-pointer" onClick={() => setStep('ROLE')}>
             <div className="absolute inset-0 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all duration-500"></div>
             
             {/* AutoDoc Sketch Logo */}
             <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-xl transition-transform duration-500 group-hover:scale-105">
                <circle cx="100" cy="100" r="80" fill="#FFFFFF" stroke="#0F2A44" strokeWidth="2" />
                
                {/* Car Silhouette (Sketchy Style) */}
                <path 
                    d="M40 110 L50 90 L80 85 L120 85 L150 90 L160 110 H170 V130 H160 A10 10 0 0 1 140 130 H60 A10 10 0 0 1 40 130 H30 V110 H40 Z" 
                    fill="none" 
                    stroke="#0F2A44" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                />
                <circle cx="50" cy="130" r="12" fill="#0F2A44" />
                <circle cx="150" cy="130" r="12" fill="#0F2A44" />

                {/* Medical Cross Symbol (The "Doc" part) */}
                <rect x="85" y="60" width="30" height="80" rx="4" fill="#2FBF71" opacity="0.9" />
                <rect x="60" y="85" width="80" height="30" rx="4" fill="#2FBF71" opacity="0.9" />
                
                {/* Shine/Reflection */}
                <path d="M120 50 L140 40" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" />
                <path d="M125 55 L145 45" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
             </svg>
          </div>

          <div className="w-full space-y-4">
              <Button 
                fullWidth 
                size="lg" 
                variant="primary"
                className="uppercase tracking-widest text-sm py-5 shadow-lg shadow-primary/20"
                onClick={() => setStep('ROLE')}
              >
                Get Started
              </Button>
              
              <button 
                  onClick={() => setStep('LOGIN')}
                  className="text-primary font-bold text-sm hover:underline w-full py-2"
              >
                  Already have an account? Log In
              </button>
          </div>
          
          <div className="pt-8 w-full border-t border-gray-200">
              <p className="text-xs text-gray-400 font-mono mb-3 uppercase">Developer Quick Access</p>
              <div className="flex gap-2 justify-center">
                  <button onClick={() => handleQuickLogin(UserRole.CUSTOMER)} className="px-4 py-2 bg-white border border-gray-200 rounded text-xs font-bold hover:bg-primary hover:text-white transition-colors">Customer Demo</button>
                  <button onClick={() => handleQuickLogin(UserRole.MECHANIC)} className="px-4 py-2 bg-white border border-gray-200 rounded text-xs font-bold hover:bg-primary hover:text-white transition-colors">Mechanic Demo</button>
              </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Step 1b: Login Screen ---
  if (step === 'LOGIN') {
      return (
        <div className="min-h-screen bg-white flex flex-col p-6 font-sans animate-in slide-in-from-right duration-300">
             <div className="w-full h-1 bg-gray-100 mb-8 rounded-full overflow-hidden">
                 <div className="w-full h-full bg-primary"></div>
             </div>
             
             <div className="mb-8">
                 <h2 className="text-2xl font-mono font-bold text-primary mt-2">
                    Welcome Back
                 </h2>
                 <p className="text-sm text-gray-500 mt-1">
                    Enter your email to sign in.
                 </p>
             </div>

             <form onSubmit={handleExistingLogin} className="space-y-6">
                 <Input 
                    label="Email Address"
                    type="email" 
                    placeholder="name@example.com" 
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    error={loginError}
                    autoFocus
                    required
                 />

                 <Button fullWidth size="lg" type="submit" className="uppercase tracking-widest">
                    Log In
                 </Button>
             </form>

             <div className="mt-auto text-center">
                 <p className="text-sm text-gray-500 mb-4">Don't have an account?</p>
                 <Button variant="outline" fullWidth onClick={() => setStep('ROLE')}>
                    Create Account
                 </Button>
                 <button onClick={() => setStep('WELCOME')} className="w-full text-center text-sm font-bold text-gray-400 mt-4 py-2 hover:text-primary">
                    Back to Home
                 </button>
             </div>
        </div>
      );
  }

  // --- Step 2: Role Selection ---
  if (step === 'ROLE') {
      return (
        <div className="min-h-screen bg-white flex flex-col p-6 font-sans animate-in slide-in-from-right duration-300">
             <div className="w-full h-1 bg-gray-100 mb-8 rounded-full overflow-hidden">
                 <div className="w-1/2 h-full bg-primary"></div>
             </div>
             
             <div className="text-center mb-10">
                 <span className="text-xs font-mono font-bold text-gray-400 uppercase">Step 1/2</span>
                 <h2 className="text-2xl font-mono font-bold text-primary mt-2">
                    Join AutoDoc
                 </h2>
             </div>

             <div className="flex-1 space-y-4">
                 <div 
                    onClick={() => setSelectedRole(UserRole.CUSTOMER)}
                    className={`border-2 cursor-pointer p-6 rounded-xl flex items-center gap-4 transition-all ${selectedRole === UserRole.CUSTOMER ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                 >
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${selectedRole === UserRole.CUSTOMER ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <Car className="w-6 h-6" />
                     </div>
                     <div className="flex-1">
                        <h3 className={`text-lg font-bold ${selectedRole === UserRole.CUSTOMER ? 'text-primary' : 'text-neutral-dark'}`}>Car Owner</h3>
                        <p className="text-sm text-gray-500">I need repairs for my vehicle.</p>
                     </div>
                     {selectedRole === UserRole.CUSTOMER && <Check className="w-5 h-5 text-primary" />}
                 </div>

                 <div 
                    onClick={() => setSelectedRole(UserRole.MECHANIC)}
                    className={`border-2 cursor-pointer p-6 rounded-xl flex items-center gap-4 transition-all ${selectedRole === UserRole.MECHANIC ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                 >
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${selectedRole === UserRole.MECHANIC ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <Wrench className="w-6 h-6" />
                     </div>
                     <div className="flex-1">
                        <h3 className={`text-lg font-bold ${selectedRole === UserRole.MECHANIC ? 'text-primary' : 'text-neutral-dark'}`}>Mechanic</h3>
                        <p className="text-sm text-gray-500">I want to find jobs and earn.</p>
                     </div>
                     {selectedRole === UserRole.MECHANIC && <Check className="w-5 h-5 text-primary" />}
                 </div>
             </div>

             <div className="mt-auto pt-6">
                <Button 
                    fullWidth 
                    size="lg" 
                    disabled={!selectedRole}
                    onClick={() => setStep('FORM')}
                    className="uppercase tracking-widest text-sm py-4"
                >
                    Continue
                </Button>
                
                <div className="flex items-center justify-between mt-4">
                    <button onClick={() => setStep('WELCOME')} className="text-sm font-bold text-gray-400 hover:text-primary">
                        Back
                    </button>
                    <button onClick={() => setStep('LOGIN')} className="text-sm font-bold text-primary hover:underline">
                        Already have an account?
                    </button>
                </div>
             </div>
        </div>
      )
  }

  // --- Step 3: Registration Form ---
  return (
    <div className="min-h-screen bg-white flex flex-col p-6 font-sans animate-in slide-in-from-right duration-300">
        <div className="w-full h-1 bg-gray-100 mb-8 rounded-full overflow-hidden">
             <div className="w-full h-full bg-primary"></div>
        </div>

        <div className="mb-8">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase">Step 2/2</span>
            <h2 className="text-2xl font-mono font-bold text-primary mt-2">
                {selectedRole === UserRole.MECHANIC ? 'Mechanic Profile' : 'Contact Details'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                {selectedRole === UserRole.MECHANIC 
                    ? 'Fill in your business details to get verified.' 
                    : 'We need this to connect you with mechanics.'}
            </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 flex-1 overflow-y-auto pb-4">
            <div className="space-y-4">
                <Input 
                    label="Full Name" 
                    placeholder="e.g. John Doe" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                />
                
                <Input 
                    label="Email Address" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                />
                
                <Input 
                    label="Mobile Number" 
                    type="tel" 
                    placeholder="0400 000 000" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    required 
                />

                {/* Mechanic Specific Fields */}
                {selectedRole === UserRole.MECHANIC && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start border border-blue-100">
                            <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                            <p className="text-xs text-primary leading-relaxed">
                                <strong>Compliance Note:</strong> You must provide a valid ABN to operate on this platform as an independent contractor.
                            </p>
                        </div>

                        <Input 
                            label="ABN (Australian Business Number)" 
                            placeholder="XX XXX XXX XXX" 
                            value={formData.abn} 
                            onChange={e => setFormData({...formData, abn: e.target.value})} 
                            required 
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label="Experience (Years)" 
                                type="number" 
                                placeholder="e.g. 5" 
                                value={formData.experienceYears} 
                                onChange={e => setFormData({...formData, experienceYears: e.target.value})} 
                                required 
                            />
                            <div className="w-full">
                                <label className="block text-sm font-bold text-primary mb-2 font-mono">Insurance</label>
                                <div className="w-full px-4 py-3 bg-secondary-light border-2 border-secondary/20 rounded-lg text-secondary text-sm font-bold flex items-center justify-center cursor-pointer hover:bg-secondary hover:text-white transition-colors">
                                    Upload PDF
                                </div>
                            </div>
                        </div>

                        <TextArea 
                            label="Professional Bio" 
                            placeholder="Briefly describe your expertise..." 
                            rows={3}
                            value={formData.bio}
                            onChange={e => setFormData({...formData, bio: e.target.value})}
                        />
                    </div>
                )}
            </div>

            <div className="pt-6 mt-auto">
                <Button fullWidth size="lg" type="submit">
                    Complete Signup
                </Button>
                <button type="button" onClick={() => setStep('ROLE')} className="w-full text-center text-sm font-bold text-gray-400 mt-4 py-2 hover:text-primary">
                    Back
                </button>
            </div>
        </form>
    </div>
  );
};
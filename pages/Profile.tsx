import React from 'react';
import { useAppContext } from '../App';
import { Button } from '../components/Button';
import { UserRole, JobStatus } from '../types';
import { MapPin, Mail, Phone, Shield, Star, Car, Wrench, History } from 'lucide-react';

export const Profile = () => {
  const { currentUser, logout, jobs } = useAppContext();

  if (!currentUser) return null;

  // Calculate Stats based on Role
  const myJobs = jobs.filter(j => 
    currentUser.role === UserRole.MECHANIC 
      ? j.mechanicId === currentUser.id 
      : j.customerId === currentUser.id
  );

  // Mechanic Stats
  const completedJobs = myJobs.filter(j => j.status === JobStatus.PAID_AND_CLOSED).length;
  const experience = currentUser.experienceYears || 0;
  const rating = "4.9"; // Mock rating for MVP

  // Customer Stats: Extract unique vehicles from job history
  const uniqueVehicles = Array.from(new Set(myJobs.map(j => `${j.vehicleYear} ${j.vehicleMake} ${j.vehicleModel}`))).sort();
  const totalRequests = myJobs.length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-primary rounded-full p-1 mb-4 border-2 border-primary relative">
                <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`} 
                    alt="avatar" 
                    className="w-full h-full bg-white rounded-full" 
                />
                {currentUser.isVerified && (
                     <div className="absolute bottom-0 right-0 bg-secondary text-white p-1 rounded-full border-2 border-white shadow-sm">
                        <Shield className="w-4 h-4" />
                     </div>
                )}
            </div>
            <h1 className="text-2xl font-mono font-bold text-primary">{currentUser.name}</h1>
            <p className="text-gray-500 font-medium">{currentUser.role === UserRole.MECHANIC ? 'Licensed Mechanic' : 'Car Owner'}</p>
        </div>

        {/* Dynamic Stats Section */}
        {currentUser.role === UserRole.MECHANIC ? (
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 border border-gray-200 text-center rounded-xl">
                    <div className="text-2xl font-mono font-bold text-primary">{rating}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase mt-1">Rating</div>
                </div>
                <div className="bg-white p-4 border border-gray-200 text-center rounded-xl">
                    <div className="text-2xl font-mono font-bold text-primary">{completedJobs}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase mt-1">Jobs</div>
                </div>
                <div className="bg-white p-4 border border-gray-200 text-center rounded-xl">
                    <div className="text-2xl font-mono font-bold text-primary">{experience}yr</div>
                    <div className="text-xs text-gray-500 font-bold uppercase mt-1">Exp</div>
                </div>
            </div>
        ) : (
            <div className="space-y-4 mb-8">
                {/* Customer Garage Stats */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-4 border border-gray-200 rounded-xl flex items-center gap-3 shadow-sm">
                        <div className="bg-neutral-light p-2.5 rounded-lg shrink-0">
                           <Car className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-xl font-mono font-bold text-primary leading-none mb-1">{uniqueVehicles.length}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Vehicles</div>
                        </div>
                     </div>
                     <div className="bg-white p-4 border border-gray-200 rounded-xl flex items-center gap-3 shadow-sm">
                        <div className="bg-neutral-light p-2.5 rounded-lg shrink-0">
                           <Wrench className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <div className="text-xl font-mono font-bold text-primary leading-none mb-1">{totalRequests}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Repairs</div>
                        </div>
                     </div>
                </div>

                {/* Vehicles List */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                     <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">My Garage Details</span>
                         <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-400 font-mono">HISTORY</span>
                     </div>
                     <div className="divide-y divide-gray-100">
                         {uniqueVehicles.length === 0 ? (
                             <div className="p-4 text-center text-sm text-gray-400 italic">No vehicles added yet.</div>
                         ) : (
                             uniqueVehicles.map((car, idx) => (
                                 <div key={idx} className="px-4 py-3 flex items-center justify-between group hover:bg-neutral-light transition-colors">
                                     <div className="flex items-center gap-3">
                                        <Car className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                        <span className="text-sm font-medium text-neutral-dark">{car}</span>
                                     </div>
                                 </div>
                             ))
                         )}
                     </div>
                </div>
            </div>
        )}

        {/* Contact Info Section */}
        <div className="bg-white border border-gray-200 p-6 space-y-6 rounded-xl mb-8">
            <div>
                <h3 className="text-xs font-mono font-bold text-gray-400 uppercase mb-4">Contact Info</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-neutral-light flex items-center justify-center rounded-full">
                            <Mail className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                            <p className="text-sm font-medium text-neutral-dark">{currentUser.email}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-neutral-light flex items-center justify-center rounded-full">
                            <Phone className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                            <p className="text-sm font-medium text-neutral-dark">{currentUser.phone || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-neutral-light flex items-center justify-center rounded-full">
                            <MapPin className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                            <p className="text-sm font-medium text-neutral-dark">Adelaide, SA</p>
                        </div>
                    </div>
                </div>
            </div>

            {currentUser.role === UserRole.MECHANIC && (
                <div>
                    <h3 className="text-xs font-mono font-bold text-gray-400 uppercase mb-4 pt-4 border-t border-gray-100">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {currentUser.skills?.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-neutral-light text-primary text-xs font-bold rounded-full">
                                {skill}
                            </span>
                        )) || <span className="text-sm text-gray-400">No skills listed</span>}
                    </div>
                </div>
            )}
        </div>

        <Button variant="outline" fullWidth onClick={logout} className="border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300">
            Log Out
        </Button>
    </div>
  );
};
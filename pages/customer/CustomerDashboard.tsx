import React, { useState } from 'react';
import { useAppContext } from '../../App';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { CreateJob } from './CreateJob';
import { SharedJobDetail } from '../SharedJobDetail';
import { Plus, Search, SlidersHorizontal, Car, Clock, ChevronRight } from 'lucide-react';
import { JobStatus } from '../../types';

export const CustomerDashboard = () => {
  const { jobs, currentUser } = useAppContext();
  const [view, setView] = useState<'LIST' | 'CREATE' | 'DETAIL'>('LIST');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const myJobs = jobs.filter(j => j.customerId === currentUser?.id);

  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setView('DETAIL');
  };

  if (view === 'CREATE') {
    return <CreateJob onCancel={() => setView('LIST')} onSuccess={() => setView('LIST')} />;
  }

  if (view === 'DETAIL' && selectedJobId) {
    return <SharedJobDetail jobId={selectedJobId} onBack={() => setView('LIST')} />;
  }

  return (
    <div className="space-y-8 pb-20 md:pb-0">
       {/* Search Header */}
      <div>
         <h1 className="text-3xl font-mono font-bold text-primary mb-6">My Garage</h1>
         <div className="flex gap-2">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary stroke-[3]" />
                <input 
                    type="text" 
                    placeholder="Search your repairs..." 
                    className="w-full bg-white border border-gray-200 px-12 py-3.5 rounded-lg outline-none font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-gray-400"
                />
             </div>
             <button className="bg-white border-2 border-primary w-14 flex items-center justify-center hover:bg-neutral-light rounded-lg text-primary">
                <SlidersHorizontal className="w-6 h-6" />
             </button>
         </div>
      </div>

      {/* Featured Action: Post Job - Using PRIMARY for trust/main action */}
      <div className="bg-primary p-6 text-white relative overflow-hidden shadow-lg group cursor-pointer rounded-xl" onClick={() => setView('CREATE')}>
         <div className="relative z-10 flex justify-between items-center">
            <div>
                <h2 className="font-mono font-bold text-xl mb-1 text-white">Need a repair?</h2>
                <p className="text-sm font-medium opacity-90 text-blue-100">Post a job for local mechanics</p>
            </div>
            {/* Accent colored icon box for CTA emphasis */}
            <div className="w-12 h-12 bg-accent flex items-center justify-center rounded-lg shadow-md transform group-hover:scale-105 transition-transform">
                <Plus className="w-6 h-6 text-neutral-dark" />
            </div>
         </div>
         {/* Decorative circle */}
         <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="space-y-4">
        <h3 className="font-mono font-bold text-lg text-primary">Active Repairs</h3>
        
        {myJobs.length === 0 ? (
             <div className="py-12 text-center bg-white border border-gray-200 rounded-xl">
                <div className="bg-neutral-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                   <Car className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-mono text-sm">No vehicles in garage</p>
             </div>
        ) : (
            myJobs.map(job => (
                <div 
                    key={job.id} 
                    onClick={() => handleJobClick(job.id)}
                    className="bg-white border border-gray-100 p-5 rounded-xl hover:border-primary hover:shadow-md transition-all cursor-pointer relative"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-neutral-light p-2 rounded-lg">
                                <Car className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-mono font-bold text-base text-neutral-dark">{job.vehicleMake} {job.vehicleModel}</h4>
                                <p className="text-xs text-gray-500 font-medium">{job.category}</p>
                            </div>
                        </div>
                        <Badge status={job.status} />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs font-mono font-bold text-gray-400">
                         <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(job.createdAt).toLocaleDateString()}
                         </span>
                         <span className="text-primary flex items-center group-hover:underline">
                            DETAILS <ChevronRight className="w-3 h-3" />
                         </span>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
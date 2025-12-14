import React, { useState } from 'react';
import { useAppContext } from '../../App';
import { JobMarket } from './JobMarket';
import { SharedJobDetail } from '../SharedJobDetail';
import { Analytics } from './Analytics';
import { Job, JobStatus } from '../../types';
import { Badge } from '../../components/Badge';
import { Search, SlidersHorizontal, MapPin, Wrench, ChevronRight, Bookmark, BarChart3 } from 'lucide-react';
import { JobFilter } from '../../components/JobFilter';

export const MechanicDashboard = () => {
  const [activeTab, setActiveTab] = useState<'MARKET' | 'MY_JOBS' | 'ANALYTICS'>('MARKET');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const { jobs, currentUser } = useAppContext();

  const myJobs = jobs.filter(j => j.mechanicId === currentUser?.id);

  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  if (selectedJobId) {
    return <SharedJobDetail jobId={selectedJobId} onBack={() => setSelectedJobId(null)} />;
  }

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      
      {/* Filter Modal Overlay */}
      {showFilters && (
          <JobFilter onClose={() => setShowFilters(false)} onApply={() => setShowFilters(false)} />
      )}

      {/* Header (Hidden on Analytics tab for cleaner look) */}
      {activeTab !== 'ANALYTICS' && (
        <div>
           <h1 className="text-3xl font-mono font-bold text-primary mb-6">Find a job</h1>
           <div className="flex gap-2">
               <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary stroke-[3]" />
                  <input 
                      type="text" 
                      placeholder="Enter job title or keyword" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-12 py-3.5 rounded-lg outline-none font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-gray-400"
                  />
               </div>
               <button 
                  onClick={() => setShowFilters(true)}
                  className="bg-white border-2 border-primary w-14 flex items-center justify-center hover:bg-neutral-light rounded-lg text-primary"
               >
                  <SlidersHorizontal className="w-6 h-6" />
               </button>
           </div>
        </div>
      )}

      {activeTab === 'ANALYTICS' && (
           <h1 className="text-3xl font-mono font-bold text-primary mb-6">Performance</h1>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        <button 
            onClick={() => setActiveTab('MARKET')}
            className={`pb-3 font-mono font-bold text-sm tracking-wide transition-colors ${activeTab === 'MARKET' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
            MARKET
        </button>
        <button 
            onClick={() => setActiveTab('MY_JOBS')}
            className={`pb-3 font-mono font-bold text-sm tracking-wide transition-colors ${activeTab === 'MY_JOBS' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
            MY JOBS ({myJobs.filter(j => j.status !== JobStatus.PAID_AND_CLOSED).length})
        </button>
        <button 
            onClick={() => setActiveTab('ANALYTICS')}
            className={`pb-3 font-mono font-bold text-sm tracking-wide transition-colors flex items-center gap-2 ${activeTab === 'ANALYTICS' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <BarChart3 className="w-4 h-4" />
            ANALYTICS
        </button>
      </div>

      {activeTab === 'MARKET' && (
        <div className="animate-in fade-in duration-300 space-y-8">
            {/* Featured Job Card - Using Primary Blue for high trust/value */}
            {!searchQuery && (
                <div>
                    <h3 className="font-mono font-bold text-lg text-primary mb-4">Featured jobs</h3>
                    <div className="bg-primary p-6 relative overflow-hidden text-white shadow-lg group cursor-pointer transition-transform hover:scale-[1.01] rounded-xl">
                        <div className="absolute top-4 right-4">
                            <Bookmark className="w-6 h-6 fill-accent text-accent" />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 border-2 border-white/20 bg-white/10 rounded-lg flex items-center justify-center">
                                <Wrench className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-mono font-bold text-lg leading-none text-white">Emergency Connect</h4>
                                <span className="text-xs font-medium text-white/70">Top Priority</span>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <div className="text-sm font-mono mb-2">Full-time / Remote</div>
                            <div className="border border-white/30 inline-block px-3 py-1 font-mono font-bold text-white bg-white/5 rounded-md uppercase text-xs">
                                URGENT REPAIR
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end">
                            <span className="font-mono font-bold text-accent text-lg">High Pay</span>
                        </div>
                    </div>
                </div>
            )}

            <JobMarket onJobSelect={handleJobClick} searchQuery={searchQuery} />
        </div>
      )}

      {activeTab === 'MY_JOBS' && (
          <div className="grid gap-4 animate-in fade-in duration-300">
             {myJobs.length === 0 ? (
                 <div className="py-12 text-center text-gray-400 font-mono text-sm bg-white border border-gray-200 rounded-xl">You have no active jobs.</div>
             ) : (
                 myJobs.map(job => (
                    <div 
                        key={job.id} 
                        onClick={() => handleJobClick(job.id)}
                        className="bg-white border border-gray-200 p-5 rounded-xl hover:border-primary transition-colors cursor-pointer"
                    >
                         <div className="flex justify-between mb-2">
                             <h3 className="font-mono font-bold text-lg text-primary">{job.category}</h3>
                             <Badge status={job.status} />
                         </div>
                         <p className="text-sm text-gray-500 mb-4">{job.vehicleMake} {job.vehicleModel}</p>
                         <div className="flex items-center gap-2 text-xs font-bold font-mono text-gray-400">
                             <MapPin className="w-3 h-3" /> {job.location}
                         </div>
                    </div>
                 ))
             )}
          </div>
      )}

      {activeTab === 'ANALYTICS' && (
          <Analytics />
      )}
    </div>
  );
};
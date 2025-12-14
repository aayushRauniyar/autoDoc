import React from 'react';
import { useAppContext } from '../../App';
import { JobStatus } from '../../types';
import { Button } from '../../components/Button';
import { MapPin, Bookmark, Briefcase } from 'lucide-react';

interface JobMarketProps {
  onJobSelect: (jobId: string) => void;
  searchQuery?: string;
}

export const JobMarket: React.FC<JobMarketProps> = ({ onJobSelect, searchQuery = '' }) => {
  const { jobs, acceptJob, currentUser } = useAppContext();
  
  // Filter jobs by status AND search query
  const availableJobs = jobs.filter(j => {
      const matchesStatus = j.status === JobStatus.OPEN;
      const matchesSearch = searchQuery 
        ? (j.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
           j.vehicleMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
           j.location.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      return matchesStatus && matchesSearch;
  });

  const handleAccept = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (!currentUser?.isVerified) {
        alert("Account verification required to accept jobs. Please contact admin.");
        return;
    }
    if (confirm("Accept this job? The customer will be notified.")) {
        acceptJob(jobId);
        onJobSelect(jobId);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-mono font-bold text-lg text-primary">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Based on your skills'}
      </h3>

      {availableJobs.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-lg">
            <p className="font-mono text-sm text-gray-400">No open jobs available.</p>
        </div>
      ) : (
        availableJobs.map(job => (
          <div 
            key={job.id} 
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all relative group"
            onClick={() => onJobSelect(job.id)}
          >
            {/* Bookmark Icon */}
            <div className="absolute top-5 right-5 text-gray-300 group-hover:text-primary transition-colors">
                <Bookmark className="w-5 h-5 fill-current opacity-20 group-hover:opacity-100" />
            </div>

            <div className="flex gap-4">
                {/* Logo Placeholder */}
                <div className="w-12 h-12 bg-neutral-light rounded-lg flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1">
                    <h4 className="font-mono font-bold text-lg text-primary leading-tight mb-1">{job.category}</h4>
                    <p className="text-sm text-gray-500 font-medium mb-4">{job.vehicleYear} {job.vehicleMake} • {job.vehicleModel}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono font-bold text-gray-600 uppercase tracking-wide">
                        <span className="bg-neutral-light px-2 py-1 rounded-md">On-site</span>
                        <span className="flex items-center gap-1 bg-neutral-light px-2 py-1 rounded-md">
                            <MapPin className="w-3 h-3" /> {job.location.split(',')[0]}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                 <span className="text-sm font-bold text-accent">Est. $150-300</span>
                 <Button size="sm" variant="outline" onClick={(e) => handleAccept(e, job.id)} className="border-primary text-primary hover:bg-primary hover:text-white">
                    Accept
                 </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
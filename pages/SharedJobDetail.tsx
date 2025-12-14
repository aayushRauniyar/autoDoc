import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App';
import { Job, JobStatus, Message, UserRole } from '../types';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Send, MapPin, Calendar, Car, CheckCircle, AlertTriangle, MessageSquare, Info, ChevronLeft, Camera, ImageIcon } from 'lucide-react';

interface SharedJobDetailProps {
  jobId: string;
  onBack: () => void;
}

export const SharedJobDetail: React.FC<SharedJobDetailProps> = ({ jobId, onBack }) => {
  const { jobs, currentUser, messages, sendMessage, completeJob, confirmPayment, users } = useAppContext();
  const [msgText, setMsgText] = useState('');
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'CHAT'>('DETAILS');
  const scrollRef = useRef<HTMLDivElement>(null);

  const job = jobs.find(j => j.id === jobId);
  if (!job) return <div>Job not found</div>;

  const jobMessages = messages.filter(m => m.jobId === jobId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  const mechanic = users.find(u => u.id === job.mechanicId);
  const customer = users.find(u => u.id === job.customerId);
  const otherPartyName = currentUser?.role === UserRole.CUSTOMER ? mechanic?.name : customer?.name;

  useEffect(() => {
    if (activeTab === 'CHAT' && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [jobMessages, activeTab]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (msgText.trim()) {
      sendMessage(jobId, msgText);
      setMsgText('');
    }
  };

  const isJobActive = job.status === JobStatus.ACCEPTED;
  const isJobCompletedPending = job.status === JobStatus.COMPLETED_PENDING_PAYMENT;

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col">
      {/* Header / Nav Back */}
      <div className="flex items-center justify-between mb-4">
        <button 
            onClick={onBack}
            className="flex items-center text-gray-500 hover:text-primary font-medium transition-colors"
        >
            <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <div className="md:hidden flex bg-gray-100 rounded-lg p-1">
             <button 
                onClick={() => setActiveTab('DETAILS')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'DETAILS' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
             >
                Details
             </button>
             <button 
                onClick={() => setActiveTab('CHAT')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'CHAT' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
             >
                Chat
             </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Job Details (Visible on Mobile if Details tab active) */}
        <div className={`flex flex-col gap-6 overflow-y-auto pr-2 ${activeTab === 'DETAILS' ? 'block' : 'hidden md:flex'}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <Badge status={job.status} />
                    <span className="text-xs text-gray-400 font-mono">ID: {job.id.slice(0,6)}</span>
                </div>
                
                <h1 className="text-2xl font-bold text-primary mb-1">{job.category}</h1>
                <div className="flex items-center text-gray-500 text-sm mb-6 gap-2">
                    <Calendar className="w-4 h-4" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>

                <div className="space-y-6">
                    <div className="bg-neutral-light p-4 rounded-xl space-y-3">
                        <div className="flex items-start gap-3">
                            <Car className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle</span>
                                <span className="text-base font-medium text-neutral-dark">{job.vehicleYear} {job.vehicleMake} {job.vehicleModel}</span>
                                {job.vehicleRego && (
                                    <span className="block text-xs font-mono font-bold bg-white border border-gray-200 text-gray-700 px-1.5 py-0.5 rounded mt-1 w-fit">
                                        REGO: {job.vehicleRego}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</span>
                                <span className="text-base font-medium text-neutral-dark">{job.location}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                         <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4 text-gray-400" />
                            Problem Description
                         </h3>
                         <p className="text-gray-600 bg-white border border-gray-100 p-4 rounded-xl text-sm leading-relaxed">
                            {job.description}
                         </p>
                    </div>

                    {/* Photos Section */}
                    {job.photos && job.photos.length > 0 && (
                        <div>
                             <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                Photos
                             </h3>
                             <div className="grid grid-cols-3 gap-2">
                                {job.photos.map((photo, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 relative group cursor-pointer">
                                       <img src={photo} alt="Job proof" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>

                {/* Actions Area */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    {currentUser?.role === UserRole.MECHANIC && isJobActive && (
                        <div className="bg-secondary-light p-5 rounded-xl border border-secondary/20">
                            <p className="text-sm text-secondary mb-4 font-bold text-center">Work finished?</p>
                            <Button fullWidth onClick={() => completeJob(job.id)} size="lg" className="bg-secondary border-secondary hover:bg-green-600">
                                Mark Job as Complete
                            </Button>
                        </div>
                    )}

                    {currentUser?.role === UserRole.CUSTOMER && isJobCompletedPending && (
                        <div className="bg-accent-light p-5 rounded-xl border border-accent/20 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-6 h-6 text-accent" />
                                <span className="font-bold text-neutral-dark text-lg">Job Done?</span>
                            </div>
                            <p className="text-sm text-neutral-dark/80 mb-6 leading-relaxed">
                                The mechanic has marked this job as complete. Please confirm you have paid them directly.
                            </p>
                            <Button fullWidth onClick={() => confirmPayment(job.id)} variant="primary" className="bg-accent border-accent hover:bg-orange-400 text-neutral-dark">
                                Confirm Payment & Close Job
                            </Button>
                            <p className="text-[10px] text-center text-neutral-dark/50 mt-3 font-medium uppercase tracking-wide">
                                Offline Payment Only
                            </p>
                        </div>
                    )}
                    
                    {job.status === JobStatus.PAID_AND_CLOSED && (
                        <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-center gap-2 border border-gray-200">
                            <CheckCircle className="w-6 h-6 text-gray-500" />
                            <span className="font-bold text-gray-600">Job Closed & Paid</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Chat (Visible on Mobile if Chat tab active) */}
        <div className={`flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 h-full overflow-hidden ${activeTab === 'CHAT' ? 'block' : 'hidden md:flex'}`}>
            <div className="p-4 border-b bg-gray-50/50 flex items-center gap-3">
                <div className="bg-blue-100 p-2.5 rounded-full relative">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    {job.status === JobStatus.ACCEPTED && <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-white rounded-full"></span>}
                </div>
                <div>
                    <h3 className="font-bold text-neutral-dark leading-tight">{otherPartyName || 'Support'}</h3>
                    <p className="text-xs text-gray-500 font-medium">
                    {job.status === JobStatus.OPEN ? 'Inactive' : 'Online'}
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white" ref={scrollRef}>
                {job.status === JobStatus.OPEN ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <MessageSquare className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm font-medium">Chat becomes available once a mechanic accepts the job.</p>
                    </div>
                ) : jobMessages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                        <p className="text-sm">Start the conversation with {otherPartyName}...</p>
                    </div>
                ) : (
                    jobMessages.map(m => {
                        const isMe = m.senderId === currentUser?.id;
                        return (
                            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm shadow-sm ${
                                    isMe ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                }`}>
                                    <p className="leading-relaxed">{m.content}</p>
                                    <span className={`text-[10px] block mt-1.5 text-right ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                                        {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-3 border-t bg-gray-50">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input 
                        type="text" 
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all"
                        placeholder={job.status === JobStatus.OPEN ? "Chat unavailable" : "Type a message..."}
                        value={msgText}
                        onChange={e => setMsgText(e.target.value)}
                        disabled={job.status === JobStatus.OPEN}
                    />
                    <Button type="submit" className="rounded-xl px-4" disabled={!msgText.trim() || job.status === JobStatus.OPEN}>
                        <Send className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};
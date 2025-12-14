import React from 'react';
import { useAppContext } from '../../App';
import { JobStatus } from '../../types';
import { TrendingUp, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';

export const Analytics = () => {
  const { jobs, currentUser } = useAppContext();

  // 1. Filter jobs for current mechanic that are PAID/CLOSED
  const completedJobs = jobs.filter(
    j => j.mechanicId === currentUser?.id && j.status === JobStatus.PAID_AND_CLOSED
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 2. Calculate Total Earnings
  const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.finalPrice || 0), 0);

  // 3. Prepare data for "Monthly Earnings" Chart (Last 4 months)
  const last4Months = Array.from({ length: 4 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
          monthLabel: d.toLocaleString('default', { month: 'short' }),
          monthIndex: d.getMonth(),
          year: d.getFullYear(),
          amount: 0
      };
  }).reverse();

  completedJobs.forEach(job => {
      const jobDate = new Date(job.createdAt);
      const monthData = last4Months.find(m => m.monthIndex === jobDate.getMonth() && m.year === jobDate.getFullYear());
      if (monthData) {
          monthData.amount += (job.finalPrice || 0);
      }
  });

  const maxAmount = Math.max(...last4Months.map(m => m.amount), 100); // Prevent divide by zero

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Header Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary text-white p-5 rounded-xl shadow-lg shadow-primary/20">
                <div className="flex items-center gap-2 mb-2 opacity-80">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wide">Total Earnings</span>
                </div>
                <div className="text-3xl font-bold tracking-tight">${totalEarnings.toLocaleString()}</div>
            </div>
            
            <div className="bg-white border border-gray-200 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wide">Completed Jobs</span>
                </div>
                <div className="text-3xl font-bold tracking-tight text-neutral-dark">{completedJobs.length}</div>
            </div>
        </div>

        {/* Monthly Earnings Chart */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h3 className="font-mono font-bold text-lg text-primary mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Revenue Trend
            </h3>
            
            <div className="flex items-end justify-between h-40 gap-2">
                {last4Months.map((item, index) => {
                    const heightPercentage = (item.amount / maxAmount) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                            <div className="relative w-full flex justify-center">
                                {/* Tooltip */}
                                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-dark text-white text-xs font-bold py-1 px-2 rounded mb-1 whitespace-nowrap z-10">
                                    ${item.amount}
                                </div>
                                {/* Bar */}
                                <div 
                                    className="w-full max-w-[40px] bg-gray-100 rounded-t-sm hover:bg-secondary transition-colors relative"
                                    style={{ height: `${Math.max(heightPercentage, 5)}%` }} // Min height 5% for visuals
                                ></div>
                            </div>
                            <span className="text-xs font-mono font-bold text-gray-400 mt-3 uppercase">{item.monthLabel}</span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Job Timeline */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h3 className="font-mono font-bold text-lg text-primary mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                History Timeline
            </h3>

            {completedJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm font-mono">No completed jobs yet.</div>
            ) : (
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                    {completedJobs.map((job) => (
                        <div key={job.id} className="relative pl-6">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-white border-2 border-secondary rounded-full"></div>
                            
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-sm text-neutral-dark">{job.category}</h4>
                                    <p className="text-xs text-gray-500 mb-1">{job.vehicleMake} {job.vehicleModel}</p>
                                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase bg-neutral-light px-2 py-1 rounded-full">
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-mono font-bold text-secondary">+${job.finalPrice}</span>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase">Paid</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};
import React from 'react';
import { useAppContext } from '../App';
import { MessageSquare, Briefcase, Info, ChevronLeft, Bell, CheckCheck } from 'lucide-react';
import { Button } from '../components/Button';

export const Notifications = () => {
    const { notifications, currentUser, markNotificationsAsRead, navigateTo } = useAppContext();
    
    // Filter for current user and sort by newest first
    const myNotifications = notifications
        .filter(n => n.userId === currentUser?.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const getIcon = (type: string) => {
        switch (type) {
            case 'JOB_UPDATE': return <Briefcase className="w-5 h-5 text-primary" />;
            case 'MESSAGE': return <MessageSquare className="w-5 h-5 text-secondary" />;
            default: return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="pb-20 md:pb-0 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <button onClick={() => navigateTo('DASHBOARD')} className="md:hidden">
                        <ChevronLeft className="w-6 h-6 text-primary" />
                    </button>
                    <h1 className="text-2xl font-mono font-bold text-primary">Notifications</h1>
                 </div>
                 
                 {myNotifications.some(n => !n.read) && (
                    <Button size="sm" variant="ghost" onClick={markNotificationsAsRead} className="text-xs text-primary">
                        <CheckCheck className="w-4 h-4 mr-1" /> Mark all read
                    </Button>
                 )}
            </div>

            <div className="space-y-3">
                {myNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-xl text-center">
                        <div className="bg-neutral-light p-4 rounded-full mb-4">
                            <Bell className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="font-mono text-sm text-gray-400">No new notifications</p>
                    </div>
                ) : (
                    myNotifications.map(notification => (
                        <div 
                            key={notification.id} 
                            className={`p-4 border rounded-xl transition-all ${
                                notification.read 
                                ? 'bg-white border-gray-100' 
                                : 'bg-white border-primary/30 shadow-sm'
                            }`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                    notification.read ? 'bg-neutral-light' : 'bg-primary/5'
                                }`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-bold text-sm ${notification.read ? 'text-gray-700' : 'text-primary'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-[10px] font-mono font-bold text-gray-400 whitespace-nowrap ml-2">
                                            {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${notification.read ? 'text-gray-500' : 'text-neutral-dark'}`}>
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
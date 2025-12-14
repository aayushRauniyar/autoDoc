import React from 'react';
import { useAppContext } from '../../App';
import { UserRole } from '../../types';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const AdminDashboard = () => {
  const { users, verifyMechanic } = useAppContext();

  const mechanics = users.filter(u => u.role === UserRole.MECHANIC);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500">Operational control panel</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Mechanic Verifications</h3>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {mechanics.map(mechanic => (
                    <tr key={mechanic.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mechanic.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mechanic.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge status={mechanic.isVerified ? 'VERIFIED' : 'UNVERIFIED'} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {!mechanic.isVerified && (
                                <Button size="sm" onClick={() => verifyMechanic(mechanic.id)}>
                                    Verify
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
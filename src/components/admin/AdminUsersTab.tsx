import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  ShieldCheck, 
  Wallet, 
  Eye, 
  UserCheck, 
  Calendar, 
  MapPin, 
  ShoppingBag,
  Clock
} from 'lucide-react';
import { AdminUserSummary } from '../../types';
import { formatINR } from '../../utils/currency';

interface AdminUsersTabProps {
  users: AdminUserSummary[];
  totalUsers: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectUser: (userId: string) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  totalUsers,
  searchQuery,
  onSearchChange,
  onSelectUser
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Customer & User Directory</h3>
            <p className="text-xs text-stone-500">
              Verified accounts, registration profiles, lifetime travel spending, and activity frequency.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-stone-500">
              {users.length} active registered users
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email address, or account ID..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl text-xs text-stone-800 transition focus:outline-hidden focus:border-stone-400"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">User Profile</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Reservations</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Wallet Balance</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map(u => (
                <tr 
                  key={u.id}
                  onClick={() => onSelectUser(u.id)}
                  className="hover:bg-stone-50/60 transition cursor-pointer"
                >
                  {/* User Profile */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900">{u.name}</div>
                        <div className="text-stone-500 text-[11px] truncate max-w-[200px]">{u.email}</div>
                        <div className="text-stone-400 text-[10px] font-mono">ID: {u.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                      u.role === 'admin' 
                        ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {u.role === 'admin' ? '🛡️ Admin' : 'Traveler'}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 text-stone-600">
                    <div>{u.joinedDate}</div>
                    {u.phone && <div className="text-[10px] text-stone-400">{u.phone}</div>}
                  </td>

                  {/* Bookings & Rides */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-800">{u.bookingsCount} bookings</div>
                    <div className="text-[10px] text-stone-400">{u.ridesCount} mobility rides</div>
                  </td>

                  {/* Lifetime Spend */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">{formatINR(u.totalSpent)}</div>
                  </td>

                  {/* Wallet Balance */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-emerald-700">{formatINR(u.walletBalance)}</div>
                  </td>

                  {/* Last Activity */}
                  <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                    {u.lastActive ? new Date(u.lastActive).toLocaleDateString('en-IN') : 'Recently'}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUser(u.id);
                      }}
                      className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                      title="Inspect Customer Dossier"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No traveler records matched the search terms.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Calendar, 
  User, 
  Activity, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { AdminAuditLog } from '../../types';

interface AdminAuditLogsTabProps {
  logs: AdminAuditLog[];
  totalLogs: number;
}

export const AdminAuditLogsTab: React.FC<AdminAuditLogsTabProps> = ({
  logs,
  totalLogs
}) => {
  const [filterAction, setFilterAction] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter(log => {
    if (filterAction && log.action !== filterAction) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.adminEmail.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.targetId.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const actionColors: Record<string, string> = {
    BOOKING_CANCELLED: 'bg-rose-50 text-rose-800 border-rose-200',
    BOOKING_REFUNDED: 'bg-purple-50 text-purple-800 border-purple-200',
    BOOKING_STATUS_CHANGED: 'bg-blue-50 text-blue-800 border-blue-200',
    EMAIL_RESENT: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    REVIEW_DELETED: 'bg-amber-50 text-amber-800 border-amber-200',
    DATA_EXPORTED: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    DESTINATION_CREATED: 'bg-stone-100 text-stone-800 border-stone-200',
    SECURITY_OVERRIDE: 'bg-rose-100 text-rose-900 border-rose-300'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-stone-800" />
              <h3 className="text-lg font-bold text-stone-900">Security & Compliance Audit Ledger</h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Cryptographically timestamped record of every administrative modification, refund issuance, and data export.
            </p>
          </div>

          <span className="text-xs font-mono font-medium text-stone-500">
            {filteredLogs.length} audit events logged
          </span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by admin email, target ID, details..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl text-xs text-stone-800 transition focus:outline-hidden focus:border-stone-400"
            />
          </div>

          <div>
            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 capitalize cursor-pointer focus:outline-hidden"
            >
              <option value="">All Action Types</option>
              <option value="BOOKING_CANCELLED">Booking Cancelled</option>
              <option value="BOOKING_REFUNDED">Booking Refunded</option>
              <option value="BOOKING_STATUS_CHANGED">Status Changed</option>
              <option value="EMAIL_RESENT">Email Resent</option>
              <option value="REVIEW_DELETED">Review Deleted</option>
              <option value="DATA_EXPORTED">Data Exported</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Stream */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden">
        {filteredLogs.map(log => (
          <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${actionColors[log.action] || 'bg-stone-100 text-stone-800 border-stone-200'}`}>
                  {log.action}
                </span>
                <span className="font-semibold text-stone-900">{log.adminEmail}</span>
                <span className="text-stone-400 font-mono text-[10px]">({log.adminId})</span>
              </div>

              <p className="text-stone-700 leading-relaxed font-sans text-xs">
                {log.details}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-stone-400 font-mono">
                <span>Target: <strong className="text-stone-600 font-sans">{log.targetType}</strong> #{log.targetId}</span>
                {log.ipAddress && <span>• IP: {log.ipAddress}</span>}
              </div>
            </div>

            <div className="text-[11px] text-stone-400 font-mono sm:text-right shrink-0">
              {new Date(log.timestamp).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'medium'
              })}
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center text-stone-400">
            No audit log entries found matching criteria.
          </div>
        )}
      </div>
    </div>
  );
};

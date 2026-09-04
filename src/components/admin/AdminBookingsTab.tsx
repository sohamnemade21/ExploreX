import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Mail, 
  FileSpreadsheet, 
  ArrowUpDown, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plane,
  Building2,
  Car,
  Compass,
  Train,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye
} from 'lucide-react';
import { Booking } from '../../types';
import { formatINR } from '../../utils/currency';

interface AdminBookingsTabProps {
  bookings: Booking[];
  totalBookings: number;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusFilterChange: (val: string) => void;
  emailStatusFilter: string;
  onEmailStatusFilterChange: (val: string) => void;
  onPageChange: (page: number) => void;
  onSelectBooking: (booking: Booking) => void;
  onExportCsv: () => void;
}

export const AdminBookingsTab: React.FC<AdminBookingsTabProps> = ({
  bookings,
  totalBookings,
  currentPage,
  totalPages,
  searchQuery,
  onSearchChange,
  serviceFilter,
  onServiceFilterChange,
  statusFilter,
  onStatusFilterChange,
  paymentStatusFilter,
  onPaymentStatusFilterChange,
  emailStatusFilter,
  onEmailStatusFilterChange,
  onPageChange,
  onSelectBooking,
  onExportCsv
}) => {
  const serviceIcons: Record<string, any> = {
    flight: Plane,
    hotel: Building2,
    explorer: Car,
    package: Compass,
    train: Train,
    bus: Car
  };

  return (
    <div className="space-y-6">
      {/* Header with Search & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Reservations & Inventory Dispatch</h3>
            <p className="text-xs text-stone-500">
              Complete visibility into flight, hotel, and mobility bookings with automated financial reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium text-stone-500">
              Showing {bookings.length} of {totalBookings} records
            </span>
            <button
              onClick={onExportCsv}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-xs transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Search input and Dropdown filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, customer, destination, airline..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl text-xs text-stone-800 transition focus:outline-hidden focus:border-stone-400"
            />
          </div>

          {/* Service filter */}
          <div>
            <select
              value={serviceFilter}
              onChange={e => onServiceFilterChange(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 capitalize cursor-pointer focus:outline-hidden"
            >
              <option value="">All Services</option>
              <option value="flight">Flight</option>
              <option value="hotel">Hotel</option>
              <option value="package">Holiday Package</option>
              <option value="explorer">Explorer Cab</option>
              <option value="train">Train</option>
              <option value="bus">Bus</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => onStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 capitalize cursor-pointer focus:outline-hidden"
            >
              <option value="">All Booking Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment filter */}
          <div>
            <select
              value={paymentStatusFilter}
              onChange={e => onPaymentStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 capitalize cursor-pointer focus:outline-hidden"
            >
              <option value="">All Payments</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Booking Details</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Travel Date</th>
                <th className="py-3 px-4">Financials</th>
                <th className="py-3 px-4">Payment & Gateway</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Email Delivery</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {bookings.map(bkg => {
                const Icon = serviceIcons[bkg.serviceType] || Compass;
                const baseFare = bkg.invoice?.baseFare || Math.round(bkg.totalAmount * 0.82);
                const taxes = bkg.invoice?.taxes || Math.round(bkg.totalAmount * 0.18);
                const primaryTraveler = bkg.passengerDetails?.[0]?.name || bkg.userId;

                return (
                  <tr 
                    key={bkg.id}
                    onClick={() => onSelectBooking(bkg)}
                    className="hover:bg-stone-50/60 transition cursor-pointer"
                  >
                    {/* Booking & Service */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 bg-stone-100 text-stone-700 rounded-lg shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <div className="font-mono font-bold text-stone-900">#{bkg.id}</div>
                          <div className="text-stone-600 line-clamp-1 max-w-[180px] font-medium">{bkg.title}</div>
                          <div className="text-[10px] text-stone-400 capitalize">{bkg.destinationName}</div>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{primaryTraveler}</div>
                      <div className="text-[11px] text-stone-400 font-mono">ID: {bkg.userId}</div>
                      <div className="text-[10px] text-stone-500">{bkg.passengersCount} traveler(s)</div>
                    </td>

                    {/* Travel Dates */}
                    <td className="py-3.5 px-4 text-stone-600">
                      <div className="font-semibold text-stone-800">{bkg.travelDate}</div>
                      {bkg.returnDate && (
                        <div className="text-[10px] text-stone-400">Return: {bkg.returnDate}</div>
                      )}
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        Booked: {new Date(bkg.bookingDate).toLocaleDateString('en-IN')}
                      </div>
                    </td>

                    {/* Financials (Total, Base, Taxes) */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{formatINR(bkg.totalAmount)}</div>
                      <div className="text-[10px] text-stone-500">Base: {formatINR(baseFare)}</div>
                      <div className="text-[10px] text-stone-400">GST: {formatINR(taxes)}</div>
                    </td>

                    {/* Payment & Gateway */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          bkg.paymentStatus === 'paid' ? 'bg-emerald-500' :
                          bkg.paymentStatus === 'refunded' ? 'bg-blue-500' : 'bg-amber-500'
                        }`} />
                        <span className="font-medium capitalize text-stone-800">{bkg.paymentStatus}</span>
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5 uppercase">
                        {bkg.paymentMethod}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono line-clamp-1 max-w-[120px]" title={bkg.details?.razorpayPaymentId || 'pay_demo'}>
                        {bkg.details?.razorpayPaymentId || bkg.details?.paymentId || 'pay_exp_verified'}
                      </div>
                    </td>

                    {/* Booking Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${
                        bkg.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        bkg.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {bkg.status}
                      </span>
                    </td>

                    {/* Email Delivery */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {bkg.emailStatus === 'sent' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : bkg.emailStatus === 'failed' ? (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span className="capitalize text-stone-700 text-[11px] font-medium">
                          {bkg.emailStatus || 'sent'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBooking(bkg);
                        }}
                        className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                        title="View Full Booking Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No reservations matched the active filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500">
          <div>
            Page <span className="font-semibold text-stone-800">{currentPage}</span> of{' '}
            <span className="font-semibold text-stone-800">{totalPages || 1}</span> ({totalBookings} total entries)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

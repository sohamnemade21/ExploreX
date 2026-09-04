import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Plus, 
  CreditCard, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  UserPlus, 
  Sparkles,
  Layers
} from 'lucide-react';
import { WalletTransaction, GroupTrip, GroupExpense, SettlementDebt } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../utils/currency';

export const WalletView: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'wallet' | 'group'>('wallet');

  // Wallet Top-up state
  const [topupAmount, setTopupAmount] = useState<number>(5000);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [topupLoading, setTopupLoading] = useState(false);

  // Group Splitter state
  const [groupTrips, setGroupTrips] = useState<GroupTrip[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [settlements, setSettlements] = useState<SettlementDebt[]>([]);
  const [createTripModalOpen, setCreateTripModalOpen] = useState(false);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);

  // New Group Trip Form
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripDestination, setNewTripDestination] = useState('Goa, India');
  const [newTripMembers, setNewTripMembers] = useState('Alex Rivera, Sarah Jenkins, David Kim, Priya Patel');

  // New Expense Form
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number>(4500);
  const [expensePaidById, setExpensePaidById] = useState<string>('');
  const [expenseCategory, setExpenseCategory] = useState<'Stay' | 'Food' | 'Transport' | 'Activities' | 'Shopping' | 'Other'>('Food');

  const loadAll = async () => {
    try {
      const [txData, tripData] = await Promise.all([
        api.getWalletTransactions(),
        api.getGroupTrips()
      ]);
      setTransactions(txData);
      setGroupTrips(tripData);

      if (tripData.length > 0 && !selectedGroupId) {
        setSelectedGroupId(tripData[0].id);
        if (tripData[0].members.length > 0) {
          setExpensePaidById(tripData[0].members[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadSettlement = async (groupId: string) => {
    if (!groupId) return;
    try {
      const res = await api.getGroupTripById(groupId);
      if (res?.settlement?.settlements) {
        setSettlements(res.settlement.settlements);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      loadSettlement(selectedGroupId);
    }
  }, [selectedGroupId, groupTrips]);

  const handleTopup = async () => {
    if (topupAmount <= 0) return;
    setTopupLoading(true);

    try {
      await api.topupWallet(topupAmount);
      await refreshProfile();
      await loadAll();
      success('Top-up Successful!', `${formatINR(topupAmount)} added to your ExploreX Wallet.`);
    } catch (err: any) {
      error('Top-up Failed', err.message);
    } finally {
      setTopupLoading(false);
    }
  };

  const handleCreateGroupTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitle.trim()) return;

    try {
      const members = newTripMembers.split(',').map((name, i) => ({
        id: `mem-${Date.now()}-${i}`,
        name: name.trim(),
        avatar: `https://images.unsplash.com/photo-${1535713875002 + (i % 5)}?auto=format&fit=crop&w=80&q=80`
      }));

      const created = await api.createGroupTrip({
        title: newTripTitle,
        destinationName: newTripDestination,
        members
      });

      setGroupTrips(prev => [created, ...prev]);
      setSelectedGroupId(created.id);
      setCreateTripModalOpen(false);
      setNewTripTitle('');
      success('Group Trip Created', `Created "${created.title}"`);
    } catch (err: any) {
      error('Group Creation Error', err.message);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || expenseAmount <= 0) return;

    const currentTrip = groupTrips.find(g => g.id === selectedGroupId);
    if (!currentTrip) return;

    const payer = currentTrip.members.find(m => m.id === expensePaidById) || currentTrip.members[0];

    try {
      const res = await api.addGroupExpense(selectedGroupId, {
        title: expenseTitle,
        category: expenseCategory,
        amount: expenseAmount,
        paidById: payer.id,
        paidByName: payer.name,
        splitAmongIds: currentTrip.members.map(m => m.id),
        splitType: 'equal',
        date: new Date().toISOString().split('T')[0]
      });

      setGroupTrips(prev => prev.map(t => t.id === res.trip.id ? res.trip : t));
      if (res.settlement?.settlements) {
        setSettlements(res.settlement.settlements);
      }
      setAddExpenseModalOpen(false);
      setExpenseTitle('');
      setExpenseAmount(4500);
      success('Expense Logged', `Split ${formatINR(expenseAmount)} equally across all members.`);
    } catch (err: any) {
      error('Expense Error', err.message);
    }
  };

  const handleSettleDebt = async (debtorId: string, creditorId: string, amount: number) => {
    try {
      const res = await api.settleGroupDebt(selectedGroupId, debtorId, creditorId, amount);
      setGroupTrips(prev => prev.map(t => t.id === res.trip.id ? res.trip : t));
      if (res.settlement?.settlements) {
        setSettlements(res.settlement.settlements);
      }
      await refreshProfile();
      await loadAll();
      success('Debt Settled!', `Transferred ${formatINR(amount)} seamlessly via ExploreX Wallet.`);
    } catch (err: any) {
      error('Settlement Error', err.message);
    }
  };

  const currentGroup = groupTrips.find(g => g.id === selectedGroupId);
  const totalGroupExpense = currentGroup ? currentGroup.expenses.reduce((s, e) => s + e.amount, 0) : 0;

  return (
    <div className="page-container space-y-8 pb-16 bg-white">
      {/* Header */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4DF] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#91482D] font-bold">
            <Wallet className="w-3.5 h-3.5" />
            The Expedition Ledger
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#242424] tracking-tight mt-1">
            In-App Wallet & Group Splitter
          </h1>
          <p className="font-prose text-sm sm:text-base text-[#6B6B67] mt-1 italic">
            Instant 1-click booking checkout, zero-fee wallet top-ups, automated group trip expense splitting, and direct peer settlements.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-[#F7F7F4] p-1.5 rounded-xl border border-[#E4E4DF] shadow-2xs">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              activeTab === 'wallet'
                ? 'bg-[#242424] text-[#FFFFFF] shadow-xs'
                : 'text-[#6B6B67] hover:text-[#242424]'
            }`}
          >
            Personal Wallet
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'group'
                ? 'bg-[#242424] text-[#FFFFFF] shadow-xs'
                : 'text-[#6B6B67] hover:text-[#242424]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Group Splitter ({groupTrips.length})</span>
          </button>
        </div>
      </div>

      {/* 1. PERSONAL WALLET TAB */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance & Top-up Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">ExploreX Wallet</span>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">
                  Verified Active
                </span>
              </div>

              <div>
                <div className="text-xs text-slate-400 font-medium">Total Available Balance</div>
                <div className="text-4xl font-black text-white mt-1">{formatINR(user?.walletBalance || 0)}</div>
                <div className="text-[11px] text-slate-400 mt-1">Available for flights, rides, hotels & group settlements</div>
              </div>

              {/* Instant Top-up amount chips */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <label className="text-xs font-bold text-slate-300 block">Select Top-Up Amount (INR)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1000, 2500, 5000, 10000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setTopupAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        topupAmount === amt
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                          : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="number"
                    min={100}
                    max={500000}
                    value={topupAmount}
                    onChange={e => setTopupAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none"
                  />
                  <button
                    onClick={handleTopup}
                    disabled={topupLoading}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {topupLoading ? 'Adding...' : '+ Add Funds'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Benefits */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Wallet Guarantees</h4>
              <div className="space-y-1.5 text-[11px]">
                <div>✓ Instant zero-fee checkout across all 6 travel categories</div>
                <div>✓ Instant 100% automated refund on eligible cancellations</div>
                <div>✓ Direct 1-tap peer settlements in group trips</div>
              </div>
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Wallet Activity & Transaction Ledger</h3>
              <span className="text-xs text-slate-400 font-medium font-mono">{transactions.length} records</span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No transactions recorded yet.</div>
            ) : (
              <div className="space-y-2.5">
                {transactions.map(tx => {
                  const isCredit = tx.type === 'credit';
                  return (
                    <div
                      key={tx.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {isCredit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{tx.description}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {new Date(tx.timestamp).toLocaleString()} • Ref: #{tx.id}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-sm font-black ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isCredit ? '+' : '-'}{formatINR(tx.amount)}
                        </span>
                        <span className="text-[10px] text-slate-400 block capitalize">{tx.source.replace('_', ' ')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. GROUP EXPENSE SPLITTER TAB */}
      {activeTab === 'group' && (
        <div className="space-y-6">
          {/* Trip Selector & Create Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Active Group:</span>
              {groupTrips.map(g => {
                const grpTotal = g.expenses.reduce((sum, e) => sum + e.amount, 0);
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGroupId(g.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedGroupId === g.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {g.title} ({formatINR(grpTotal)})
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCreateTripModalOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Trip</span>
              </button>

              <button
                onClick={() => setAddExpenseModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>+ Log Expense</span>
              </button>
            </div>
          </div>

          {currentGroup ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Group Summary & Minimum Cash Transfers */}
              <div className="space-y-6">
                {/* Total Expense Box */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{currentGroup.title}</h3>
                      <p className="text-[11px] text-slate-500">{currentGroup.destinationName}</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      {currentGroup.members.length} Members
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-medium">Total Shared Expenses</span>
                    <div className="text-3xl font-black text-slate-900">{formatINR(totalGroupExpense)}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Avg per member: {formatINR(totalGroupExpense / (currentGroup.members.length || 1))}
                    </div>
                  </div>

                  {/* Members Avatars List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-700">Trip Members</div>
                    <div className="space-y-1.5">
                      {currentGroup.members.map(m => (
                        <div key={m.id} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50">
                          <div className="flex items-center gap-2">
                            <img src={m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                            <span className="font-semibold text-slate-800">{m.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Algorithmic Minimum Cash Transfers Settlement Box */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
                      Minimum Cash Transfers Algorithm
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300">
                    Optimized debt settlement graph to clear all balances with fewest direct payments:
                  </p>

                  <div className="space-y-2 text-xs">
                    {settlements.length === 0 ? (
                      <div className="p-3 bg-white/10 rounded-xl text-center text-emerald-300 font-semibold">
                        ✓ All group balances are fully settled!
                      </div>
                    ) : (
                      settlements.map((s, idx) => {
                        return (
                          <div key={idx} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{s.fromMemberName}</span>
                              <span className="text-sky-300 font-black">{formatINR(s.amount)}</span>
                            </div>
                            <div className="text-[11px] text-slate-300 flex items-center justify-between">
                              <span>owes ➔ {s.toMemberName}</span>
                              <button
                                onClick={() => handleSettleDebt(s.fromMemberId, s.toMemberId, s.amount)}
                                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-[10px] font-extrabold shadow-sm transition-all"
                              >
                                Settle Now
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Right 2 Columns: Logged Expenses List */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Logged Trip Expenses ({currentGroup.expenses.length})</h3>
                </div>

                {currentGroup.expenses.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">No expenses logged for this group yet.</div>
                ) : (
                  <div className="space-y-3">
                    {currentGroup.expenses.map(exp => {
                      return (
                        <div
                          key={exp.id}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{exp.title}</span>
                              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-semibold rounded-md">
                                {exp.category}
                              </span>
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              Paid by <span className="font-bold text-slate-700">{exp.paidByName}</span> • {exp.date}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-base font-black text-slate-900">{formatINR(exp.amount)}</span>
                            <span className="text-[10px] text-slate-400 block">
                              {formatINR(exp.amount / (currentGroup.members.length || 1))} / person
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Group Trip Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Create a group trip above to begin splitting hotel, transport, and dinner bills.</p>
            </div>
          )}
        </div>
      )}

      {/* CREATE GROUP TRIP MODAL */}
      {createTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create Group Trip</h3>
            <form onSubmit={handleCreateGroupTrip} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Group Trip Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiss Alps Ski Tour 2026"
                  value={newTripTitle}
                  onChange={e => setNewTripTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interlaken, Switzerland"
                  value={newTripDestination}
                  onChange={e => setNewTripDestination(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Members (comma separated names)</label>
                <input
                  type="text"
                  value={newTripMembers}
                  onChange={e => setNewTripMembers(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateTripModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-md"
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG GROUP EXPENSE MODAL */}
      {addExpenseModalOpen && currentGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Log Shared Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Bill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seafood Dinner at Jimbaran Beach"
                  value={expenseTitle}
                  onChange={e => setExpenseTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={e => setExpenseCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="Food">🍽️ Food & Dining</option>
                    <option value="Stay">🏨 Stay & Hotel</option>
                    <option value="Transport">🚗 Transport / Rides</option>
                    <option value="Activities">🎟️ Activities & POIs</option>
                    <option value="Shopping">🛍️ Shopping</option>
                    <option value="Other">✨ Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Paid By</label>
                <select
                  value={expensePaidById}
                  onChange={e => setExpensePaidById(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  {currentGroup.members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
                Splitting equally between {currentGroup.members.length} members ({formatINR(expenseAmount / (currentGroup.members.length || 1))} each).
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddExpenseModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-md"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

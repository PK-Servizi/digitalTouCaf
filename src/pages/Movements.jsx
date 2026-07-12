import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ArrowRightLeft, TrendingUp, Search, Loader2, CreditCard, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import invoicesService from '../services/invoices.service';
import { unwrapApiList, unwrapApiValue } from '../utils/apiResponse';

export default function Movements() {
  const [invoices, setInvoices] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paying, setPaying] = useState(null);
  const perPage = 10;

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: perPage };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await invoicesService.getAll(params);
      setInvoices(unwrapApiList(res));
      setTotalCount(Number(unwrapApiValue(res?.total ?? res?.meta?.total ?? 0)) || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setCurrentPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handlePay = async (invoiceId) => {
    setPaying(invoiceId);
    try {
      const res = await invoicesService.pay(invoiceId);
      const checkoutUrl = res.data?.url || res.url || res.data?.checkoutUrl || res.checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError('No payment URL received');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(null);
    }
  };

  const totalPages = Math.ceil(totalCount / perPage);
  const totalAmount = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length;
  const paidCount = invoices.filter(inv => inv.status === 'paid').length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">INVOICES</h1>
        <div className="text-sm text-gray-400">
          <Link to="/dashboard" className="hover:text-[#E87425] transition-colors">Home</Link> <span className="mx-1">/</span> <span className="text-[#E87425] font-medium">Invoices</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2A5580] rounded-xl p-4 shadow-md col-span-2 sm:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <DollarSign size={24} className="text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">€{totalAmount.toFixed(2)}</p>
              <p className="text-xs text-blue-200">Total Amount</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center"><Clock size={20} className="text-yellow-500" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              <p className="text-xs text-gray-400">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><CheckCircle size={20} className="text-green-500" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{paidCount}</p>
              <p className="text-xs text-gray-400">Paid</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => { setSearchInput(''); setSearch(''); setStatusFilter(''); setCurrentPage(1); }}
            className="px-4 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all duration-200 shadow-sm">
            Clear Filters
          </button>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] shadow-sm">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search invoices..." className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-full sm:w-72 text-sm focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 shadow-sm bg-white" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4 animate-fade-in">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="table-responsive">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="px-4 py-12 text-center"><Loader2 size={24} className="mx-auto animate-spin text-[#E87425]" /></td></tr>
              ) : invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 font-mono text-xs">{inv.id.slice(0, 8)}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-800">{inv.description || inv.notes || '—'}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{new Date(inv.createdAt).toLocaleDateString('it-IT')}</td>
                  <td className="px-3 sm:px-4 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-green-50 text-green-700 ring-1 ring-green-200">
                      €{Number(inv.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${
                      inv.status === 'paid' ? 'bg-green-50 text-green-700 ring-green-200' : 'bg-yellow-50 text-yellow-700 ring-yellow-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${inv.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse-dot'}`} />
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3.5">
                    {inv.status === 'pending' && (
                      <button
                        onClick={() => handlePay(inv.id)}
                        disabled={paying === inv.id}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-xs font-medium transition-all duration-200 shadow-sm disabled:opacity-50"
                      >
                        {paying === inv.id ? <Loader2 size={12} className="animate-spin" /> : <CreditCard size={12} />}
                        Pay Now
                      </button>
                    )}
                    {inv.status === 'paid' && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle size={12} />Paid</span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && invoices.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-400">
                    <ArrowRightLeft size={40} className="mx-auto mb-3 text-gray-200" />
                    <p>No invoices found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, totalCount)} of {totalCount}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={16} /></button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200 ${p === currentPage ? 'bg-[#E87425] text-white shadow-sm' : 'hover:bg-gray-200 text-gray-600'}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

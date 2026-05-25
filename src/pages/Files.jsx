import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Eye, Plus, ArrowUpDown, FolderOpen, CheckCircle, Clock, Loader2, AlertCircle, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import serviceRequestsService from '../services/service-requests.service';

export default function Files() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: perPage };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await serviceRequestsService.getAll(params);
      setRequests(res.data || res.items || []);
      setTotalCount(res.total || res.meta?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load service requests');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setCurrentPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const totalPages = Math.ceil(totalCount / perPage);

  const statusBadge = (status) => {
    const map = {
      pending: { cls: 'bg-yellow-50 text-yellow-700 ring-yellow-200', icon: Clock, dot: 'bg-yellow-500' },
      in_progress: { cls: 'bg-blue-50 text-blue-700 ring-blue-200', icon: Clock, dot: 'bg-blue-500' },
      completed: { cls: 'bg-green-50 text-green-700 ring-green-200', icon: CheckCircle, dot: 'bg-green-500' },
      rejected: { cls: 'bg-red-50 text-red-700 ring-red-200', icon: XCircle, dot: 'bg-red-500' },
      approved: { cls: 'bg-green-50 text-green-700 ring-green-200', icon: CheckCircle, dot: 'bg-green-500' },
    };
    const s = map[status] || map.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${s.cls}`}>
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse-dot ${s.dot}`} />
        {status?.replace('_', ' ')}
      </span>
    );
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const completed = requests.filter(r => r.status === 'completed').length;
  const pending = requests.filter(r => r.status === 'pending' || r.status === 'in_progress').length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">SERVICE REQUESTS</h1>
        <div className="text-sm text-gray-400">
          <Link to="/dashboard" className="hover:text-[#E87425] transition-colors">Home</Link> <span className="mx-1">/</span> <span className="text-[#E87425] font-medium">Requests</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><FolderOpen size={20} className="text-[#E87425]" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
              <p className="text-xs text-gray-400">Total Requests</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><CheckCircle size={20} className="text-green-500" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{completed}</p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center"><Clock size={20} className="text-yellow-500" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pending}</p>
              <p className="text-xs text-gray-400">In Progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={clearFilters} className="px-4 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all duration-200 shadow-sm">
            Clear Filters
          </button>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] shadow-sm">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by customer or service" className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 shadow-sm bg-white" />
          </div>
          <button onClick={() => navigate('/files/new')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
            <Plus size={18} />New Request
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="table-responsive">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="px-4 py-12 text-center"><Loader2 size={24} className="mx-auto animate-spin text-[#E87425]" /></td></tr>
              ) : requests.map((r) => (
                <tr key={r.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 font-mono text-xs">{r.id.slice(0, 8)}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-800 font-semibold">{r.formData?.customerName || '—'}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600">{r.service?.name || r.service?.serviceName || '—'}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString('it-IT')}</td>
                  <td className="px-3 sm:px-4 py-3.5">{statusBadge(r.status)}</td>
                  <td className="px-3 sm:px-4 py-3.5">
                    <button onClick={() => navigate(`/files/${r.id}`)}
                      className="p-2 text-gray-400 hover:text-[#E87425] hover:bg-blue-50 rounded-lg transition-all duration-200" title="View Details">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && requests.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-400">
                    <FolderOpen size={40} className="mx-auto mb-3 text-gray-200" />
                    <p>No service requests found.</p>
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

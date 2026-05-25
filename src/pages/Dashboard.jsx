import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FolderOpen, FileText, DollarSign, ArrowRight, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import dashboardService from '../services/dashboard.service';
import serviceRequestsService from '../services/service-requests.service';
import invoicesService from '../services/invoices.service';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, requestsRes, invoicesRes] = await Promise.all([
          dashboardService.getStats(),
          serviceRequestsService.getAll({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'DESC' }),
          invoicesService.getAll({ status: 'pending', page: 1, limit: 5 }),
        ]);
        setStats(statsRes);
        setRecentRequests(requestsRes.data || requestsRes.items || []);
        setPendingInvoices(invoicesRes.data || invoicesRes.items || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusColor = (status) => {
    const map = {
      pending: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
      in_progress: 'bg-blue-50 text-blue-700 ring-blue-200',
      completed: 'bg-green-50 text-green-700 ring-green-200',
      rejected: 'bg-red-50 text-red-700 ring-red-200',
    };
    return map[status] || 'bg-gray-50 text-gray-700 ring-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[#E87425]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <AlertCircle size={48} className="mx-auto mb-4 text-red-300" />
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Customers', value: stats?.totalCustomers ?? 0, icon: Users, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Requests', value: stats?.activeRequests ?? 0, icon: FolderOpen, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50' },
    { label: 'Pending Invoices', value: stats?.pendingInvoices ?? 0, icon: FileText, color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Total Paid', value: `€${stats?.totalPaid ?? 0}`, icon: DollarSign, color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-400">
          <span className="text-[#E87425] font-medium">Home</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={22} className={`bg-gradient-to-r ${color} bg-clip-text`} style={{ color: color.includes('blue') ? '#3b82f6' : color.includes('orange') ? '#f97316' : color.includes('yellow') ? '#eab308' : '#22c55e' }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Service Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <FolderOpen size={18} className="text-[#E87425]" />
              Recent Requests
            </h2>
            <Link to="/files" className="text-xs text-[#E87425] hover:text-[#D0621F] font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <FolderOpen size={32} className="mx-auto mb-2 text-gray-200" />
                <p className="text-sm">No service requests yet</p>
              </div>
            ) : (
              recentRequests.map((req) => (
                <Link key={req.id} to={`/files/${req.id}`} className="flex items-center justify-between p-4 hover:bg-blue-50/40 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {req.service?.name || req.service?.serviceName || 'Service Request'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {req.formData?.customerName || 'Customer'} • {new Date(req.createdAt).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${statusColor(req.status)}`}>
                    {req.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {req.status?.replace('_', ' ')}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-[#E87425]" />
              Pending Invoices
            </h2>
            <Link to="/movements" className="text-xs text-[#E87425] hover:text-[#D0621F] font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingInvoices.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <FileText size={32} className="mx-auto mb-2 text-gray-200" />
                <p className="text-sm">No pending invoices</p>
              </div>
            ) : (
              pendingInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-blue-50/40 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{inv.invoiceNumber || `Invoice #${inv.id.slice(0, 8)}`}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(inv.createdAt).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#E87425]">
                    €{(inv.totalAmount / 100).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

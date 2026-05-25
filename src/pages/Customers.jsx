import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Eye, Pencil, Plus, ArrowUpDown, X, User, Phone, CreditCard, ChevronLeft, ChevronRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import customersService from '../services/customers.service';

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [viewCustomer, setViewCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const perPage = 8;

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: perPage };
      if (search) params.search = search;
      if (sortField) {
        params.sortBy = sortField;
        params.sortOrder = sortDir.toUpperCase();
      }
      const res = await customersService.getAll(params);
      setCustomers(res.data || res.items || []);
      setTotalCount(res.total || res.meta?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, sortField, sortDir]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  // Debounce search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const totalPages = Math.ceil(totalCount / perPage);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const openView = async (c) => {
    try {
      const res = await customersService.getById(c.id);
      setViewCustomer(res.data || res);
    } catch {
      setViewCustomer(c);
    }
  };

  const openEdit = (c) => { setEditForm({ ...c }); setEditCustomer(c); };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await customersService.update(editCustomer.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        fiscalCode: editForm.fiscalCode,
        mobile: editForm.mobile,
        email: editForm.email,
        phone: editForm.phone,
      });
      setEditCustomer(null);
      setToast('Customer updated successfully!');
      setTimeout(() => setToast(''), 2500);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update customer');
    } finally {
      setSaving(false);
    }
  };

  const SortHeader = ({ field, children }) => (
    <th
      className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#1E3A5F] select-none group"
      onClick={() => toggleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown size={13} className={`transition-colors ${sortField === field ? 'text-[#E87425]' : 'text-gray-300 group-hover:text-gray-400'}`} />
      </div>
    </th>
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">CUSTOMER'S INFORMATION</h1>
        <div className="text-sm text-gray-400">
          <Link to="/customers" className="hover:text-[#E87425] transition-colors">Home</Link> <span className="mx-1">/</span> <span className="text-[#E87425] font-medium">Customers</span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in z-50">
          <CheckCircle size={20} />{toast}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <User size={20} className="text-[#E87425]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
              <p className="text-xs text-gray-400">Total Customers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <User size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{customers.filter(c => c.customerType === 'person').length}</p>
              <p className="text-xs text-gray-400">Persons</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <CreditCard size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
              <p className="text-xs text-gray-400">Filtered</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Phone size={20} className="text-[#E87425]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{customers.filter(c => c.mobile).length}</p>
              <p className="text-xs text-gray-400">With Mobile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <button
          onClick={() => { setSearchInput(''); setSearch(''); setSortField(null); setCurrentPage(1); }}
          className="px-4 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all duration-200 shadow-sm"
        >
          Clear Filters
        </button>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Tax ID, Name or Mobile No"
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 shadow-sm bg-white"
            />
          </div>
          <button
            onClick={() => navigate('/customers/new')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            New Customer
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="table-responsive">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
              <tr>
                <SortHeader field="id">ID</SortHeader>
                <SortHeader field="customerType">Type</SortHeader>
                <SortHeader field="fiscalCode">Tax ID</SortHeader>
                <SortHeader field="firstName">Name</SortHeader>
                <SortHeader field="mobile">Mobile No</SortHeader>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="px-4 py-12 text-center"><Loader2 size={24} className="mx-auto animate-spin text-[#E87425]" /></td></tr>
              ) : customers.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 font-medium">{c.id.slice(0, 8)}</td>
                  <td className="px-3 sm:px-4 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                      {c.customerType}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 font-mono text-xs">{c.fiscalCode || '—'}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-800 font-semibold">{c.firstName} {c.lastName}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600">{c.mobile || '—'}</td>
                  <td className="px-3 sm:px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openView(c)}
                        className="p-2 text-gray-400 hover:text-[#E87425] hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="View Customer"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEdit(c)}
                        className="p-2 text-gray-400 hover:text-[#D0621F] hover:bg-orange-50 rounded-lg transition-all duration-200"
                        title="Edit Customer"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-400">
                    <Search size={40} className="mx-auto mb-3 text-gray-200" />
                    <p>No customers found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200 ${p === currentPage ? 'bg-[#E87425] text-white shadow-sm' : 'hover:bg-gray-200 text-gray-600'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Customer Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setViewCustomer(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-[#1E3A5F] to-[#2A5580] rounded-t-2xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><User size={20} /> Customer Details</h2>
              <button onClick={() => setViewCustomer(null)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              {[
                ['Type', viewCustomer.customerType],
                ['Tax ID', viewCustomer.fiscalCode || '—'],
                ['First Name', viewCustomer.firstName],
                ['Last Name', viewCustomer.lastName],
                ['Email', viewCustomer.email || '—'],
                ['Phone', viewCustomer.phone || '—'],
                ['Mobile', viewCustomer.mobile || '—'],
                ['Birth Date', viewCustomer.birthDate ? new Date(viewCustomer.birthDate).toLocaleDateString('it-IT') : '—'],
                ['Birth Place', viewCustomer.birthPlace || '—'],
                ['Citizenship', viewCustomer.citizenship || '—'],
                ['Address', viewCustomer.address || '—'],
                ['City', viewCustomer.city || '—'],
                ['Province', viewCustomer.province || '—'],
                ['Postal Code', viewCustomer.postalCode || '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500 w-28 shrink-0 font-medium">{label}</span>
                  <span className="text-sm text-gray-800 font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewCustomer(null)} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setEditCustomer(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-[#E87425] to-[#F2943D] rounded-t-2xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Pencil size={18} /> Edit Customer</h2>
              <button onClick={() => setEditCustomer(null)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              {[
                ['firstName', 'First Name'],
                ['lastName', 'Last Name'],
                ['fiscalCode', 'Tax ID'],
                ['email', 'Email'],
                ['mobile', 'Mobile'],
                ['phone', 'Phone'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
                  <input
                    type="text"
                    value={editForm[field] || ''}
                    onChange={(e) => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                    className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setEditCustomer(null)} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleSaveEdit} disabled={saving} className="px-5 py-2 bg-[#E87425] text-white rounded-lg hover:bg-[#D0621F] text-sm font-medium transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

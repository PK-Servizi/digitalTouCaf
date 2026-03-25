import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Eye, Plus, ArrowUpDown, FolderOpen, CheckCircle, Clock } from 'lucide-react';
import { files } from '../data/mockData';

export default function Files() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('');
  const [shopFilter, setShopFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  const uniqueShops = [...new Set(files.map((f) => f.shop))];
  const uniqueServices = [...new Set(files.map((f) => f.service))];

  const filtered = files.filter((f) => {
    const q = search.toLowerCase();
    const matchesSearch =
      f.fileId.includes(q) ||
      f.taxId.toLowerCase().includes(q) ||
      f.customer.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || f.status === statusFilter;
    const matchesShop = !shopFilter || f.shop === shopFilter;
    const matchesService = !serviceFilter || f.service === serviceFilter;
    return matchesSearch && matchesStatus && matchesShop && matchesService;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const clearFilters = () => {
    setSearch('');
    setSortField(null);
    setStatusFilter('');
    setShopFilter('');
    setServiceFilter('');
  };

  const SortHeader = ({ field, children, filterable, filterValue, setFilterValue, options }) => (
    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
      <div className="flex items-center gap-1">
        <span className="cursor-pointer hover:text-[#1E3A5F] select-none" onClick={() => toggleSort(field)}>
          {children}
        </span>
        {filterable && (
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="ml-1 text-xs border border-gray-200 rounded-md px-1.5 py-0.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#E87425]"
          >
            <option value="">All</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
        <ArrowUpDown size={13} className={`cursor-pointer transition-colors ${sortField === field ? 'text-[#E87425]' : 'text-gray-300'}`} onClick={() => toggleSort(field)} />
      </div>
    </th>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">FILE INFORMATIONS</h1>
        <div className="text-sm text-gray-400">
          <Link to="/customers" className="hover:text-[#E87425] transition-colors">Home</Link> <span className="mx-1">/</span> <span className="text-[#E87425] font-medium">Files</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><FolderOpen size={20} className="text-[#E87425]" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{files.length}</p>
              <p className="text-xs text-gray-400">Total Files</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><CheckCircle size={20} className="text-green-500" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{files.filter(f => f.status === 'Completed').length}</p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center"><Clock size={20} className="text-yellow-500" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{files.filter(f => f.status === 'Pending').length}</p>
              <p className="text-xs text-gray-400">Pending</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all duration-200 shadow-sm"
        >
          Clear Filters
        </button>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by File ID, Tax ID or Name"
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 shadow-sm bg-white"
            />
          </div>
          <button
            onClick={() => alert('New file creation (Demo)')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            New File
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="table-responsive">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
              <tr>
                <SortHeader field="fileId">File ID</SortHeader>
                <SortHeader field="taxId">Tax ID</SortHeader>
                <SortHeader field="customer">Customer</SortHeader>
                <SortHeader field="shop" filterable filterValue={shopFilter} setFilterValue={setShopFilter} options={uniqueShops}>Shop</SortHeader>
                <SortHeader field="service" filterable filterValue={serviceFilter} setFilterValue={setServiceFilter} options={uniqueServices}>Service</SortHeader>
                <SortHeader field="created">Created</SortHeader>
                <SortHeader field="status" filterable filterValue={statusFilter} setFilterValue={setStatusFilter} options={['Completed', 'Pending']}>Status</SortHeader>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((f) => (
                <tr key={f.fileId} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 font-mono text-xs">{f.fileId}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 font-mono text-xs">{f.taxId}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-800 font-semibold">{f.customer}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 max-w-48 truncate">{f.shop}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600">{f.service}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{f.created}</td>
                  <td className="px-3 sm:px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      f.status === 'Completed'
                        ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                        : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse-dot ${f.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      {f.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3.5">
                    <button
                      onClick={() => navigate(`/files/${f.fileId}`)}
                      className="p-2 text-gray-400 hover:text-[#E87425] hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-gray-400">
                    <FolderOpen size={40} className="mx-auto mb-3 text-gray-200" />
                    <p>No files found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, DollarSign, ArrowRightLeft, TrendingUp } from 'lucide-react';
import { movements } from '../data/mockData';

export default function Movements() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [shopFilter, setShopFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  const uniqueShops = [...new Set(movements.map((m) => m.shop))];
  const uniqueServices = [...new Set(movements.map((m) => m.service))];

  const filtered = movements.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      m.fileId.includes(q) ||
      m.customerName.toLowerCase().includes(q);
    const matchesShop = !shopFilter || m.shop === shopFilter;
    const matchesService = !serviceFilter || m.service === serviceFilter;
    return matchesSearch && matchesShop && matchesService;
  });

  const payableAmount = filtered.reduce((sum, m) => sum + m.amount, 0);
  const maxAmount = Math.max(...movements.map(m => m.amount), 1);

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const clearFilters = () => {
    setSearch('');
    setSortField(null);
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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">MOVEMENT INFORMATIONS</h1>
        <div className="text-sm text-gray-400">
          <Link to="/customers" className="hover:text-[#E87425] transition-colors">Home</Link> <span className="mx-1">/</span> <span className="text-[#E87425] font-medium">Movement</span>
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
              <p className="text-3xl font-bold text-white">{payableAmount}</p>
              <p className="text-xs text-blue-200">Payable Amount</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center"><ArrowRightLeft size={20} className="text-indigo-500" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{filtered.length}</p>
              <p className="text-xs text-gray-400">Transactions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center"><TrendingUp size={20} className="text-teal-500" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{maxAmount}</p>
              <p className="text-xs text-gray-400">Max Amount</p>
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
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="table-responsive">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
              <tr>
                <SortHeader field="fileId">File ID</SortHeader>
                <SortHeader field="customerName">Customer Name</SortHeader>
                <SortHeader field="service" filterable filterValue={serviceFilter} setFilterValue={setServiceFilter} options={uniqueServices}>Service</SortHeader>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <SortHeader field="shop" filterable filterValue={shopFilter} setFilterValue={setShopFilter} options={uniqueShops}>Shop</SortHeader>
                <SortHeader field="amount">Amount</SortHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((m, i) => (
                <tr key={`${m.fileId}-${i}`} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 font-mono text-xs">{m.fileId}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-800 font-semibold">{m.customerName}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600">{m.service}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-500 italic">{m.description || '—'}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-sm text-gray-600 max-w-48 truncate">{m.shop}</td>
                  <td className="px-3 sm:px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${
                      m.amount > 0 ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {m.amount}
                    </span>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-400">
                    <ArrowRightLeft size={40} className="mx-auto mb-3 text-gray-200" />
                    <p>No movements found.</p>
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

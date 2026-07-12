import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, AlertCircle, Users, FileText, CheckCircle } from 'lucide-react';
import customersService from '../services/customers.service';
import serviceRequestsService from '../services/service-requests.service';
import { unwrapApiList } from '../utils/apiResponse';

export default function NewServiceRequest() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  const [customerId, setCustomerId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [custRes, svcRes] = await Promise.all([
          customersService.getAll({ limit: 200 }),
          serviceRequestsService.getAssignedServices(),
        ]);
        setCustomers(unwrapApiList(custRes));
        setServices(unwrapApiList(svcRes));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId || !serviceId) {
      setError('Please select both a customer and a service.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await serviceRequestsService.create({ customerId, serviceId, userNotes });
      setSuccess(true);
      setTimeout(() => navigate('/files'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[#E87425]" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <CheckCircle size={64} className="mx-auto mb-4 text-green-400" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Request Created!</h2>
        <p className="text-gray-500">Redirecting to your requests...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/files')} className="p-2.5 hover:bg-white rounded-xl transition-all duration-200 shadow-sm border border-gray-100 bg-white">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">NEW SERVICE REQUEST</h1>
        </div>
        <div className="text-sm text-gray-400">
          <Link to="/dashboard" className="hover:text-[#E87425] transition-colors">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/files" className="hover:text-[#E87425] transition-colors">Requests</Link>
          <span className="mx-1">/</span>
          <span className="text-[#E87425] font-medium">New</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#E87425] to-[#F2943D] p-5 text-white">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileText size={20} />
              Create Service Request
            </h2>
            <p className="text-sm mt-1 text-white/80">Select a customer and service to submit a new request</p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg animate-fade-in flex items-center gap-2">
                <AlertCircle size={16} />{error}
              </div>
            )}

            {/* Customer select */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Users size={16} className="text-[#E87425]" />
                Customer <span className="text-red-400">*</span>
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200"
              >
                <option value="">Select a customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} — {c.fiscalCode || c.email}
                  </option>
                ))}
              </select>
              {customers.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  No customers found. <Link to="/customers/new" className="text-[#E87425] hover:underline">Add one first</Link>.
                </p>
              )}
            </div>

            {/* Service select */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="text-[#E87425]" />
                Service <span className="text-red-400">*</span>
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200"
              >
                <option value="">Select a service...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.serviceName}
                  </option>
                ))}
              </select>
              {services.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">No assigned services found. Contact admin.</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Any additional notes for this request..."
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/files')}
                className="px-5 py-2.5 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

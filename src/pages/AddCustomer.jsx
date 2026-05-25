import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, UserPlus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import customersService from '../services/customers.service';

const customerTypes = ['person', 'company'];

export default function AddCustomer() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fiscalCode: '',
    customerType: 'person',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobile: '',
    birthDate: '',
    birthPlace: '',
    citizenship: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
    country: 'IT',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First Name is required';
    if (!form.lastName.trim()) e.lastName = 'Last Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiError('');
    try {
      const payload = { ...form };
      if (!payload.fiscalCode) delete payload.fiscalCode;
      if (!payload.email) delete payload.email;
      if (!payload.phone) delete payload.phone;
      if (!payload.mobile) delete payload.mobile;
      if (!payload.birthDate) delete payload.birthDate;
      if (!payload.birthPlace) delete payload.birthPlace;
      if (!payload.citizenship) delete payload.citizenship;
      if (!payload.address) delete payload.address;
      if (!payload.city) delete payload.city;
      if (!payload.postalCode) delete payload.postalCode;
      if (!payload.province) delete payload.province;
      await customersService.create(payload);
      setSaved(true);
      setTimeout(() => navigate('/customers'), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create customer');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, field, type = 'text', placeholder, required }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 items-start gap-2 sm:gap-4 py-3 border-b border-gray-50">
      <label className="text-sm font-medium text-gray-600 sm:pt-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="sm:col-span-2">
        <input
          type={type}
          value={form[field]}
          onChange={(e) => update(field, e.target.value)}
          placeholder={placeholder || label}
          className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50/50 ${
            errors[field]
              ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500'
              : 'border-gray-200 focus:ring-[#E87425]/30 focus:border-[#E87425]'
          }`}
        />
        {errors[field] && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors[field]}</p>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {/* Success toast */}
      {saved && (
        <div className="fixed top-20 right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in z-50">
          <CheckCircle size={20} />
          Customer saved successfully!
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/customers')}
            className="p-2.5 hover:bg-white rounded-xl transition-all duration-200 shadow-sm border border-gray-100 bg-white"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <UserPlus size={24} className="text-[#E87425]" />
              ADD NEW CUSTOMER
            </h1>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <Link to="/customers" className="hover:text-[#E87425] transition-colors">Home</Link> <span className="mx-1">/</span> <Link to="/customers" className="hover:text-[#E87425] transition-colors">Customers</Link> <span className="mx-1">/</span> <span className="text-[#E87425] font-medium">New</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-3xl">
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Customer Information</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg animate-fade-in mb-4 flex items-center gap-2">
              <AlertCircle size={16} />{apiError}
            </div>
          )}
          <Field label="Tax ID (Codice Fiscale)" field="fiscalCode" placeholder="XXXXXX00X00X000X" />

          <div className="grid grid-cols-1 sm:grid-cols-3 items-start gap-2 sm:gap-4 py-3 border-b border-gray-50">
            <label className="text-sm font-medium text-gray-600 sm:pt-2">Customer Type</label>
            <div className="sm:col-span-2">
              <select
                value={form.customerType}
                onChange={(e) => update('customerType', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 bg-gray-50/50"
              >
                {customerTypes.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <Field label="First Name" field="firstName" required />
          <Field label="Last Name" field="lastName" required />
          <Field label="Email" field="email" type="email" placeholder="email@example.com" />
          <Field label="Phone" field="phone" type="tel" placeholder="Phone" />
          <Field label="Mobile" field="mobile" type="tel" placeholder="Mobile" />
          <Field label="Date of Birth" field="birthDate" type="date" />
          <Field label="City Of Birth" field="birthPlace" placeholder="City Of Birth" />
          <Field label="Citizenship" field="citizenship" placeholder="Citizenship" />
          <Field label="Address" field="address" placeholder="Full address" />
          <Field label="City" field="city" placeholder="City" />
          <Field label="Postal Code" field="postalCode" placeholder="00000" />
          <Field label="Province" field="province" placeholder="RM" />

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

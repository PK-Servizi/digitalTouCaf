import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Mail, Phone, MapPin, Save, Camera, Shield, Bell, CheckCircle } from 'lucide-react';

export default function Profile({ user }) {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    bio: '',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: UserCircle },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div>
      {/* Success toast */}
      {saved && (
        <div className="fixed top-20 right-4 sm:right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in z-50">
          <CheckCircle size={20} />
          Profile updated successfully!
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Profile</h1>
        <div className="text-sm text-gray-400">
          <Link to="/customers" className="hover:text-[#E87425] transition-colors">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-[#E87425] font-medium">Profile</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Left: Avatar card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2A5580] flex items-center justify-center mx-auto shadow-lg ring-4 ring-orange-50">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  {form.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#E87425] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#D0621F] transition-colors ring-2 ring-white">
                <Camera size={14} />
              </button>
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-800">{form.name || 'User'}</h3>
            <p className="text-sm text-gray-400 truncate">{form.email}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 ring-1 ring-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === id
                      ? 'border-[#E87425] text-[#E87425] bg-orange-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
              <form onSubmit={handleSave} className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <UserCircle size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all bg-gray-50/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all bg-gray-50/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="Your phone number"
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all bg-gray-50/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">City</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => update('city', e.target.value)}
                        placeholder="Your city"
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all bg-gray-50/50"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Address</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => update('address', e.target.value)}
                      placeholder="Your full address"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all bg-gray-50/50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => update('bio', e.target.value)}
                      placeholder="A short bio about yourself"
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all bg-gray-50/50 resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-4 sm:p-6">
                <h3 className="text-base font-bold text-gray-800 mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all bg-gray-50/50"
                    />
                  </div>
                  <button
                    onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-sm font-medium transition-all shadow-md"
                  >
                    <Shield size={16} />
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-4 sm:p-6">
                <h3 className="text-base font-bold text-gray-800 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications', desc: 'Receive email updates about your account' },
                    { label: 'File status changes', desc: 'Get notified when file status updates' },
                    { label: 'New comments', desc: 'Receive alerts for new comments on your files' },
                    { label: 'Payment reminders', desc: 'Get reminded about pending payments' },
                  ].map(({ label, desc }) => (
                    <label key={label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded border-gray-300 text-[#E87425] focus:ring-[#E87425]" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{label}</p>
                        <p className="text-xs text-gray-400">{desc}</p>
                      </div>
                    </label>
                  ))}
                  <button
                    onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-sm font-medium transition-all shadow-md mt-2"
                  >
                    <Save size={16} />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

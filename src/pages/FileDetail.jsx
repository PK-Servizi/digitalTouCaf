import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Paperclip, Download, FileText, Calendar, Hash, Loader2, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import serviceRequestsService from '../services/service-requests.service';

export default function FileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [request, setRequest] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [reqRes, docsRes] = await Promise.all([
          serviceRequestsService.getById(id),
          serviceRequestsService.getDocuments(id),
        ]);
        setRequest(reqRes.data || reqRes);
        setDocuments(docsRes.data || docsRes || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load request details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    try {
      await serviceRequestsService.uploadDocuments(id, selectedFiles);
      const docsRes = await serviceRequestsService.getDocuments(id);
      setDocuments(docsRes.data || docsRes || []);
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadSuccess('Documents uploaded successfully!');
      setTimeout(() => setUploadSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: { cls: 'bg-yellow-50 text-yellow-700 ring-yellow-200', dot: 'bg-yellow-500' },
      in_progress: { cls: 'bg-blue-50 text-blue-700 ring-blue-200', dot: 'bg-blue-500' },
      completed: { cls: 'bg-green-50 text-green-700 ring-green-200', dot: 'bg-green-500' },
      rejected: { cls: 'bg-red-50 text-red-700 ring-red-200', dot: 'bg-red-500' },
      approved: { cls: 'bg-green-50 text-green-700 ring-green-200', dot: 'bg-green-500' },
    };
    const s = map[status] || map.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ring-1 ${s.cls}`}>
        <span className={`w-2 h-2 rounded-full animate-pulse-dot ${s.dot}`} />
        {status?.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[#E87425]" />
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <AlertCircle size={64} className="mx-auto mb-4 text-red-300" />
        <p className="text-gray-500 text-lg mb-4">{error}</p>
        <button onClick={() => navigate('/files')} className="px-5 py-2.5 bg-[#E87425] text-white rounded-lg hover:bg-[#D0621F] transition-colors font-medium">
          Back to Requests
        </button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <FileText size={64} className="mx-auto mb-4 text-gray-200" />
        <p className="text-gray-400 text-lg mb-4">Request not found.</p>
        <button onClick={() => navigate('/files')} className="px-5 py-2.5 bg-[#E87425] text-white rounded-lg hover:bg-[#D0621F] transition-colors font-medium">
          Back to Requests
        </button>
      </div>
    );
  }

  const serviceName = request.service?.name || request.service?.serviceName || 'Service Request';
  const customerName = request.formData?.customerName || 'Customer';

  return (
    <div>
      {/* Upload success toast */}
      {uploadSuccess && (
        <div className="fixed top-20 right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in z-50">
          <CheckCircle size={20} />{uploadSuccess}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/files')} className="p-2.5 hover:bg-white rounded-xl transition-all duration-200 shadow-sm border border-gray-100 bg-white">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Request #{request.id.slice(0, 8)}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{customerName} — {serviceName}</p>
          </div>
        </div>
        {statusBadge(request.status)}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { icon: Hash, label: 'Request ID', value: request.id.slice(0, 8), color: 'text-blue-500' },
          { icon: FileText, label: 'Service', value: serviceName, color: 'text-purple-500' },
          { icon: FileText, label: 'Customer', value: customerName, color: 'text-teal-500' },
          { icon: Calendar, label: 'Created', value: new Date(request.createdAt).toLocaleDateString('it-IT'), color: 'text-orange-500' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                <Icon size={18} className={color} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status History + Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Status Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-[#E87425]" />
              Status History
            </h2>
          </div>
          <div className="p-4">
            {request.statusHistory && request.statusHistory.length > 0 ? (
              <div className="space-y-3">
                {request.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      h.status === 'completed' || h.status === 'approved' ? 'bg-green-100' : h.status === 'rejected' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {h.status === 'completed' || h.status === 'approved' ? <CheckCircle size={14} className="text-green-600" /> :
                       h.status === 'rejected' ? <XCircle size={14} className="text-red-600" /> :
                       <Clock size={14} className="text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 capitalize">{h.status?.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-400">{new Date(h.createdAt || h.changedAt).toLocaleString('it-IT')}</p>
                      {h.notes && <p className="text-xs text-gray-500 mt-1">{h.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock size={32} className="mx-auto mb-2 text-gray-200" />
                <p className="text-sm text-gray-400">No status history available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Paperclip size={18} className="text-[#E87425]" />
              Documents
              <span className="ml-auto text-xs bg-orange-50 text-[#E87425] px-2 py-0.5 rounded-full font-semibold">{documents.length}</span>
            </h2>
          </div>
          <div className="p-4">
            {/* Upload */}
            <div className="mb-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-200/80">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                  className="flex-1 text-sm text-gray-600 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#E87425] file:text-white hover:file:bg-[#D0621F] file:cursor-pointer file:transition-colors file:shadow-sm"
                />
                <button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || uploading}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-sm font-medium transition-all duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>

            {/* Document list */}
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-orange-50/50 rounded-xl p-3.5 border border-blue-100/50 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">
                      {new Date(doc.createdAt || doc.uploadedAt).toLocaleString('it-IT')}
                      {doc.status && (
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${
                          doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                          doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{doc.status}</span>
                      )}
                    </p>
                    <p className="text-sm font-semibold text-[#E87425] truncate">{doc.originalName || doc.fileName || doc.name}</p>
                  </div>
                  {doc.url && (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-[#E87425] hover:bg-blue-100 rounded-lg transition-all duration-200 shrink-0" title="Download">
                      <Download size={16} />
                    </a>
                  )}
                </div>
              ))}
              {documents.length === 0 && (
                <div className="text-center py-8">
                  <Paperclip size={32} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">No documents yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin notes if any */}
      {request.adminNotes && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-base font-bold text-gray-800 mb-2">Admin Notes</h3>
          <p className="text-sm text-gray-600">{request.adminNotes}</p>
        </div>
      )}
    </div>
  );
}

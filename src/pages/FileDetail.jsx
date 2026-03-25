import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, MessageSquare, Paperclip, Send, Download, FileText, Calendar, Building2, Hash } from 'lucide-react';
import { files, fileComments, fileAttachments, uploadTypes } from '../data/mockData';

export default function FileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const file = files.find((f) => f.fileId === id);
  const fileInputRef = useRef(null);

  const [comments, setComments] = useState(fileComments);
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState(fileAttachments);
  const [uploadType, setUploadType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  if (!file) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <FileText size={64} className="mx-auto mb-4 text-gray-200" />
        <p className="text-gray-400 text-lg mb-4">File not found.</p>
        <button onClick={() => navigate('/files')} className="px-5 py-2.5 bg-[#E87425] text-white rounded-lg hover:bg-[#D0621F] transition-colors font-medium">
          Back to Files
        </button>
      </div>
    );
  }

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(),
        date: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'SHERAZ KHALID',
        status: 'Pending',
        text: newComment.trim(),
      },
      ...prev,
    ]);
    setNewComment('');
  };

  const handleUpload = () => {
    if (!uploadType || !selectedFile) return;
    setAttachments((prev) => [
      {
        id: Date.now(),
        name: selectedFile.name,
        uploadedOn: new Date().toISOString().replace('T', ' ').slice(0, 19),
        uploadedBy: 'SHERAZ KHALID',
        status: 'Pending',
      },
      ...prev,
    ]);
    setUploadType('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/files')} className="p-2.5 hover:bg-white rounded-xl transition-all duration-200 shadow-sm border border-gray-100 bg-white">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">File #{file.fileId}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{file.customer} — {file.service}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${
          file.status === 'Completed' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
        }`}>
          <span className={`w-2 h-2 rounded-full animate-pulse-dot ${file.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
          {file.status}
        </span>
      </div>

      {/* File info summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { icon: Hash, label: 'File ID', value: file.fileId, color: 'blue' },
          { icon: FileText, label: 'Tax ID', value: file.taxId, color: 'purple' },
          { icon: Building2, label: 'Shop', value: file.shop, color: 'teal' },
          { icon: Calendar, label: 'Created', value: file.created, color: 'orange' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg bg-${color}-50 flex items-center justify-center shrink-0`}>
                <Icon size={18} className={`text-${color}-500`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare size={18} className="text-[#E87425]" />
              Comments
              <span className="ml-auto text-xs bg-orange-50 text-[#E87425] px-2 py-0.5 rounded-full font-semibold">{comments.length}</span>
            </h2>
          </div>
          <div className="p-4">
            {/* New comment */}
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add comment here..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 resize-none bg-gray-50/50"
              />
              <button
                onClick={handlePostComment}
                disabled={!newComment.trim()}
                className="mt-2 flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-sm font-medium transition-all duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={14} />
                Post Comment
              </button>
            </div>

            {/* Comment list */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className="bg-orange-50/50 rounded-xl p-3.5 border border-blue-100/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">
                      {c.date} — <span className="text-[#1E3A5F]">{c.user}</span>
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare size={32} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">No comments yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Paperclip size={18} className="text-[#E87425]" />
              Attachments
              <span className="ml-auto text-xs bg-orange-50 text-[#E87425] px-2 py-0.5 rounded-full font-semibold">{attachments.length}</span>
            </h2>
          </div>
          <div className="p-4">
            {/* Upload form */}
            <div className="mb-4 space-y-3 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-200/80">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <label className="text-sm font-medium text-gray-600 w-24 shrink-0">Upload Type</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 bg-white"
                >
                  <option value="">Select type...</option>
                  {uploadTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <label className="text-sm font-medium text-gray-600 w-24 shrink-0">Upload File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                  className="flex-1 text-sm text-gray-600 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#E87425] file:text-white hover:file:bg-[#D0621F] file:cursor-pointer file:transition-colors file:shadow-sm"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={!uploadType || !selectedFile}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-lg hover:from-[#D0621F] hover:to-[#E87425] text-sm font-medium transition-all duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Upload size={14} />
                  Upload
                </button>
              </div>
            </div>

            {/* Attachment list */}
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {attachments.map((a) => (
                <div key={a.id} className="bg-orange-50/50 rounded-xl p-3.5 border border-blue-100/50 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">
                      {a.uploadedOn} | <span className="text-[#1E3A5F]">{a.uploadedBy}</span>
                    </p>
                    <p className="text-sm font-semibold text-[#E87425] truncate">{a.name}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-[#E87425] hover:bg-blue-100 rounded-lg transition-all duration-200 shrink-0" title="Download">
                    <Download size={16} />
                  </button>
                </div>
              ))}
              {attachments.length === 0 && (
                <div className="text-center py-8">
                  <Paperclip size={32} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">No attachments yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

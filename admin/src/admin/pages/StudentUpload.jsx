import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileSpreadsheet, CheckCircle2, XCircle,
  AlertCircle, Users, Send, X, Eye
} from 'lucide-react';
import * as XLSX from 'xlsx';
import api from '../../api/axiosClient';
import GlassCard from '../components/GlassCard';

const Toast = ({ message, type, onClose }) => {
  const colors = {
    success: 'border-green-500/40 bg-green-500/10 text-green-400',
    error: 'border-red-500/40 bg-red-500/10 text-red-400',
    info: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-xl ${colors[type]}`}
    >
      {type === 'success' && <CheckCircle2 size={18} />}
      {type === 'error' && <XCircle size={18} />}
      {type === 'info' && <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </motion.div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`glass-panel p-5 flex items-center gap-4 border ${color}`}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color.replace('border-', 'bg-').replace('/30', '/20')}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  </div>
);

const StudentUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const parseFilePreview = (selectedFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        setPreviewRows(rows.slice(0, 10));
      } catch {
        showToast('Could not preview file. Ensure it is a valid Excel or CSV.', 'error');
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const allowed = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel', 'text/csv'];
    const extAllowed = ['.xlsx', '.xls', '.csv'];
    const ext = '.' + selectedFile.name.split('.').pop().toLowerCase();

    if (!allowed.includes(selectedFile.type) && !extAllowed.includes(ext)) {
      showToast('Only .xlsx, .xls, or .csv files are supported.', 'error');
      return;
    }
    setFile(selectedFile);
    setUploadResult(null);
    setPreviewRows([]);
    parseFilePreview(selectedFile);
    showToast(`"${selectedFile.name}" loaded successfully.`, 'success');
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  const handleUpload = async () => {
    if (!file) { showToast('Please select a file first.', 'error'); return; }
    setIsUploading(true);
    setProgress(0);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => (p < 85 ? p + 5 : p));
    }, 200);

    try {
      const { data } = await api.post('/admin/upload-students', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearInterval(interval);
      setProgress(100);
      setUploadResult(data);
      showToast(`Upload complete! ${data.success_count} students added.`, 'success');
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      const msg = err.response?.data?.detail || 'Upload failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewRows([]);
    setUploadResult(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const previewColumns = previewRows.length > 0 ? Object.keys(previewRows[0]) : [];

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          Student Bulk Import
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Upload an Excel or CSV file to register students and send login credentials automatically.
        </p>
      </div>

      {/* Upload Card */}
      <GlassCard hoverEffect={false} className="p-0 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-accent flex items-center justify-center">
              <FileSpreadsheet size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Upload File</h2>
              <p className="text-xs text-gray-400">Supported: .xlsx, .xls, .csv</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !file && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer
              ${isDragging
                ? 'border-accent-start bg-accent-start/10 scale-[1.01]'
                : file
                  ? 'border-green-500/40 bg-green-500/5'
                  : 'border-white/10 hover:border-white/25 hover:bg-white/5'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />

            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <FileSpreadsheet size={28} className="text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {(file.size / 1024).toFixed(1)} KB · {previewRows.length} rows previewed
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    className="mt-1 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                  >
                    <X size={12} /> Remove file
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all
                    ${isDragging ? 'bg-accent-start/30 border border-accent-start/50' : 'bg-white/5 border border-white/10'}`}>
                    <Upload size={26} className={isDragging ? 'text-accent-end' : 'text-gray-400'} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {isDragging ? 'Drop it here!' : 'Drag & drop your file here'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">or <span className="text-accent-end underline">browse</span> to choose a file</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Required columns: <span className="text-gray-300">Name · Email · Enrollment · Route</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Uploading & sending credentials...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-accent rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full btn-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all"
          >
            {isUploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send size={17} />
                Upload &amp; Send Credentials
              </>
            )}
          </button>
        </div>
      </GlassCard>

      {/* File Preview Table */}
      <AnimatePresence>
        {previewRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <GlassCard hoverEffect={false} className="p-0 overflow-hidden">
              <div className="p-5 border-b border-white/5 flex items-center gap-3">
                <Eye size={18} className="text-accent-end" />
                <h2 className="font-semibold text-white">
                  File Preview <span className="text-gray-400 font-normal text-sm">(first {previewRows.length} rows)</span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {previewColumns.map((col) => (
                        <th key={col} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        {previewColumns.map((col) => (
                          <td key={col} className="px-5 py-3 text-gray-300">
                            {String(row[col] ?? '—')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Result */}
      <AnimatePresence>
        {uploadResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Users size={20} className="text-blue-400" />}
                label="Total Rows"
                value={uploadResult.total_rows}
                color="border-blue-500/30"
              />
              <StatCard
                icon={<CheckCircle2 size={20} className="text-green-400" />}
                label="Successfully Added"
                value={uploadResult.success_count}
                color="border-green-500/30"
              />
              <StatCard
                icon={<XCircle size={20} className="text-red-400" />}
                label="Failed Rows"
                value={uploadResult.failed_count}
                color="border-red-500/30"
              />
              <StatCard
                icon={<AlertCircle size={20} className="text-yellow-400" />}
                label="Duplicates Skipped"
                value={uploadResult.duplicate_count}
                color="border-yellow-500/30"
              />
            </div>

            {/* Failed Rows Detail */}
            {uploadResult.failed_rows?.length > 0 && (
              <GlassCard hoverEffect={false} className="p-0 overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center gap-3">
                  <XCircle size={18} className="text-red-400" />
                  <h2 className="font-semibold text-white">Failed Rows</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Row</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Email</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadResult.failed_rows.map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3 text-gray-400">{row.row}</td>
                          <td className="px-5 py-3 text-gray-300">{row.email || '—'}</td>
                          <td className="px-5 py-3 text-red-400">{row.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* Duplicate Emails */}
            {uploadResult.duplicate_emails?.length > 0 && (
              <GlassCard hoverEffect={false} className="p-0 overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center gap-3">
                  <AlertCircle size={18} className="text-yellow-400" />
                  <h2 className="font-semibold text-white">Duplicate Emails Skipped</h2>
                </div>
                <div className="p-5 flex flex-wrap gap-2">
                  {uploadResult.duplicate_emails.map((email, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">
                      {email}
                    </span>
                  ))}
                </div>
              </GlassCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentUpload;

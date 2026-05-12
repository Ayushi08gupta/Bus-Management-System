import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Search, GraduationCap, Mail, UserPlus, X } from 'lucide-react';
import api from '../../api/axiosClient';

const AddStudentModal = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({ name: '', email: '', enrollment: '', route: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/admin/add-student', form);
      onAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Add Student</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'enrollment', 'route'].map((field) => (
            <div key={field}>
              <label className="text-sm text-gray-400 capitalize mb-1 block">{field}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                required
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          ))}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-xl font-bold mt-2 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add & Send Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchStudents = () => {
    setLoading(true);
    api.get('/admin/students')
      .then(({ data }) => setStudents(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {showModal && <AddStudentModal onClose={() => setShowModal(false)} onAdded={fetchStudents} />}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Management</h1>
          <p className="text-gray-400 text-sm">View and manage student access</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm"
        >
          <UserPlus size={16} /> Add Student
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden border-white/10">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 w-64"
            />
          </div>
          <span className="text-sm text-gray-400">{filtered.length} students</span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No students found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/30 border-b border-white/5">
                  <th className="p-4 text-sm font-semibold text-gray-300">Student Info</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Contact</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Route</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Enrollment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-white">{student.name}</p>
                          <p className="text-xs text-gray-400">ID: {student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Mail size={14} className="text-gray-500" /> {student.email}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{student.route}</td>
                    <td className="p-4 text-sm text-gray-300">{student.enrollment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default Students;

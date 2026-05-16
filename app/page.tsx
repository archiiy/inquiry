'use client';
import { useState } from 'react';

const SERVICES = [
  { name: 'Web Development', icon: '🌐' },
  { name: 'Mobile App Development', icon: '📱' },
  { name: 'UI/UX Design', icon: '🎨' },
  { name: 'Automation', icon: '🤖' },
  { name: 'ML & Web3', icon: '🧠' },
  { name: 'LMS & ERP', icon: '📚' },
  { name: 'Digital Marketing', icon: '📣' },
  { name: 'Technical Consulting', icon: '💻' },
  { name: 'Software Development', icon: '⚙️' },
];

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export default function Home() {
  const [service, setService] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', projectDetails: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.name || !form.email || !service || !form.projectDetails || !timeSlot) {
      setError('Please fill all required fields, select a service and a time slot.');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      const res = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, service, timeSlot }),
      });
      const data = await res.json();
      if (data.success) {
        setReply(data.autoReply);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm border border-gray-100">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Inquiry submitted!</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{reply}</p>
        <p className="text-xs text-gray-400">A confirmation has been sent to {form.email}</p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name:'',email:'',phone:'',company:'',projectDetails:'' }); setService(''); setTimeSlot(''); }}
          className="mt-5 text-sm text-indigo-600 underline">
          Submit another inquiry
        </button>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">AVIXR Technologies</p>
          <h1 className="text-2xl font-semibold text-gray-900">Book a consultation</h1>
          <p className="text-sm text-gray-500 mt-1">Tell us about your project and we'll get back to you shortly.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Select a service *</p>
          <div className="grid grid-cols-3 gap-2">
            {SERVICES.map(s => (
              <button key={s.name} onClick={() => setService(s.name)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${service === s.name ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <span className="block text-lg mb-1">{s.icon}</span>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Your details</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Full name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Rahul Sharma"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email *</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="rahul@startup.com" type="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Company / Startup</label>
              <input value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                placeholder="Acme Pvt Ltd"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Project details *</label>
              <textarea value={form.projectDetails} onChange={e => setForm({...form, projectDetails: e.target.value})}
                placeholder="Describe what you want to build, key features, timeline, budget if any..."
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-400 resize-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Preferred time slot (IST) *</p>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map(t => (
              <button key={t} onClick={() => setTimeSlot(t)}
                className={`px-4 py-2 rounded-lg border text-sm transition-all ${timeSlot === t ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button onClick={handleSubmit} disabled={status === 'loading'}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl text-sm transition-colors">
          {status === 'loading' ? 'Sending your inquiry...' : 'Submit inquiry →'}
        </button>

        {status === 'error' && <p className="text-red-500 text-sm mt-3 text-center">Something went wrong. Please try again.</p>}

      </div>
    </main>
  );
}
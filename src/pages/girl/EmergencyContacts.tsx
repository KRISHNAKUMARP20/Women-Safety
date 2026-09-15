import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EmergencyContact } from '../../types';
import { Users, Plus, Phone, Trash2, Star, Check, ShieldCheck } from 'lucide-react';

export const EmergencyContacts: React.FC = () => {
  const { currentUser, updateContacts } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>(
    currentUser?.emergencyContacts || []
  );
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Parent');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newContact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      name: name.trim(),
      relation,
      phone: phone.trim(),
      email: email.trim() || undefined,
      isPrimary,
    };

    let updated = [...contacts];
    if (isPrimary) {
      updated = updated.map((c) => ({ ...c, isPrimary: false }));
    }
    updated.push(newContact);

    setContacts(updated);
    await updateContacts(updated);

    setName('');
    setPhone('');
    setEmail('');
    setIsPrimary(false);
    setIsAdding(false);
    showSuccessToast();
  };

  const handleDelete = async (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    await updateContacts(updated);
    showSuccessToast();
  };

  const handleSetPrimary = async (id: string) => {
    const updated = contacts.map((c) => ({
      ...c,
      isPrimary: c.id === id,
    }));
    setContacts(updated);
    await updateContacts(updated);
    showSuccessToast();
  };

  const showSuccessToast = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">EMERGENCY CONTACTS</h2>
          <p className="text-xs text-slate-500">
            Contacts receive automatic SMS, phone alerts, and live GPS map links the moment SOS is triggered.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="flex items-center space-x-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800 animate-fade-in">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Emergency guardian list updated successfully!</span>
        </div>
      )}

      {/* Add Contact Modal / Form */}
      {isAdding && (
        <form
          onSubmit={handleAddContact}
          className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
              New Emergency Guardian
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Relationship</label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sibling / Sister">Sibling / Sister</option>
                <option value="Spouse / Partner">Spouse / Partner</option>
                <option value="College Warden">College Warden</option>
                <option value="Friend">Friend</option>
                <option value="Campus Security">Campus Security</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mobile Phone *</label>
              <input
                type="tel"
                required
                placeholder="+91-98765-43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email (Optional)</label>
              <input
                type="email"
                placeholder="guardian@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-rose-100">
            <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="font-semibold">Set as Primary Emergency Guardian (Auto-dial first)</span>
            </label>
            <button
              type="submit"
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
            >
              Save Guardian
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`relative rounded-2xl border p-4 shadow-sm bg-white transition hover:shadow-md ${
              contact.isPrimary ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-200'
            }`}
          >
            {contact.isPrimary && (
              <span className="absolute top-3 right-3 flex items-center space-x-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span>PRIMARY</span>
              </span>
            )}

            <div className="flex items-center space-x-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">
                {contact.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{contact.name}</h4>
                <span className="text-[11px] font-semibold text-rose-600">{contact.relation}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-mono font-semibold text-slate-800">{contact.phone}</span>
              </div>
              {contact.email && (
                <div className="text-[11px] text-slate-500 truncate">
                  ✉️ {contact.email}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center space-x-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
              >
                <Phone className="h-3 w-3" />
                <span>Call Guardian</span>
              </a>

              <div className="flex items-center space-x-1">
                {!contact.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(contact.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                    title="Make Primary"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

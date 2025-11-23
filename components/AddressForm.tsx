import React, { useState } from 'react';
import { Address } from '../types';
import { parseAddressWithGemini } from '../services/geminiService';
import { Sparkles, Loader2, MapPin, User, Phone } from 'lucide-react';

interface AddressFormProps {
  title: string;
  address: Address;
  onChange: (address: Address) => void;
  isSender?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ title, address, onChange, isSender }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [magicInput, setMagicInput] = useState('');
  const [showMagicInput, setShowMagicInput] = useState(false);

  const handleChange = (field: keyof Address, value: string) => {
    onChange({ ...address, [field]: value });
  };

  const handleMagicPaste = async () => {
    if (!magicInput.trim()) return;
    
    setIsParsing(true);
    const parsed = await parseAddressWithGemini(magicInput);
    setIsParsing(false);

    if (parsed) {
      onChange(parsed);
      setShowMagicInput(false);
      setMagicInput('');
    } else {
      alert("Could not parse address. Please try again or enter manually.");
    }
  };

  return (
    <div className={`p-6 rounded-xl border ${isSender ? 'bg-slate-50 border-slate-200' : 'bg-white border-brand-100 shadow-sm'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          {isSender ? <MapPin size={18} className="text-slate-400" /> : <MapPin size={18} className="text-brand-500" />}
          {title}
        </h3>
        <button
          onClick={() => setShowMagicInput(!showMagicInput)}
          className="text-sm flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium transition-colors"
        >
          <Sparkles size={14} />
          {showMagicInput ? 'Manual Entry' : 'AI Autofill'}
        </button>
      </div>

      {showMagicInput ? (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-slate-600">Paste full address here</label>
          <textarea
            value={magicInput}
            onChange={(e) => setMagicInput(e.target.value)}
            placeholder="e.g. John Doe, 123 Main St, Apt 4B, New York, NY, 555-0123"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent h-24 text-sm resize-none"
          />
          <button
            onClick={handleMagicPaste}
            disabled={isParsing || !magicInput.trim()}
            className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium text-sm flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isParsing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isParsing ? 'Parsing...' : 'Auto-Fill Address'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={address.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                placeholder="Name or Company"
              />
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Street Address</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => handleChange('street', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">State</label>
            <input
              type="text"
              value={address.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Phone Number</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={address.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                placeholder="(555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Country</label>
            <input
              type="text"
              value={address.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
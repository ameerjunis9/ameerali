import React, { useState, useEffect } from 'react';
import AddressForm from './components/AddressForm';
import LabelPreview from './components/LabelPreview';
import { Address, LabelData, PackageDetails, ServiceType } from './types';
import { generateTrackingNumber } from './services/geminiService';
import { Package, Printer, RotateCcw, Truck, AlertCircle } from 'lucide-react';

const INITIAL_SENDER: Address = {
  fullName: '',
  street: '',
  city: '',
  state: '',
  country: 'USA',
  phoneNumber: ''
};

const INITIAL_RECEIVER: Address = {
  fullName: '',
  street: '',
  city: '',
  state: '',
  country: 'USA',
  phoneNumber: ''
};

const INITIAL_PACKAGE: PackageDetails = {
  weight: 1.5,
  weightUnit: 'lbs',
  dimensions: '12x8x4',
  serviceType: ServiceType.STANDARD,
  trackingNumber: '',
  shipDate: new Date().toISOString().split('T')[0]
};

const App: React.FC = () => {
  const [sender, setSender] = useState<Address>(INITIAL_SENDER);
  const [receiver, setReceiver] = useState<Address>(INITIAL_RECEIVER);
  const [pkg, setPkg] = useState<PackageDetails>(INITIAL_PACKAGE);
  
  useEffect(() => {
    // Generate a tracking number on mount
    setPkg(p => ({ ...p, trackingNumber: generateTrackingNumber() }));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form?")) {
      setSender(INITIAL_SENDER);
      setReceiver(INITIAL_RECEIVER);
      setPkg({ ...INITIAL_PACKAGE, trackingNumber: generateTrackingNumber() });
    }
  };

  const labelData: LabelData = {
    sender,
    receiver,
    package: pkg
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Left Sidebar - Controls */}
      <div className="w-full md:w-[450px] bg-white border-r border-slate-200 h-auto md:h-screen overflow-y-auto print:hidden">
        <div className="p-6 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 text-brand-600 mb-1">
            <Truck className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">ShipShape AI</h1>
          </div>
          <p className="text-xs text-slate-500">Intelligent Shipping Label Generator</p>
          
          {!process.env.API_KEY && (
             <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md text-xs flex items-start gap-2">
               <AlertCircle size={16} className="mt-0.5 shrink-0"/>
               <p>Gemini API Key missing. Auto-fill features will not work.</p>
             </div>
          )}
        </div>

        <div className="p-6 space-y-8">
          {/* Sender Section */}
          <section>
            <AddressForm 
              title="Sender Details" 
              address={sender} 
              onChange={setSender} 
              isSender={true}
            />
          </section>

          {/* Receiver Section */}
          <section>
            <AddressForm 
              title="Receiver Details" 
              address={receiver} 
              onChange={setReceiver} 
              isSender={false}
            />
          </section>

          {/* Package Details */}
          <section className="p-6 rounded-xl border bg-slate-50 border-slate-200">
             <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Package size={18} className="text-slate-400" />
                Package Details
             </h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Weight</label>
                  <div className="flex">
                    <input 
                      type="number" 
                      value={pkg.weight}
                      onChange={(e) => setPkg({...pkg, weight: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-r-0 border-slate-300 rounded-l-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                    <select 
                      value={pkg.weightUnit}
                      onChange={(e) => setPkg({...pkg, weightUnit: e.target.value as 'lbs'|'kg'})}
                      className="px-2 py-2 border border-l-0 border-slate-300 rounded-r-lg bg-slate-100 text-xs font-medium"
                    >
                      <option value="lbs">lbs</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Service</label>
                  <select 
                    value={pkg.serviceType}
                    onChange={(e) => setPkg({...pkg, serviceType: e.target.value as ServiceType})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    {Object.values(ServiceType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Dimensions (LxWxH)</label>
                  <input 
                    type="text" 
                    value={pkg.dimensions}
                    onChange={(e) => setPkg({...pkg, dimensions: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
             </div>
          </section>

          <div className="pt-4 flex gap-3">
            <button 
              onClick={handlePrint}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-semibold shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Printer size={18} />
              Print Label
            </button>
            <button 
              onClick={handleReset}
              className="px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Reset Form"
            >
              <RotateCcw size={18} />
            </button>
          </div>
          
          <div className="text-center pb-6">
            <p className="text-xs text-slate-400">
              Generating tracking #{pkg.trackingNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Right Area - Preview */}
      <div className="flex-1 bg-slate-100 p-4 md:p-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="max-w-md w-full perspective-1000">
          <div className="mb-4 flex justify-between items-center print:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Preview</span>
            <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-full">4" x 6" Standard</span>
          </div>
          
          {/* The actual label component */}
          <div className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <LabelPreview data={labelData} />
          </div>

          <div className="mt-8 text-center print:hidden">
             <p className="text-sm text-slate-500 max-w-xs mx-auto">
               Use the <strong>AI Autofill</strong> button in the address forms to instantly parse messy address text using Gemini.
             </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import AddressForm from './components/AddressForm';
import LabelPreview from './components/LabelPreview';
import { Address, LabelData, PackageDetails, ServiceType } from './types';
import { generateTrackingNumber } from './services/geminiService';
import { Package, Printer, RotateCcw, Truck, AlertCircle, Box, Info } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Simple Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
             <div className="bg-brand-600 text-white p-1.5 rounded-lg shadow-sm">
               <Truck size={20} className="fill-current" />
             </div>
             <span className="text-xl font-bold tracking-tight text-slate-900">ShipShape AI</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full print:p-0">
        
        {/* API Key Warning */}
        {!process.env.API_KEY && (
             <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-start gap-3 shadow-sm print:hidden">
               <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600"/>
               <div>
                 <h4 className="font-semibold text-sm">Gemini API Key Missing</h4>
                 <p className="text-xs mt-1 text-amber-700">The AI auto-fill features will not function without an API key. Please configure your environment variables.</p>
               </div>
             </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
          
          {/* Left Column: Form Section */}
          <div className="lg:col-span-7 space-y-6 print:hidden">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-2">
               <h1 className="text-2xl font-bold text-slate-900 mb-2">Generate Shipping Label</h1>
               <p className="text-slate-500 text-sm">Fill in the details below to instantly generate a professional shipping label. Use the AI Magic Paste feature to parse unstructured addresses.</p>
            </div>

            <AddressForm 
              title="Sender Details" 
              address={sender} 
              onChange={setSender} 
              isSender={true}
            />

            <AddressForm 
              title="Receiver Details" 
              address={receiver} 
              onChange={setReceiver} 
              isSender={false}
            />

            {/* Package Details Card */}
            <div className="bg-white p-6 rounded-xl border border-brand-100 shadow-sm">
               <div className="flex items-center gap-2 mb-4 text-slate-800 border-b border-slate-100 pb-3">
                  <Package size={20} className="text-brand-500" />
                  <h3 className="text-lg font-semibold">Package Information</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="px-2 py-2 border border-l-0 border-slate-300 rounded-r-lg bg-slate-100 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="lbs">lbs</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Service Level</label>
                    <select 
                      value={pkg.serviceType}
                      onChange={(e) => setPkg({...pkg, serviceType: e.target.value as ServiceType})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
                    >
                      {Object.values(ServiceType).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Dimensions (L x W x H)</label>
                    <div className="relative">
                        <Box size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          value={pkg.dimensions}
                          onChange={(e) => setPkg({...pkg, dimensions: e.target.value})}
                          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                          placeholder="e.g. 12x8x4"
                        />
                    </div>
                  </div>
               </div>
            </div>

            {/* Actions */}
             <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={handlePrint}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-base"
                >
                  <Printer size={20} />
                  Generate & Print Label
                </button>
                <button 
                  onClick={handleReset}
                  className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm font-medium"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
              </div>
          </div>

          {/* Right Column: Preview Section */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 print:w-full">
             <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl text-white mb-6 print:hidden relative overflow-hidden">
               {/* Background Pattern */}
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Truck size={120} />
               </div>

               <div className="flex justify-between items-end mb-6 relative z-10">
                 <div>
                   <h3 className="font-bold text-xl text-white">Live Preview</h3>
                   <p className="text-slate-400 text-sm mt-1">4" x 6" Thermal Standard</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-brand-200">
                   {pkg.trackingNumber}
                 </div>
               </div>
               
               <div className="transform transition-transform duration-300 ease-out hover:scale-[1.02] origin-center shadow-xl">
                 <LabelPreview data={labelData} />
               </div>

               <div className="mt-8 flex justify-between items-center text-xs text-slate-400 font-medium border-t border-slate-800 pt-4">
                  <span className="flex items-center gap-1.5"><Box size={14} className="text-brand-500"/> {pkg.serviceType}</span>
                  <span className="flex items-center gap-1.5">{pkg.weight} {pkg.weightUnit}</span>
               </div>
             </div>
             
             {/* Info Tip */}
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4 text-blue-800 print:hidden">
                <Info size={24} className="shrink-0 text-blue-600" />
                <div>
                    <h5 className="font-semibold text-sm mb-1 text-blue-900">Did you know?</h5>
                    <p className="text-sm leading-relaxed text-blue-800/80">
                      You can paste an entire raw address block (e.g. from an email signature) into the "AI Autofill" field, and Gemini will automatically extract the details.
                    </p>
                </div>
             </div>
          </div>

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 text-slate-900">
             <span className="font-bold text-sm">ShipShape AI</span>
           </div>
           <p className="text-slate-400 text-xs">© {new Date().getFullYear()} ShipShape AI. Simple Label Maker.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
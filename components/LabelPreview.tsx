import React from 'react';
import { LabelData, ServiceType } from '../types';
import { Box, QrCode } from 'lucide-react';

interface LabelPreviewProps {
  data: LabelData;
}

const LabelPreview: React.FC<LabelPreviewProps> = ({ data }) => {
  // Helper to generate a fake CSS barcode
  const Barcode = () => (
    <div className="h-16 flex items-stretch justify-center gap-0.5 w-full overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="bg-black"
          style={{
            width: Math.random() > 0.5 ? '4px' : '1px',
            opacity: Math.random() > 0.1 ? 1 : 0 
          }}
        />
      ))}
    </div>
  );

  const getServiceLetter = (type: ServiceType) => {
    switch (type) {
      case ServiceType.PRIORITY: return 'P';
      case ServiceType.EXPRESS: return 'E';
      default: return 'G';
    }
  };

  return (
    <div id="printable-label" className="w-full aspect-[4/6] bg-white text-black shadow-xl rounded-lg overflow-hidden border border-slate-200 flex flex-col relative print:shadow-none print:border-none">
      
      {/* Header Section */}
      <div className="p-4 border-b-4 border-black flex justify-between items-start">
        <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
          <span className="text-black text-lg block mb-1 font-sans">SHIP FROM:</span>
          <div className="text-black font-mono text-sm leading-tight">
            {data.sender.fullName.toUpperCase()}<br />
            {data.sender.street.toUpperCase()}<br />
            {data.sender.city.toUpperCase()}, {data.sender.state.toUpperCase()}<br />
            {data.sender.country.toUpperCase()}<br />
            {data.sender.phoneNumber && <span className="block mt-1">TEL: {data.sender.phoneNumber}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end">
           <div className="w-16 h-16 border-2 border-black flex items-center justify-center mb-1">
             <QrCode size={48} />
           </div>
           <span className="text-[10px] font-bold">{data.package.weight} {data.package.weightUnit.toUpperCase()}</span>
        </div>
      </div>

      {/* Ship To Section */}
      <div className="p-4 flex-1 flex flex-col justify-center border-b-4 border-black relative">
        <span className="text-sm text-slate-500 uppercase font-bold absolute top-2 left-4">Ship To:</span>
        <div className="ml-8 mt-4">
          <div className="text-2xl font-bold font-sans tracking-tight">{data.receiver.fullName}</div>
          <div className="text-xl font-sans">{data.receiver.street}</div>
          <div className="text-2xl font-bold font-sans mt-1">
            {data.receiver.city.toUpperCase()}, {data.receiver.state.toUpperCase()}
          </div>
          <div className="text-lg font-sans">{data.receiver.country.toUpperCase()}</div>
          {data.receiver.phoneNumber && (
             <div className="text-sm font-mono mt-2 font-bold">TEL: {data.receiver.phoneNumber}</div>
          )}
        </div>
      </div>

      {/* Service Level Big Letter */}
      <div className="h-24 border-b-4 border-black flex">
        <div className="w-24 border-r-4 border-black flex items-center justify-center">
             <span className="text-7xl font-black font-sans">{getServiceLetter(data.package.serviceType)}</span>
        </div>
        <div className="flex-1 flex flex-col justify-center px-4">
             <span className="text-2xl font-bold uppercase">{data.package.serviceType}</span>
             <span className="text-sm font-mono">Tracking #: {data.package.trackingNumber}</span>
        </div>
      </div>

      {/* Barcode Section */}
      <div className="p-6 flex flex-col items-center justify-center bg-white">
        <div className="w-full max-w-[80%] mb-2">
             <Barcode />
        </div>
        <span className="font-mono text-sm tracking-[0.2em] font-bold">{data.package.trackingNumber}</span>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-black p-2 flex justify-between items-center text-[10px] font-bold uppercase text-slate-600">
        <span>BILL SENDER</span>
        <span>REF: {data.package.shipDate}</span>
        <span className="flex items-center gap-1"><Box size={10}/> {data.package.dimensions}</span>
      </div>

      {/* Decorative Cut Lines (Visual only, hidden in print) */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-slate-300 print:hidden"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-slate-300 print:hidden"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-slate-300 print:hidden"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-slate-300 print:hidden"></div>
    </div>
  );
};

export default LabelPreview;
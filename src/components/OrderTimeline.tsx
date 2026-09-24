import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, Home, AlertOctagon } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  createdAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
}

const steps = [
  { key: 'PLACED', label: 'Order Placed', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'PACKED', label: 'Packed', icon: PackageCheck },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Home },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, trackingNumber }) => {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center my-6">
        <AlertOctagon className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h4 className="text-lg font-bold text-rose-800">Order Cancelled</h4>
        <p className="text-sm text-rose-600 mt-1">This order has been cancelled and any reserved items have been restored to inventory.</p>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const activeStep = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="py-6 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm my-6">
      {trackingNumber && (
        <div className="flex flex-wrap justify-between items-center pb-6 border-b border-slate-100 mb-6 gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tracking Number</span>
            <p className="text-base font-bold text-slate-800 tracking-wide">{trackingNumber}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-brand-blue text-xs font-semibold rounded-full border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
            Live Updates Enabled
          </span>
        </div>
      )}

      {/* Desktop Stepper */}
      <div className="hidden md:flex justify-between items-center relative">
        {/* Background Connecting Line */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0"></div>
        {/* Progress Line */}
        <div
          className="absolute top-5 left-8 h-1 bg-emerald-500 -z-0 transition-all duration-500"
          style={{ width: `${(activeStep / (steps.length - 1)) * 90}%` }}
        ></div>

        {steps.map((step, idx) => {
          const isDone = idx <= activeStep;
          const isCurrent = idx === activeStep;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 ring-4 ring-white'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs mt-3 font-semibold text-center whitespace-nowrap ${
                  isCurrent ? 'text-brand-blue font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper Vertical */}
      <div className="flex md:hidden flex-col gap-6">
        {steps.map((step, idx) => {
          const isDone = idx <= activeStep;
          const isCurrent = idx === activeStep;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-center gap-4">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${isCurrent ? 'text-brand-blue font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { useNeraca } from '@/hooks/useNeraca';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function NeracaBadge() {
  const currentYear = new Date().getFullYear().toString();
  const { isSeimbang } = useNeraca(currentYear);

  if (isSeimbang) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200 shadow-sm">
        <CheckCircle2 className="w-4 h-4" />
        <span>Neraca Seimbang</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-full border border-red-200 shadow-sm animate-pulse">
        <AlertCircle className="w-4 h-4" />
        <span>Neraca Tidak Seimbang</span>
      </div>
    );
  }
}

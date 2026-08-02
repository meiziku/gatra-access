import React, { useState, useRef, useEffect } from "react";
import { X, Search, PlusCircle, Trash2, Users } from "lucide-react";
import { useAnggota } from "@/context/AnggotaContext";

interface GajiTPPModalProps {
  editBatch?: any;
  onSaveEdit?: (oldBatchId: string, newTxs: any[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function GajiTPPModal({ isOpen, onClose, editBatch, onSaveEdit }: GajiTPPModalProps) {
  const { members, pendidikanMembers, transactions, setTransactions, bungaPinjaman } = useAnggota();
  
  const [batchDateStr, setBatchDateStr] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  });
  
  const [batchRef, setBatchRef] = useState("");
  const [batchDesc, setBatchDesc] = useState("Potongan Gaji / TPP");

  const [rows, setRows] = useState<any[]>([]);
  const [searchIndex, setSearchIndex] = useState<number | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editBatch) {
        setBatchDateStr(editBatch.gajiBatchDate.split("/").reverse().join("-"));
        setBatchRef(editBatch.gajiBatchRef);
        setBatchDesc(editBatch.gajiBatchDesc);
        
        // Parse rows from batchTxs
        const parsedRows: any[] = [];
        
        const getOrCreateRow = (memberId: string, memberName: string, fieldToFill: string, contractId?: string) => {
          let row = parsedRows.find(r => {
            if (r.memberId !== memberId) return false;
            if (r[fieldToFill]) return false; // Already has this field filled
            // If it's a loan-related field, ensure contractId matches if already set
            if (fieldToFill === 'angsuran' || fieldToFill === 'jasa') {
              if (r.angsuranId && r.angsuranId !== contractId) return false;
              if (r.jasaId && r.jasaId !== contractId) return false;
            }
            // If it's education, ensure contractId matches if already set
            if (fieldToFill === 'pendidikan') {
              if (r.pendidikanId && r.pendidikanId !== contractId) return false;
            }
            return true;
          });

          if (!row) {
            row = { 
              id: Date.now() + Math.random(), 
              memberId, 
              name: memberName, 
              pokok: "", wajib: "", manasuka: "", 
              pendidikan: "", pendidikanId: "", 
              angsuran: "", angsuranId: "", 
              jasa: "", jasaId: "" 
            };
            parsedRows.push(row);
          }
          return row;
        };

        editBatch.batchTxs.forEach((t: any) => {
          if (t.description === 'Simpanan Pokok') {
            const row = getOrCreateRow(t.memberId, t.member, "pokok");
            row.pokok = t.debit.toString();
          }
          if (t.description === 'Simpanan Wajib') {
            const row = getOrCreateRow(t.memberId, t.member, "wajib");
            row.wajib = t.debit.toString();
          }
          if (t.description === 'Simpanan Manasuka') {
            const row = getOrCreateRow(t.memberId, t.member, "manasuka");
            row.manasuka = t.debit.toString();
          }
          
          if (t.description === 'Simpanan Pendidikan') {
            const pndId = t.id.split("-").slice(0, -1).join("-");
            const row = getOrCreateRow(t.memberId, t.member, "pendidikan", pndId);
            row.pendidikan = t.debit.toString();
            row.pendidikanId = pndId;
          }
          if (t.description === 'Angsuran Pinjaman') {
            let lnId = "";
            const lnIdParts = t.id.split("-");
            if (lnIdParts.length >= 3) {
              lnId = lnIdParts.slice(1, -1).join("-");
            }
            const row = getOrCreateRow(t.memberId, t.member, "angsuran", lnId);
            row.angsuran = t.debit.toString();
            row.angsuranId = lnId;
          }
          if (t.description === 'Jasa / Bunga') {
            let lnId = "";
            const lnIdParts = t.id.split("-");
            if (lnIdParts.length >= 3) {
              lnId = lnIdParts.slice(1, -1).join("-");
            }
            const row = getOrCreateRow(t.memberId, t.member, "jasa", lnId);
            row.jasa = t.debit.toString();
            row.jasaId = lnId;
          }
        });
        
        setRows(parsedRows);
      } else {
        setRows([{ id: 1, memberId: "", name: "", pokok: "", wajib: "", manasuka: "", pendidikan: "", angsuran: "", jasa: "", pendidikanId: "", angsuranId: "", jasaId: "" }]);
        
        // Auto generate batch ref ONLY if not editing
        const dateParts = batchDateStr.split("-");
        const ddmmyy = dateParts.length === 3 ? `${dateParts[2]}${dateParts[1]}${dateParts[0].slice(-2)}` : "";
        const gajiBatchesToday = transactions.filter((t: any) => t.isGajiBatch && t.date === `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`).length;
        setBatchRef(`TR-G-${ddmmyy}-${(gajiBatchesToday + 1).toString().padStart(2, "0")}`);
      }
    }
  }, [isOpen, batchDateStr, transactions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now(), memberId: "", name: "", pokok: "", wajib: "", manasuka: "", pendidikan: "", angsuran: "", jasa: "", pendidikanId: "", angsuranId: "", jasaId: "" }]);
  };

  const handleRemoveRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const handleChange = (id: number, field: string, value: string) => {
    setRows(rows.map(r => {
      if (r.id === id) {
        if (["pokok", "wajib", "manasuka", "pendidikan", "angsuran", "jasa"].includes(field)) {
          return { ...r, [field]: value.replace(/\D/g, "") };
        }
        
        let newRow = { ...r, [field]: value };
        
        if (field === "pendidikanId") {
          if (value) {
            const pdk = pendidikanMembers?.find((p: any) => p.ref === value);
            if (pdk) newRow.pendidikan = pdk.cicilan.toString();
          } else {
            newRow.pendidikan = "";
          }
        }
        
        if (field === "angsuranId") {
          if (value) {
            const loan = transactions.find((t: any) => t.id === value);
            if (loan) {
              const plafon = Math.max(loan.debit || 0, loan.kredit || 0);
              const installment = Math.round(plafon / (loan.tenor || 1));
              const interest = Math.round(plafon * ((bungaPinjaman || 1.5) / 100));
              newRow.angsuran = installment.toString();
              newRow.jasa = interest.toString();
              newRow.jasaId = value;
            }
          } else {
            newRow.angsuran = "";
            newRow.jasa = "";
            newRow.jasaId = "";
          }
        }
        
        return newRow;
      }
      return r;
    }));
  };

  const handleSelectMember = (id: number, member: any) => {
    setRows(rows.map(r => r.id === id ? { ...r, memberId: member.id, name: member.name } : r));
    setSearchIndex(null);
  };


  
  const calculateTotal = () => {
    let total = 0;
    rows.forEach(r => {
      total += (parseInt(r.pokok) || 0);
      total += (parseInt(r.wajib) || 0);
      total += (parseInt(r.manasuka) || 0);
      total += (parseInt(r.pendidikan) || 0);
      total += (parseInt(r.angsuran) || 0);
      total += (parseInt(r.jasa) || 0);
    });
    return total;
  };

  const handleSave = () => {
    let newTxs: any[] = [];
    const dateParts = batchDateStr.split("-");
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    const ddmmyy = formattedDate.replace(/\//g, "").slice(0, 4) + formattedDate.slice(-2);

    let hasError = false;
    
    // Check missing members
    rows.forEach(r => {
      if (!r.memberId && r.name.trim() !== "") {
        hasError = true;
      }
    });

    if (hasError) {
      alert("Pastikan semua nama anggota dipilih dari daftar pencarian.");
      return;
    }

    if (!batchRef || !batchDesc) {
      alert("No. Referensi dan Keterangan wajib diisi.");
      return;
    }

    const gajiBatchId = editBatch ? editBatch.gajiBatchId : `BATCH-${Date.now()}`;

    let pkCount = transactions.filter((t: any) => t.id.startsWith(`PKK-${ddmmyy}`)).length + 1;
    let wjbCount = transactions.filter((t: any) => t.id.startsWith(`WJB-${ddmmyy}`)).length + 1;
    let mnkCount = transactions.filter((t: any) => t.id.startsWith(`MNK-${ddmmyy}`)).length + 1;

    rows.forEach(r => {
      if (r.memberId) {
        const basicFields = [
          { key: 'pokok', desc: 'Simpanan Pokok' },
          { key: 'wajib', desc: 'Simpanan Wajib' },
          { key: 'manasuka', desc: 'Simpanan Manasuka' }
        ];

        basicFields.forEach(f => {
          const nominal = parseInt(r[f.key]) || 0;
          if (nominal > 0) {
            let refId = "";
            if (f.key === 'pokok') { refId = `PKK-${ddmmyy}-${pkCount.toString().padStart(2, '0')}`; pkCount++; }
            if (f.key === 'wajib') { refId = `WJB-${ddmmyy}-${wjbCount.toString().padStart(2, '0')}`; wjbCount++; }
            if (f.key === 'manasuka') { refId = `MNK-${ddmmyy}-${mnkCount.toString().padStart(2, '0')}`; mnkCount++; }

            newTxs.push({
              id: refId,
              date: formattedDate,
              memberId: r.memberId,
              member: r.name,
              description: f.desc,
              debit: nominal,
              kredit: 0,
              saldo: 0,
              isGajiBatch: true,
              gajiBatchId,
              gajiBatchRef: batchRef,
              gajiBatchDesc: batchDesc,
              gajiBatchDate: formattedDate
            });
          }
        });

        const pndNominal = parseInt(r.pendidikan) || 0;
        if (pndNominal > 0) {
          const pndId = r.pendidikanId || `PND-${r.memberId}`;
          const count = transactions.filter((t: any) => t.id.startsWith(`${pndId}-`)).length + 1;
          const refId = `${pndId}-${count.toString().padStart(2, '0')}`;
          newTxs.push({
            id: refId,
            date: formattedDate,
            memberId: r.memberId,
            member: r.name,
            description: 'Simpanan Pendidikan',
            debit: pndNominal,
            kredit: 0,
            saldo: 0,
            isGajiBatch: true,
            gajiBatchId,
            gajiBatchRef: batchRef,
            gajiBatchDesc: batchDesc,
            gajiBatchDate: formattedDate
          });
        }

        const angsuranNominal = parseInt(r.angsuran) || 0;
        const jasaNominal = parseInt(r.jasa) || 0;
        const lnId = r.angsuranId || `LN-${r.memberId}`;

        if (angsuranNominal > 0) {
          const count = transactions.filter((t: any) => t.id.startsWith(`AN-${lnId}-`)).length + 1;
          const refId = `AN-${lnId}-${count.toString().padStart(2, '0')}`;
          newTxs.push({
            id: refId,
            date: formattedDate,
            memberId: r.memberId,
            member: r.name,
            description: 'Angsuran Pinjaman',
            debit: angsuranNominal,
            kredit: 0,
            saldo: 0,
            isGajiBatch: true,
            gajiBatchId,
            gajiBatchRef: batchRef,
            gajiBatchDesc: batchDesc,
            gajiBatchDate: formattedDate
          });
        }

        if (jasaNominal > 0) {
          const count = transactions.filter((t: any) => t.id.startsWith(`JS-${lnId}-`)).length + 1;
          const refId = `JS-${lnId}-${count.toString().padStart(2, '0')}`;
          newTxs.push({
            id: refId,
            date: formattedDate,
            memberId: r.memberId,
            member: r.name,
            description: 'Jasa / Bunga',
            debit: jasaNominal,
            kredit: 0,
            saldo: 0,
            isGajiBatch: true,
            gajiBatchId,
            gajiBatchRef: batchRef,
            gajiBatchDesc: batchDesc,
            gajiBatchDate: formattedDate
          });
        }
      }
    });

    if (newTxs.length > 0) {
      if (editBatch && onSaveEdit) {
        onSaveEdit(editBatch.gajiBatchId, newTxs);
      } else {
        setTransactions([...transactions, ...newTxs]);
      }
      alert(`${newTxs.length} transaksi berhasil ${editBatch ? 'diperbarui' : 'disimpan'}!`);
      onClose();
    } else {
      alert("Tidak ada nominal yang dimasukkan.");
    }
  };

  const formatRp = (val: string) => {
    if (!val) return "";
    return new Intl.NumberFormat("id-ID").format(parseInt(val));
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'Enter') {
          if (searchIndex !== null) return;
          e.preventDefault(); // prevent unwanted behaviors
          handleSave();
        }
      }}
      tabIndex={-1} // allows the div to catch keyboard events even if not focused on inputs
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Potongan Gaji / TPP</h3>
              <p className="text-sm text-gray-500 mt-0.5">Input massal simpanan dan angsuran anggota</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-auto flex-1">
          {/* Header Input */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input 
                type="date" 
                value={batchDateStr}
                onChange={(e) => setBatchDateStr(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Referensi</label>
              <input 
                type="text" 
                value={batchRef}
                onChange={(e) => setBatchRef(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <input 
                type="text" 
                value={batchDesc}
                onChange={(e) => setBatchDesc(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Input (Rp)</label>
              <div className="w-full border border-transparent rounded-xl px-3 py-2 bg-gray-50 text-indigo-700 font-bold text-right text-lg">
                {new Intl.NumberFormat("id-ID").format(calculateTotal())}
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 min-w-[200px]">Nama Anggota</th>
                  <th className="px-4 py-3 w-[120px]">Pokok</th>
                  <th className="px-4 py-3 w-[120px]">Wajib</th>
                  <th className="px-4 py-3 w-[120px]">Manasuka</th>
                  <th className="px-4 py-3 w-[120px]">Pendidikan</th>
                  <th className="px-4 py-3 w-[120px]">Angsuran</th>
                  <th className="px-4 py-3 w-[120px]">Jasa</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, index) => {
                  const pndContracts = pendidikanMembers?.filter((p: any) => p.id === row.memberId);
                  const hasPendidikan = pndContracts && pndContracts.length > 0;
                  
                  const memberLoans = transactions.filter((t: any) => t.memberId === row.memberId && t.description === "Pinjaman (Pencairan)");
                  const lnContracts = memberLoans.filter((loan: any) => {
                    const angsuran = transactions.filter((t: any) => t.description === "Angsuran Pinjaman" && t.id.includes(loan.id));
                    const totalBayar = angsuran.reduce((sum, a) => sum + Math.max(a.debit, a.kredit), 0);
                    const plafon = Math.max(loan.debit, loan.kredit);
                    return plafon - totalBayar > 0;
                  });
                  const hasLoans = lnContracts && lnContracts.length > 0;
                  
                  return (
                    <tr key={row.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-center text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 relative">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => {
                          handleChange(row.id, "name", e.target.value);
                          setSearchIndex(row.id);
                          setHighlightedIndex(0);
                        }}
                        onFocus={() => { setSearchIndex(row.id); setHighlightedIndex(0); }}
                        onKeyDown={(e) => {
                          if (searchIndex !== row.id) return;
                          const filtered = members.filter((m: any) => m?.name?.toLowerCase().includes(row.name.toLowerCase()));
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setHighlightedIndex(prev => prev < filtered.length - 1 ? prev + 1 : prev);
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            if (filtered.length > 0) {
                              handleSelectMember(row.id, filtered[highlightedIndex]);
                            }
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Cari nama..."
                      />
                      {searchIndex === row.id && row.name.length > 0 && (
                        <div ref={searchRef} className="absolute z-10 left-4 top-full mt-1 w-full max-w-[250px] bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {members.filter((m: any) => m?.name?.toLowerCase().includes(row.name.toLowerCase())).map((m: any, idx: number) => (
                            <div
                              key={m.id}
                              onClick={() => handleSelectMember(row.id, m)}
                              className={`px-4 py-2 cursor-pointer text-gray-700 ${highlightedIndex === idx ? 'bg-indigo-50 border-l-2 border-indigo-500' : 'hover:bg-gray-50'}`}
                            >
                              <div className="font-medium">{m.name}</div>
                              <div className="text-xs text-gray-400">{m.id} - {m.pekerjaan || "Anggota"}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <input type="text" value={formatRp(row.pokok)} onChange={(e) => handleChange(row.id, "pokok", e.target.value)} className="w-full border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none text-right" />
                      {row.pokok && <div className="text-[10px] text-gray-400 mt-1 text-right">PKK-Auto</div>}
                    </td>
                    <td className="px-2 py-3">
                      <input type="text" value={formatRp(row.wajib)} onChange={(e) => handleChange(row.id, "wajib", e.target.value)} className="w-full border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none text-right" />
                      {row.wajib && <div className="text-[10px] text-gray-400 mt-1 text-right">WJB-Auto</div>}
                    </td>
                    <td className="px-2 py-3">
                      <input type="text" value={formatRp(row.manasuka)} onChange={(e) => handleChange(row.id, "manasuka", e.target.value)} className="w-full border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none text-right" />
                      {row.manasuka && <div className="text-[10px] text-gray-400 mt-1 text-right">MNK-Auto</div>}
                    </td>
                    <td className="px-2 py-3">
                      <input type="text" value={formatRp(row.pendidikan)} onChange={(e) => handleChange(row.id, "pendidikan", e.target.value)} disabled={!hasPendidikan && row.memberId !== ""} className={`w-full border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none text-right ${!hasPendidikan && row.memberId !== "" ? "bg-gray-100 cursor-not-allowed" : ""}`} />
                      <select value={row.pendidikanId || ""} onChange={(e) => handleChange(row.id, "pendidikanId", e.target.value)} disabled={!hasPendidikan && row.memberId !== ""} className={`w-full mt-1 text-[10px] border border-gray-200 rounded p-1 text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${!hasPendidikan && row.memberId !== "" ? "bg-gray-100 opacity-50 cursor-not-allowed" : ""}`}>
                        <option value="">Kontrak Default</option>
                        {pendidikanMembers?.filter((p: any) => p.id === row.memberId).map((p: any) => (
                          <option key={p.ref} value={p.ref}>{p.ref}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-3">
                      <input type="text" value={formatRp(row.angsuran)} onChange={(e) => handleChange(row.id, "angsuran", e.target.value)} disabled={!hasLoans && row.memberId !== ""} className={`w-full border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none text-right ${!hasLoans && row.memberId !== "" ? "bg-gray-100 cursor-not-allowed" : ""}`} />
                      <select value={row.angsuranId || ""} onChange={(e) => handleChange(row.id, "angsuranId", e.target.value)} disabled={!hasLoans && row.memberId !== ""} className={`w-full mt-1 text-[10px] border border-gray-200 rounded p-1 text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${!hasLoans && row.memberId !== "" ? "bg-gray-100 opacity-50 cursor-not-allowed" : ""}`}>
                        <option value="">Pinjaman Default</option>
                        {lnContracts.map((l: any) => (
                          <option key={l.id} value={l.id}>{l.id}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-3">
                      <input type="text" value={formatRp(row.jasa)} onChange={(e) => handleChange(row.id, "jasa", e.target.value)} disabled={!hasLoans && row.memberId !== ""} className={`w-full border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none text-right ${!hasLoans && row.memberId !== "" ? "bg-gray-100 cursor-not-allowed" : ""}`} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleRemoveRow(row.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <button onClick={handleAddRow} className="mt-4 flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors font-medium text-sm">
            <PlusCircle className="w-4 h-4" />
            Tambah Baris
          </button>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={handleSave} className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20">
            Simpan Transaksi
          </button>
        </div>
      </div>
    </div>
  );
}

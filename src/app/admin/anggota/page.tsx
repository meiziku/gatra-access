"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  UserPlus, 
  Key,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  ArrowUpDown,
  X,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { useRef } from "react";
import { useAnggota } from "@/context/AnggotaContext";
import { downloadAnggotaTemplate, exportAnggotaExcel } from "@/lib/export-excel";

export default function DataAnggotaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [importSuccess, setImportSuccess] = useState<{isOpen: boolean, msg: string}>({isOpen: false, msg: ""});
  
  const { members, setMembers } = useAnggota();

  const existingIds = members.map(m => m.id);
  
  const [newMemberId, setNewMemberId] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberDate, setNewMemberDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPekerjaan, setNewMemberPekerjaan] = useState("ASN");
  const [newMemberPhone, setNewMemberPhone] = useState("");
  const [newMemberAddress, setNewMemberAddress] = useState("");
  
  const [editingMember, setEditingMember] = useState<any>(null);
  const [resettingMember, setResettingMember] = useState<any>(null);
  const [deletingMember, setDeletingMember] = useState<any>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const isIdDuplicate = existingIds.includes(newMemberId);
  const isFormValid = newMemberName.trim() !== "" && newMemberId.trim() !== "" && !isIdDuplicate && newMemberDate.trim() !== "";

  const getNextId = () => {
    let maxId = 0;
    members.forEach(m => {
      if (m.id.startsWith("GT")) {
        const num = parseInt(m.id.substring(2), 10);
        if (!isNaN(num) && num > maxId) {
          maxId = num;
        }
      }
    });
    return "GT" + String(maxId + 1).padStart(3, '0');
  };

  const handleOpenAddModal = () => {
    setNewMemberId(getNextId());
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!isFormValid) return;
    
    const newMember = {
      id: newMemberId,
      name: newMemberName,
      email: newMemberEmail,
      date: newMemberDate,
      status: "Aktif",
      statusColor: "text-emerald-700 bg-emerald-50 border border-emerald-200",
      pekerjaan: newMemberPekerjaan,
      phone: newMemberPhone,
      address: newMemberAddress
    };
    
    setMembers([newMember, ...members]);
    setIsModalOpen(false);
    
    setNewMemberId(getNextId());
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberPhone("");
    setNewMemberAddress("");
  };

  const handleEditSave = () => {
    setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
    setEditingMember(null);
  };

  const handleDeleteConfirm = () => {
    setMembers(members.filter(m => m.id !== deletingMember.id));
    setDeletingMember(null);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const newImportedMembers: any[] = [];
      const skippedIds: string[] = [];
      const currentIds = new Set(members.map(m => m.id));
      
      data.forEach((row: any, i) => {
        let dateStr = new Date().toISOString().split('T')[0];
        if (row["Tanggal Bergabung"]) {
          const d = new Date(row["Tanggal Bergabung"]);
          d.setHours(12); // avoid timezone offset issues
          if (!isNaN(d.getTime())) {
            dateStr = d.toISOString().split('T')[0];
          } else if (typeof row["Tanggal Bergabung"] === 'string') {
            dateStr = row["Tanggal Bergabung"];
          }
        }

        const rowId = row["ID Anggota"];
        if (rowId && currentIds.has(rowId)) {
          skippedIds.push(rowId);
        } else {
          const id = rowId || `GT-IMP${Math.floor(Math.random() * 10000)}`;
          currentIds.add(id); // add to set so we don't import duplicates within the same excel file either
          newImportedMembers.push({
            id: id,
            name: row["Nama Lengkap"] || `Anggota Impor ${i}`,
            email: row["Email"] || "",
            date: dateStr,
            pekerjaan: row["Pekerjaan"] || "NON ASN",
            phone: row["No HP"] || "",
            address: row["Alamat"] || ""
          });
        }
      });
      
      if (skippedIds.length > 0) {
        setImportSuccess({isOpen: true, msg: `Import selesai. Terdapat ${skippedIds.length} anggota yang dilewati karena ID sudah terdaftar:\n${skippedIds.join(', ')}`});
      } else if (newImportedMembers.length > 0) {
        setImportSuccess({isOpen: true, msg: `Berhasil mengimpor ${newImportedMembers.length} anggota.`});
      }
      
      setMembers([...newImportedMembers, ...members]);
      setIsImportModalOpen(false);
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    exportAnggotaExcel(members);
    setIsExportModalOpen(false);
  };
  
  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedMembers = [...members].sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredMembers = sortedMembers.filter((m: any) => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Anggota</h2>
          <p className="text-gray-500 text-sm">Kelola informasi, status, dan riwayat anggota koperasi.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm"
          >
            <Upload className="w-4 h-4" />
            Import Excel
          </button>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 font-medium text-sm"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Anggota
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Cari nama atau ID..."
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th onClick={() => handleSort('id')} className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100/50 transition-colors group select-none">
                  <div className="flex items-center gap-2">
                    ID Anggota
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th onClick={() => handleSort('name')} className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100/50 transition-colors group select-none">
                  <div className="flex items-center gap-2">
                    Nama Anggota
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th onClick={() => handleSort('date')} className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100/50 transition-colors group select-none">
                  <div className="flex items-center gap-2">
                    Tanggal Bergabung
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th onClick={() => handleSort('pekerjaan')} className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100/50 transition-colors group select-none">
                  <div className="flex items-center gap-2">
                    Pekerjaan
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium text-left">
                  Kontak
                </th>
                <th className="px-6 py-4 font-medium text-left">
                  Alamat
                </th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedMembers.map((m: any, idx: number) => (
                <AnggotaRow 
                  key={idx} 
                  {...m} 
                  onEdit={() => setEditingMember(m)} 
                  onResetPassword={() => setResettingMember(m)}
                  onDelete={() => setDeletingMember(m)}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination & Items Per Page */}
        <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <span>Tampilkan</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-lg py-1 px-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>baris</span>
          </div>
          
          <div>Menampilkan {totalItems === 0 ? 0 : startIndex + 1} hingga {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} anggota</div>
          
          <div className="flex gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Seb
            </button>
            <div className="flex items-center gap-1 px-2">
              <span className="font-medium text-gray-700">Hal {currentPage} dari {totalPages}</span>
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
      {/* Modal Tambah Anggota */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Tambah Anggota Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Anggota <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${isIdDuplicate ? 'border-red-500 text-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  />
                  {isIdDuplicate && <p className="text-xs text-red-500 mt-1">ID Anggota sudah terdaftar!</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={newMemberPekerjaan}
                    onChange={(e) => setNewMemberPekerjaan(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white outline-none cursor-pointer"
                  >
                    <option value="ASN">ASN</option>
                    <option value="NON ASN">NON ASN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-colors" 
                    placeholder="Masukkan nama lengkap" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Bergabung <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    value={newMemberDate}
                    onChange={(e) => setNewMemberDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-colors cursor-pointer" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-colors" 
                  placeholder="Masukkan email aktif (Opsional)" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon / WhatsApp</label>
                <input 
                  type="text" 
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-colors" 
                  placeholder="08... (Opsional)" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea 
                  value={newMemberAddress}
                  onChange={(e) => setNewMemberAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-colors" 
                  rows={3} 
                  placeholder="Masukkan alamat domisili (Opsional)"
                ></textarea>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
              <button 
                onClick={handleSave} 
                disabled={!isFormValid}
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl shadow-md transition-colors ${!isFormValid ? 'bg-blue-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
              >
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import Excel */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsImportModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Import Data Excel
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                <span className="text-xs text-blue-800 font-medium">Format file belum sesuai?</span>
                <button
                  type="button"
                  onClick={downloadAnggotaTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Template
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unggah File (.xlsx, .xls)</label>
                <input type="file" ref={fileInputRef} accept=".xlsx,.xls" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-xl p-2 cursor-pointer bg-gray-50" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={handleImport} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20">Mulai Import</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Export Excel */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsExportModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                Export Data
              </h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-sm text-gray-600 leading-relaxed">
              Anda akan mengunduh seluruh data anggota ke dalam format Excel (.xlsx). Lanjutkan?
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsExportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={handleExport} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-md shadow-green-500/20">Download Excel</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Edit Anggota */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setEditingMember(null)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-600" />
                Edit Data Anggota
              </h3>
              <button onClick={() => setEditingMember(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Anggota</label>
                  <input type="text" value={editingMember.id} readOnly className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan</label>
                  <select 
                    value={editingMember.pekerjaan}
                    onChange={(e) => setEditingMember({...editingMember, pekerjaan: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white outline-none cursor-pointer"
                  >
                    <option value="ASN">ASN</option>
                    <option value="NON ASN">NON ASN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Bergabung</label>
                  <input 
                    type="date" 
                    value={editingMember.date}
                    onChange={(e) => setEditingMember({...editingMember, date: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white cursor-pointer" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon / WhatsApp</label>
                <input 
                  type="text" 
                  value={editingMember.phone || ""}
                  onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea 
                  value={editingMember.address || ""}
                  onChange={(e) => setEditingMember({...editingMember, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white" 
                  rows={3} 
                ></textarea>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setEditingMember(null)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={handleEditSave} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-500/20">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reset Password */}
      {resettingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setResettingMember(null)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-amber-50/50">
              <h3 className="font-bold text-amber-800 text-lg flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                Reset Password
              </h3>
              <button onClick={() => setResettingMember(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-sm text-gray-600 leading-relaxed">
              Anda yakin ingin mereset password untuk anggota <strong>{resettingMember.name}</strong>? Password akan dikembalikan ke nilai default.
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setResettingMember(null)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
              <button 
                onClick={async () => {
                  try {
                    const res = await fetch(`http://localhost:4000/api/anggota/${resettingMember.id}/reset-password`, {
                      method: 'POST',
                      credentials: 'include'
                    });
                    if (res.ok) {
                      alert('Password berhasil direset menjadi 123');
                    } else {
                      const err = await res.json();
                      alert('Gagal: ' + err.message);
                    }
                  } catch (e) {
                    alert('Terjadi kesalahan koneksi');
                  }
                  setResettingMember(null);
                }} 
                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-xl hover:bg-amber-700 shadow-md shadow-amber-500/20">
                  Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setDeletingMember(null)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50/50">
              <h3 className="font-bold text-red-800 text-lg flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Hapus Anggota
              </h3>
              <button onClick={() => setDeletingMember(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-sm text-gray-600 leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Anda yakin ingin menghapus data <strong>{deletingMember.name}</strong>?
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setDeletingMember(null)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-md shadow-red-500/20">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

function AnggotaRow({ name, id, email, date, pekerjaan, phone, address, onEdit, onResetPassword, onDelete }: any) {
  let formattedDate = date;
  try {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  } catch (e) {}

  return (
    <tr className="hover:bg-blue-50/30 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100/50">{id}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 text-sm">
            {name.charAt(0)}
          </div>
          <p className="text-sm font-bold text-gray-800">{name}</p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {formattedDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        {pekerjaan}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <div className="flex flex-col gap-1">
          {phone ? <span className="font-medium text-gray-800">{phone}</span> : <span className="text-xs text-gray-400 italic">No WA -</span>}
          {email ? <span className="text-xs text-gray-500">{email}</span> : <span className="text-xs text-gray-400 italic">Email -</span>}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="truncate max-w-[180px]" title={address}>
           {address ? address : <span className="text-xs text-gray-400 italic">Tidak ada alamat</span>}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors tooltip-trigger" title="Edit">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={onResetPassword} className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors tooltip-trigger" title="Reset Password">
            <Key className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors tooltip-trigger" title="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

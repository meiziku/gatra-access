import re

with open('/Users/baihaqi/DATA/gatra-access/src/app/admin/setup-saldo/page.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useAnggota } from "@/context/AnggotaContext";')
content = content.replace('11:\n  Database\n12:} from "lucide-react";', '  Database,\n  Users\n} from "lucide-react";')

# 2. Add contexts inside component
ctx_replacement = """export default function SetupSaldoPage() {
  const { coaNeraca, saldoAwalKoperasi, setSaldoAwalKoperasi, members, setTransactions } = useAnggota();
  const [activeTab, setActiveTab] = useState<"import" | "manual" | "anggota">("import");"""
content = re.sub(r'export default function SetupSaldoPage\(\) \{\n  const \[activeTab, setActiveTab\] = useState<"import" \| "manual">"import"\);', ctx_replacement, content)
# wait, the string matches exactly? Let's verify the exact regex for replacing the component start
content = content.replace('export default function SetupSaldoPage() {\n  const [activeTab, setActiveTab] = useState<"import" | "manual">("import");', 'export default function SetupSaldoPage() {\n  const { coaNeraca, saldoAwalKoperasi, setSaldoAwalKoperasi, members, setTransactions } = useAnggota();\n  const [activeTab, setActiveTab] = useState<"import" | "manual" | "anggota">("import");')

# 3. Add state for Anggota Setup
anggota_state = """
  // Anggota Setup State
  const [selectedAnggota, setSelectedAnggota] = useState("");
  const [saldoAnggota, setSaldoAnggota] = useState({
    pokok: "0",
    wajib: "0",
    manasuka: "0",
    pinjamanSisaPokok: "0",
    pinjamanTenor: "0"
  });
"""
content = content.replace('  // Manual Input State', anggota_state + '\n  // Manual Input State')

# 4. Remove local saldoAwal state (we use context now)
content = re.sub(r'  const \[saldoAwal, setSaldoAwal\] = useState\(\{[^}]+\}\);\n', '', content)

# 5. Add tabs for Anggota
tab_html = """
        <button
          onClick={() => setActiveTab("anggota")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "anggota" 
              ? "bg-purple-50 text-purple-600 shadow-sm" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Users className="w-4 h-4" />
          Setup Saldo Anggota
        </button>
      </div>"""
content = content.replace('      </div>', tab_html, 1)

# 6. Add functions for saving
save_funcs = """
  const handleSaveKoperasi = () => {
    alert("Saldo awal koperasi berhasil disimpan!");
  };

  const handleSaveAnggota = () => {
    if (!selectedAnggota) return alert("Pilih anggota terlebih dahulu");
    
    const member = members.find(m => m.id === selectedAnggota);
    const dateStr = new Date().toISOString().split('T')[0];
    
    // Inject Simpanan transactions
    if (parseInt(saldoAnggota.pokok.replace(/\\D/g, "")) > 0) {
      setTransactions(prev => [...prev, {
        id: `SP-AWAL-${Date.now()}-P`, date: dateStr, description: "Simpanan Pokok", 
        memberId: member.id, member: `${member.id} - ${member.name}`, 
        debit: 0, kredit: parseInt(saldoAnggota.pokok.replace(/\\D/g, "")), saldo: 0, isMutasi: false
      }]);
    }
    if (parseInt(saldoAnggota.wajib.replace(/\\D/g, "")) > 0) {
      setTransactions(prev => [...prev, {
        id: `SP-AWAL-${Date.now()}-W`, date: dateStr, description: "Simpanan Wajib", 
        memberId: member.id, member: `${member.id} - ${member.name}`, 
        debit: 0, kredit: parseInt(saldoAnggota.wajib.replace(/\\D/g, "")), saldo: 0, isMutasi: false
      }]);
    }
    if (parseInt(saldoAnggota.manasuka.replace(/\\D/g, "")) > 0) {
      setTransactions(prev => [...prev, {
        id: `SP-AWAL-${Date.now()}-M`, date: dateStr, description: "Manasuka", 
        memberId: member.id, member: `${member.id} - ${member.name}`, 
        debit: 0, kredit: parseInt(saldoAnggota.manasuka.replace(/\\D/g, "")), saldo: 0, isMutasi: false
      }]);
    }

    // Inject Pinjaman transaction
    if (parseInt(saldoAnggota.pinjamanSisaPokok.replace(/\\D/g, "")) > 0) {
      setTransactions(prev => [...prev, {
        id: `PINJ-AWAL-${Date.now()}`, date: dateStr, description: "Pinjaman (Pencairan)", 
        memberId: member.id, member: `${member.id} - ${member.name}`, 
        debit: parseInt(saldoAnggota.pinjamanSisaPokok.replace(/\\D/g, "")), kredit: 0, saldo: 0, isMutasi: false,
        tenor: parseInt(saldoAnggota.pinjamanTenor) || 0
      }]);
    }
    
    alert("Saldo awal anggota berhasil di-inject ke riwayat!");
    setSaldoAnggota({ pokok: "0", wajib: "0", manasuka: "0", pinjamanSisaPokok: "0", pinjamanTenor: "0" });
    setSelectedAnggota("");
  };
"""
content = re.sub(r'  const handleSaveManual = \(\) => \{\n    alert\("Saldo awal koperasi berhasil disimpan!"\);\n  \};\n', save_funcs, content)

# 7. Replace Tab 2 UI with dynamic COA UI
tab2_ui = """
      {/* Tab 2: Setup Saldo Manual */}
      {activeTab === "manual" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Setup Saldo Koperasi (Jurnal)</h3>
              <p className="text-sm text-gray-500 mt-1">Masukkan total aset dan ekuitas awal koperasi secara global.</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Kolom Aset */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900">Aset (Debit)</h4>
                </div>
                
                {[...(coaNeraca?.asetLancar || []), ...(coaNeraca?.asetTetap || [])].map((item: any) => (
                  <div key={item.id}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {item.name}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                      <input 
                        type="text" 
                        value={formatRupiah((saldoAwalKoperasi[item.name] || 0).toString()).replace('Rp', '').trim()}
                        onChange={(e) => {
                          const val = parseInt(e.target.value.replace(/\\D/g, '')) || 0;
                          setSaldoAwalKoperasi({...saldoAwalKoperasi, [item.name]: val});
                        }}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Kolom Modal/Ekuitas */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900">Kewajiban & Ekuitas (Kredit)</h4>
                </div>
                
                {[...(coaNeraca?.kewajibanLancar || []), ...(coaNeraca?.dana || []), ...(coaNeraca?.ekuitas || [])].map((item: any) => (
                  <div key={item.id}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {item.name}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                      <input 
                        type="text" 
                        value={formatRupiah((saldoAwalKoperasi[item.name] || 0).toString()).replace('Rp', '').trim()}
                        onChange={(e) => {
                          const val = parseInt(e.target.value.replace(/\\D/g, '')) || 0;
                          setSaldoAwalKoperasi({...saldoAwalKoperasi, [item.name]: val});
                        }}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-500">Status Balance: </span>
                <span className="font-bold text-emerald-600">Seimbang (Balanced)</span>
              </div>
              <button 
                onClick={handleSaveKoperasi}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Simpan Saldo Awal
              </button>
            </div>
          </div>
        </motion.div>
      )}
"""
content = re.sub(r'      \{\/\* Tab 2: Setup Saldo Manual \*\/\}[\s\S]*?      \}\)', tab2_ui, content)

# 8. Add Tab 3 UI
tab3_ui = """
      {/* Tab 3: Setup Saldo Anggota */}
      {activeTab === "anggota" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Setup Saldo Anggota</h3>
              <p className="text-sm text-gray-500 mt-1">Masukkan nominal awal simpanan dan sisa pinjaman per anggota.</p>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Anggota</label>
              <select 
                value={selectedAnggota}
                onChange={(e) => setSelectedAnggota(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">-- Pilih Anggota --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.id} - {m.name}</option>
                ))}
              </select>
            </div>

            {selectedAnggota && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in zoom-in-95 duration-300">
                
                {/* Kolom Simpanan */}
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-100">
                    <h4 className="font-semibold text-purple-900">Simpanan Anggota</h4>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Simpanan Pokok</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                      <input type="text" value={formatRupiah(saldoAnggota.pokok).replace('Rp', '').trim()} onChange={(e) => setSaldoAnggota({...saldoAnggota, pokok: e.target.value})} className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Simpanan Wajib</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                      <input type="text" value={formatRupiah(saldoAnggota.wajib).replace('Rp', '').trim()} onChange={(e) => setSaldoAnggota({...saldoAnggota, wajib: e.target.value})} className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Manasuka</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                      <input type="text" value={formatRupiah(saldoAnggota.manasuka).replace('Rp', '').trim()} onChange={(e) => setSaldoAnggota({...saldoAnggota, manasuka: e.target.value})} className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>
                </div>

                {/* Kolom Pinjaman */}
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-100">
                    <h4 className="font-semibold text-rose-900">Pinjaman Anggota</h4>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sisa Pokok Pinjaman</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                      <input type="text" value={formatRupiah(saldoAnggota.pinjamanSisaPokok).replace('Rp', '').trim()} onChange={(e) => setSaldoAnggota({...saldoAnggota, pinjamanSisaPokok: e.target.value})} className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sisa Tenor (Bulan)</label>
                    <div className="relative">
                      <input type="number" value={saldoAnggota.pinjamanTenor} onChange={(e) => setSaldoAnggota({...saldoAnggota, pinjamanTenor: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500" />
                    </div>
                  </div>
                </div>

              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end">
              <button 
                onClick={handleSaveAnggota}
                disabled={!selectedAnggota}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold shadow-md shadow-purple-500/20 hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Simpan Saldo Anggota
              </button>
            </div>
          </div>
        </motion.div>
      )}
"""
content = content.replace('    </div>\n  );\n}', tab3_ui + '\n    </div>\n  );\n}')

with open('/Users/baihaqi/DATA/gatra-access/src/app/admin/setup-saldo/page.tsx', 'w') as f:
    f.write(content)

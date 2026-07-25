"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100 via-white to-white"></div>
      <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4">
        <div className="w-[600px] h-[600px] rounded-full bg-emerald-50/50 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/4">
        <div className="w-[400px] h-[400px] rounded-full bg-blue-50/50 blur-3xl"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight font-heading">
              Koperasi Modern untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Masa Depan Anggota</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-lg">
              Tumbuh Bersama, Sejahtera Bersama. Gatra Access adalah Platform Digital Koperasi Gatra Teknika yang terpercaya untuk mengelola keuangan dan memajukan kesejahteraan bersama.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="px-8 py-3.5 text-base font-medium text-white bg-primary hover:bg-primary-dark rounded-full shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="px-8 py-3.5 text-base font-medium text-primary bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-all flex items-center gap-2"
              >
                Daftar Anggota <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/10 border border-white/50 bg-white p-2">
              <img
                src="/rat.jpeg"
                alt="Gatra Access Dashboard"
                className="w-full h-auto rounded-xl"
              />
              {/* Floating Element */}
              <div className="absolute -left-6 bottom-12 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-primary">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pertumbuhan Aset</p>
                    <p className="text-lg font-bold text-gray-900">+24.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

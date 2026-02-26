'use client';

import { useState } from 'react';
import { 
  BookOpen, Shield, Code, Zap, Database, Terminal, 
  ChevronRight, ArrowLeft, Search 
} from 'lucide-react';
import Link from 'next/link';
import { DocSection } from '@/components/docs/doc-section';
import { OverviewSection } from '@/components/docs/sections/overview-section';
import { ContractsSection } from '@/components/docs/sections/contracts-section';
import { GettingStartedSection } from '@/components/docs/sections/getting-started-section';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'architecture', label: 'Architecture', icon: Database },
    { id: 'contracts', label: 'Smart Contracts', icon: Code },
    { id: 'frontend', label: 'Frontend', icon: Terminal },
    { id: 'getting-started', label: 'Getting Started', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono text-sm">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 font-mono">
                  CITADEL DOCS
                </h2>
                <p className="text-sm text-slate-400">
                  Complete technical documentation
                </p>
              </div>
              
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                    activeSection === section.id
                      ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-900/50 hover:text-white border border-transparent'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="font-mono text-sm">{section.label}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                    activeSection === section.id ? 'rotate-90' : ''
                  }`} />
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="space-y-8">
              <DocSection id="overview" title="Overview" active={activeSection === 'overview'}>
                <OverviewSection />
              </DocSection>

              <DocSection id="contracts" title="Smart Contracts" active={activeSection === 'contracts'}>
                <ContractsSection />
              </DocSection>

              <DocSection id="getting-started" title="Getting Started" active={activeSection === 'getting-started'}>
                <GettingStartedSection />
              </DocSection>

              {activeSection === 'architecture' && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
                  <Database className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Architecture Section</h3>
                  <p className="text-slate-400">Coming soon...</p>
                </div>
              )}

              {activeSection === 'frontend' && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
                  <Terminal className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Frontend Section</h3>
                  <p className="text-slate-400">Coming soon...</p>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
                  <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Security Section</h3>
                  <p className="text-slate-400">Coming soon...</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

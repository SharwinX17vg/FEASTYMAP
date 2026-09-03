'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X, MapPin, Route, Tag, Moon, Sun } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Explore', icon: MapPin },
  { href: '/interactive-map', label: 'Map', icon: MapPin },
  { href: '/outing-planner', label: 'Plan Outing', icon: Route },
  { href: '#offers', label: 'Offers', icon: Tag },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem('vibemap-dark');
    if (stored === 'true') {
      setDarkMode(true);
      document.documentElement?.classList?.add('dark');
    }
  }, [mounted]);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement?.classList?.toggle('dark', next);
    localStorage.setItem('vibemap-dark', String(next));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-card/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <AppLogo size={36} />
            <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              FEASTY<span className="text-primary">map</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS?.map((link) => {
              const isActive = link?.href !== '#offers' && pathname === link?.href;
              return (
                <Link
                  key={`nav-${link?.href}`}
                  href={link?.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link?.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              href="/outing-planner"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-150"
            >
              <Route size={15} />
              Plan Outing
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-card border-b border-border animate-fade-in">
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS?.map((link) => {
              const isActive = link?.href !== '#offers' && pathname === link?.href;
              return (
                <Link
                  key={`mob-nav-${link?.href}`}
                  href={link?.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <link.icon size={16} />
                  {link?.label}
                </Link>
              );
            })}
            <Link
              href="/outing-planner"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
            >
              <Route size={15} />
              Plan an Outing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
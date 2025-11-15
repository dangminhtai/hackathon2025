
import React from 'react';
import { GraduationCap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <GraduationCap className="h-8 w-8 text-indigo-600 mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Đại học<span className="text-indigo-600">Thông minh</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;

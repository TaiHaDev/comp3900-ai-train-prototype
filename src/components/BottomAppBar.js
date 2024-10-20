"use client"; // Ensure this component is a client component

import Link from 'next/link';
import { Calendar, Map, UserCheckIcon, Code2Icon } from 'lucide-react';
import { usePathname } from 'next/navigation';

const BottomNav = () => {
  const pathname = usePathname();

  // Define the navigation items in an array for easier rendering
  const navItems = [
    { href: '/route', icon: <Map className="w-xl" />, label: 'Route' },
    { href: '/', icon: <UserCheckIcon className="w-xl" />, label: 'Preferences' },
    { href: '/calendar', icon: <Calendar className="w-xl" />, label: 'Calendar' },
    
    { href: '/ai-assistant', icon: <Code2Icon className="w-xl" />, label: 'AI' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around items-center h-16">
      {navItems.map(({ href, icon, label }) => (
        <Link key={href} href={href} className={`flex flex-col items-center ${pathname === href ? 'text-blue-500' : 'text-gray-500'}`}>
          {icon}
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;

// components/BottomAppBar.js
"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BottomAppBar() {
    const router = useRouter();
    
    // You can add more items here if needed
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Page 1', path: '/route' },
        { name: 'Page 2', path: '/ai-assistant' },
        { name: 'Page 3', path: '/preferences' }
    ];

    return (
        <nav className="bottom-app-bar">
            {navItems.map((item) => (
                <Link href={item.path} key={item.path}>
                    <div className={`nav-item ${router.pathname === item.path ? 'active' : ''}`}>
                        {item.name}
                    </div>
                </Link>
            ))}

            <style jsx>{`
                .bottom-app-bar {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: #ffffff;
                    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
                    height: 60px;
                }
                .nav-item {
                    flex: 1;
                    text-align: center;
                    padding: 10px;
                    color: #666;
                    text-decoration: none;
                    font-size: 14px;
                }
                .nav-item.active {
                    color: #000;
                    font-weight: bold;
                }
            `}</style>
        </nav>
    );
}

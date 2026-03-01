'use client';

import React from 'react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const handleLogout = () => {
        // Clear cookie (a quick robust approach for client without specific log-out API)
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Force redirect and clear everything
        window.location.href = '/login';
    };

    return (
        <button className="btn-secondary logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Sign Out

            
        </button>
    );
}

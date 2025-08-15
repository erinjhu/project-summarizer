"use client"
import { useState } from "react"

export default function Resume() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <div className="flex-1 overflow-y-auto">
                <h1>Resume</h1>
                <p>Scrollable main content</p>
            </div>
            <div
                className={`bg-gray-700 h-screen shadow-lg transition-all duration-300 ${collapsed ? "w-10" : "w-1/4"}`}
            >
                <button 
                    onClick={() => setCollapsed((c) => !c)}
                >
                    {collapsed ? " <<" : " >>"}
                </button>
                {!collapsed && (
                    <div className="p-4">
                        <p>Sidebar text</p>
                        {/* Add more sidebar content here */}
                    </div>
                )}
            </div>
        </div>
    );
}
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Resume() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedTab, setSelectedTab] = useState("Resume");
    const router = useRouter();

    return (
        <div className="bg-neutral-900 min-h-screen flex">
            <div className="flex-1 overflow-y-auto">
                <h1>Interview</h1>
                <p>Scrollable main content</p>
            </div>
            <div
                className={`bg-neutral-800 h-screen shadow-lg transition-all duration-300 ${collapsed ? "w-10" : "w-1/4"}`}
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
                        <div className="justify-center mt-4">
                            <div className="flex rounded-full border-2 overflow-hidden w-full border-neutral-500">
                                <button 
                                    className={`flex-1 px-6 py-2 focus:outline-none ${
                                        selectedTab === "Resume"
                                        ? "bg-blue-900 text-white rounded-full border-2 mx-1 my-1 border-neutral-500"
                                        : "text-gray-300"
                                    }`}
                                    onClick={
                                        () => {
                                            setSelectedTab("Resume")
                                            router.push("/resume")
                                        }
                                    }
                                >
                                    Resume
                                </button>
                                <button
                                className={`flex-1 px-6 py-2 focus:outline-none ${
                                    selectedTab === "Interview"
                                    ? "bg-blue-900 text-white rounded-full border-2 mx-1 my-1 border-neutral-500"
                                    : "text-gray-300"
                                }`}
                                onClick={() => {
                                    setSelectedTab("Interview")
                                    router.push("/interview")
                                    }}
                                >
                                Interview
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
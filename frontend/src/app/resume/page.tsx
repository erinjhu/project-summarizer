"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Stats } from "fs";


export default function Resume() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedTab, setSelectedTab] = useState("Resume");
    const [numBullets, setNumBullets] = useState(3); 
    const [minWords, setMinWords] = useState(13);
    const [maxWords, setMaxWords] = useState(15);   
    const [keywordInput, setKeywordInput] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);
    const router = useRouter();
    const [complexity, setComplexity] = useState(5);
    const [stats, setStats] = useState(5);
    const [refBullets, setRefBullets] = useState("");

    return (
        <div className="bg-neutral-900 min-h-screen flex">
           
            <div
                className={`flex-shrink-0 top-0 bg-neutral-800 min-h-screen shadow-lg transition-all duration-300 ${collapsed ? "w-10" : "w-1/4"}`}
            >
                <div className="flex items-center gap-2 ml-3">
                    <button 
                        onClick={() => setCollapsed((c) => !c)}
                    >
                        {collapsed ? " ☰" : " <<"}
                    </button>
                    <div className="flex-1">
                        <div className="justify-center mt-1 font-sans">
                            <div className="mt-3 ml-3 w-80 flex rounded-full border-2 overflow-hidden border-neutral-500">
                                <button 
                                    className={`flex-1 px-6 py-0.5 focus:outline-none ${
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
                                className={`flex-1 px-6 py-0.5 focus:outline-none ${
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
                </div>
                {!collapsed && (
                    <div className="p-6">
                        
                        {/* Structure */}
                        <div className=" font-sans">
                            <h2 className="text-white">Structure</h2>
                            <div className="">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-neutral-500">Number of bullets</span>
                                    <span className="text-white">{numBullets}</span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={10}
                                    value={numBullets}
                                    onChange={e => setNumBullets(Number(e.target.value))}
                                    className="w-full accent-neutral-500"
                                />
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-neutral-500">Number of words</span>
                                    <span className="text-white">{minWords} - {maxWords}</span>
                                </div>
                                <div className="text-neutral-500">figure out how to do dual slider</div>
                            </div>
                        </div>
                        {/* Content */}
                        <div className="mt-1 font-sans">
                            <h2 className="text-white">Content</h2>
                            <textarea
                                value={refBullets}
                                onChange={e => setRefBullets(e.target.value)}
                                placeholder="Paste in reference resume bullets"
                                className="w-full h-17 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3 resize-none"
                            />
                            <input
                                type="text"
                                value={keywordInput}
                                onChange={e => setKeywordInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter" && keywordInput.trim()) {
                                        console.log(keywordInput.trim())
                                        setKeywords([...keywords, keywordInput.trim()]);
                                        setKeywordInput("");
                                    }
                                }}
                                placeholder="Type in keywords then press Enter"
                                className="w-full h-8 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3"
                            />
                            <div className="flex flex-wrap gap-1 mt-1 mb-4">
                                {keywords.map((kw, idx) => (
                                    <div key={idx} className="flex items-center bg-neutral-700 text-gray-200 rounded-full px-4">
                                        <span>{kw}</span>
                                        <button
                                            className="mt-1 ml-2 text-gray-400 hover:text-red-400 focus:outline-none"
                                            onClick={() => setKeywords(keywords.filter((_, i) => i !== idx))}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-neutral-500">Technical Complexity</span>
                                <span className="text-white">
                                    {complexity <= 3
                                        ? "Low"
                                        : complexity <= 7
                                        ? "Medium"
                                        : "High"} 
                                </span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={10}
                                value={complexity}
                                onChange={e => setComplexity(Number(e.target.value))}
                                className="w-full accent-neutral-500"
                            />
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-neutral-500">Add stats, numbers, and %'s</span>
                                <span className="text-white">
                                    {stats <= 3
                                        ? "Less"
                                        : stats <= 7
                                        ? "Medium"
                                        : "More"} 
                                </span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={10}
                                value={stats}
                                onChange={e => setStats(Number(e.target.value))}
                                className="w-full accent-neutral-500"
                            />
                        </div>
                        <textarea
                                placeholder="Custom adjustments (e.g. put more info on how I impacted users and make it more relevant to software"
                                className="w-full h-25 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3 resize-none"
                        />
                        <div className="mt-1 flex flex-col gap-1">
                            <button
                                className="w-full py-0.3 rounded-lg border-2 border-neutral-500 text-gray-300 font-sans hover:bg-neutral-500"
                                onClick={() => {
                                    setSelectedTab("Resume");
                                    setNumBullets(3);
                                    setMinWords(13);
                                    setMaxWords(15);
                                    setKeywordInput("");
                                    setKeywords([]);
                                    setComplexity(5);
                                    setStats(5);
                                    setRefBullets("");
                                }}
                            >
                                Reset to defaults
                            </button>
                            <button
                                className="w-full py-0.3 rounded-lg bg-blue-950 border-2 border-neutral-500 text-white font-sans hover:bg-blue-940"
                                onClick={() => {
                                    // Generate logic here
                                }}
                            >
                                Generate
                            </button>
                    </div>
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-y-auto mt-15 m-17 font-sans">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl text-left">Custom resume bullets</h1>
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-950 border-2 border-neutral-500 text-white font-sans hover:bg-blue-940"
                        onClick={() => {
                            // Edit repo link logic here
                            router.push("/");
                        }}
                    >
                        Edit repo link or job description
                    </button>
                </div>
                <p>Scrollable main content placeholder ...</p>
                {/* ...rest of your main content... */}
            </div>
        </div>
    );
}
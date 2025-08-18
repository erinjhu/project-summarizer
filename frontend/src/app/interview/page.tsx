"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ClipboardIcon, TrashIcon, ArrowDownTrayIcon, PencilIcon, StarIcon } from "@heroicons/react/24/solid";


export default function Resume() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedTab, setSelectedTab] = useState("Interview");
    const [numBullets, setNumBullets] = useState(3); ``
    const [minWords, setMinWords] = useState(13);
    const [maxWords, setMaxWords] = useState(15);   
    const [jobInput, setJobInput] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState("");
    const [company, setCompany] = useState("")
    const router = useRouter();
    const [complexity, setComplexity] = useState(5);
    const [stats, setStats] = useState(5);
    const [refQuestions, setrefQuestions] = useState("");
    const [versionName, setVersionName] = useState("Edit version name")
    const [interviewer, setInterviewer] = useState("")

    return (
        <div className="bg-neutral-900 min-h-screen flex font-sans">
           
            <div
                className={`p-6 flex-shrink-0 top-0 bg-neutral-800 min-h-screen shadow-lg transition-all duration-300 ${collapsed ? "w-10" : "w-1/4"}`}
            >
                {/* Collapse + Tabs Row */}
                <div className="flex items-center justify-between p-3">
                    <button 
                        onClick={() => setCollapsed((c) => !c)}
                        className="text-white"
                    >
                        {collapsed ? "☰" : "<<"}
                    </button>

                    {!collapsed && (
                        <div className="flex bg-neutral-700 rounded-full p-1 w-max border-neutral-500">
                            <button
                                className={`px-4 py-1 rounded-full ${
                                    selectedTab === "Resume"
                                        ? "bg-blue-900 text-white border-2 border-neutral-500"
                                        : "text-gray-300"
                                }`}
                                onClick={() => {
                                    setSelectedTab("Resume");
                                    router.push("/resume");
                                }}
                            >
                                Resume
                            </button>
                            <button
                                className={`px-4 py-1 rounded-full ${
                                    selectedTab === "Interview"
                                        ? "bg-blue-900 text-white border-2 border-neutral-500"
                                        : "text-gray-300"
                                }`}
                                onClick={() => {
                                    setSelectedTab("Interview");
                                    router.push("/interview");
                                }}
                            >
                                Interview
                            </button>
                        </div>
                    )}
                </div>

                {!collapsed && (
                    <div className="px-3">
                        {/* Structure */}
                        <div className="font-sans mt-3">
                            <h2 className="text-white mb-2">Preparing for the role</h2>
                            <div>
                                <label className="text-neutral-500">
                                    <input
                                    type="checkbox"
                                    /> Notes about the role
                                </label>
                                <input
                                    type="text"
                                    value={jobInput}
                                    onChange={e => setJobInput(e.target.value)}
                                    placeholder="Job description or url"
                                    className="w-full h-8 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3"
                                />
                                <label className="text-neutral-500">
                                    <input
                                    type="checkbox"
                                    /> Notes about the company
                                </label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={e => setCompany(e.target.value)}
    
                                    placeholder="Company website or other urls"
                                    className="w-full h-8 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3"
                                />
                                <label className="text-neutral-500">
                                    <input
                                    
                                    type="checkbox"
                                    /> Questions to ask the interviewer
                                </label>
                                <input
                                    type="text"
                                    value={interviewer}
                                    onChange={e => setInterviewer(e.target.value)}
                                
                                    placeholder="Your interviewer's LinkedIn or other urls"
                                    className="w-full h-8 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3"
                                />
                               
                               
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mt-4 font-sans">
                            <h2 className="text-white mb-2">Your project</h2>
                            <textarea
                                value={refQuestions}
                                onChange={e => setrefQuestions(e.target.value)}     
                                placeholder="Paste in example questions"
                                className="w-full h-17 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3 resize-none"
                            />
                            <input
                                type="text"
                                value={keywordInput}
                                onChange={e => setKeywordInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter" && keywordInput.trim()) {
                                        setKeywords([...keywords, keywordInput.trim()]);
                                        setKeywordInput("");
                                    }
                                }}
                                placeholder="Type in keywords/phrases then press Enter"
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
                                <span className="text-neutral-500">Level of detail</span>
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
                            placeholder="Custom adjustments (e.g. make the questions harder and include one about using Docker)"
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
                                    setrefQuestions("");
                                }}
                            >
                                Reset to defaults
                            </button>
                            <button
                                className="w-full py-0.3 rounded-lg bg-blue-950 border-2 border-neutral-500 text-white font-sans hover:bg-blue-900"
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

            <div className="flex-1 overflow-y-aut m-17 font-sans">
                {/* Heading and Button */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-5xl text-left">Custom questions and notes</h1>
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-950 border-2 border-neutral-500 text-white font-sans hover:bg-blue-900"
                        onClick={() => {
                            router.push("/");   
                        }}
                    >
                        ← Edit repo link or job description
                    </button>
                </div>
                {/* Generated bullets */}
                <div className="neutral-800 rounded-lg border-2 border-neutral-500 p-6">
                    <div className="flex gap-4 mt-4">
                        <div className="w-1/6">
                            <h2 className="text-3xl text-center">Question</h2>
                            <button className="w-full mt-3 items-center rounded-lg bg-blue-950 border-2 border-neutral-500 text-white font-sans hover:bg-blue-900">
                                View answer
                            </button>
                        </div>
                        <div className="flex-1 bg-neutral-900 rounded-lg ml-4">
                            <div className="flex items-center gap-2 mb-4">
                                 The question will go here?
                            </div>
                           
                        </div>
                        <div className="flex flex-col">
                            <button 
                                className="flex p-1 hover:bg-neutral-700 rounded"
                                onClick={() => {}}
                            >
                                <StarIcon className="h-4 w-4 text-gray-300" />
                            </button>
                            <button 
                                className="flex p-1 hover:bg-neutral-700 rounded"
                                onClick={() => {}}
                            >
                                <TrashIcon className="h-4 w-4 text-gray-300" />
                            </button>
                            <button 
                                className="flex p-1 hover:bg-neutral-700 rounded"
                                onClick={() => {}}
                            >
                                <PencilIcon className="h-4 w-4 text-gray-300" />
                            </button>
                        </div>
                        <div className="w-1/5 rounded-lg flex flex-col gap-2">
                            <button className="flex items-center gap-2 rounded-lg border-2 border-neutral-500 text-gray-300 font-sans hover:bg-neutral-500">
                                <ClipboardIcon className="ml-4 h-5 w-5" />
                                Copy
                            </button>

                            <button className="flex items-center gap-2 rounded-lg bg-blue-950 border-2 border-neutral-500 text-white font-sans hover:bg-blue-900">
                                <ArrowDownTrayIcon className="ml-4 h-5 w-5" />
                                Save as version
                            </button>
                        </div>

                    </div>    
                    

                </div>
                <p>Scrollable main content placeholder ...</p>
            </div>
        </div>
    );
}



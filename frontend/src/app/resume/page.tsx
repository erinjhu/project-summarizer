"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ClipboardIcon, TrashIcon, ArrowDownTrayIcon, PencilIcon, CheckIcon } from "@heroicons/react/24/solid";
import { cleanInput, generateResume } from "../utils";


export default function Resume() {
    const [repoUrl, setRepoUrl] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('repoUrl') || "";
            console.log('Resume page - Loaded repoUrl from localStorage:', saved);
            return saved;
        }
        return ""
    })
    const [jobDescription, setJobDescription] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('jobDescription') || "";
            console.log('Resume page - Loaded jobDescription from localStorage:', saved);
            return saved;
        }
        return ""
    })
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
    const [versionName, setVersionName] = useState("")
    const [custom, setCustom] = useState("")
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [copiedTitle, setCopiedTitle] = useState(false);
    const [copiedBullets, setCopiedBullets] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRepoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRepoUrl(value);
        localStorage.setItem('repoUrl', value);
        console.log('Resume page - Saved repoUrl to localStorage:', value);
    };

    const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setJobDescription(value);
        localStorage.setItem('jobDescription', value);
        console.log('Resume page - Saved jobDescription to localStorage:', value);
    };

    useEffect(() => {
        console.log('Resume page mounted');
        console.log('Current localStorage jobDescription:', localStorage.getItem('jobDescription'));
        console.log('Current localStorage repoUrl:', localStorage.getItem('repoUrl'));
    }, []);

    const handleGenerate = async () => {
        setLoading(true)
        try{
            const payload = {
                repo_url: repoUrl,
                job_description: cleanInput(jobDescription),
                num_bullets: numBullets,
                min_words: minWords,
                max_words: maxWords,
                ref_bullets: cleanInput(refBullets),
                keywords,
                complexity,
                stats,
                custom,
                version_name: versionName,
            };
            const data = await generateResume(payload);
            setResumeData(data);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }        
        console.log("called handleGenerate")
    };

    const handleCopyTitle = () => {
        if (resumeData?.section_title) {
            navigator.clipboard.writeText(resumeData.section_title);
            setCopiedTitle(true)
            console.log("copied title")
            setTimeout(() => setCopiedTitle(false), 1500)
        }
    };

    const handleCopyBullets = () => {
        if (resumeData?.resume_bullets) {
            navigator.clipboard.writeText(resumeData.resume_bullets.join('\n'));
            setCopiedBullets(true)
            console.log("copied bullets")
            setTimeout(() => setCopiedBullets(false), 1500)
        }
    };

    type ResumeData = {
        section_title: string;
        resume_bullets: string[];
    };

    return (
        <div className="bg-neutral-900 min-h-screen flex font-sans">
           
            <div
                className={`p-6 flex-shrink-0 top-0 bg-neutral-800 min-h-screen shadow-lg transition-all duration-300 ${collapsed ? "w-10" : "w-1/4"}`}
            >
                {/* Collapse + Tabs Row */}
                <div className="flex items-center justify-between">
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
                        <div className="font-sans mt-3">
                            <h2 className="text-white mb-2">Info</h2>
                            <input
                                type="text"
                                value={repoUrl}
                                onChange={handleRepoUrlChange}
                                placeholder="Paste GitHub project repo url"
                                className="w-full h-8 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3"
                            />
                            <textarea
                                value={jobDescription}
                                onChange={handleJobDescriptionChange}
                                placeholder="Paste in job description"
                                className="w-full h-17 mt-3 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3 resize-none"
                            />
                        </div>
                        {/* Structure */}
                        <div className="font-sans mt-3">
                            <h2 className="text-white mb-2">Structure</h2>
                            <div>
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
                        <div className="mt-4 font-sans">
                            <h2 className="text-white mb-2">Content</h2>
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
                            placeholder="Custom adjustments (e.g. put more info on how I impacted users and make it more relevant to software)"
                            className="w-full h-25 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3 resize-none"
                            value={custom}
                            onChange={e => setCustom(e.target.value)}
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
                                className="w-full py-0.3 rounded-lg bg-blue-950 border-2 border-neutral-500 text-white font-sans hover:bg-blue-900"
                                onClick={handleGenerate}
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto mt-15 m-17 font-sans">
                {/* Heading and Button */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-5xl text-left">Custom resume bullets</h1>
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-950 border-2 border-neutral-500 text-white font-sans hover:bg-blue-940"
                        onClick={() => {
                            router.push("/");
                        }}
                    >
                        ← Edit repo link or job description
                    </button>
                </div>
                {/* Generated bullets */}
                <div className="neutral-800 rounded-lg border-2 border-neutral-500 p-6">
                    {loading ? (
                        <div className="text-white text-xl">Loading...</div>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={versionName}
                                onChange={e => setVersionName(e.target.value)}
                                onKeyDown={e => {
                                }}
                                placeholder="Edit version name"
                                className="w-full h-8 bg-neutral-800 text-gray-300 border-2 border-neutral-500 rounded-lg p-3"
                            />
                            <div className="flex gap-4 mt-4">
                                <div className="flex-1 bg-neutral-900 rounded-lg">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h2 className="text-3xl text-left">
                                            {resumeData?.section_title || "Name goes here"}
                                        </h2>
                                        <button 
                                            className="p-1 hover:bg-neutral-700 rounded"
                                            onClick={() => {}}
                                        >
                                            <PencilIcon className="h-6 w-6 text-gray-300" />
                                        </button>
                                    </div>

                                    <ul className="list-disc list-inside text-gray-300">
                                        
                                        {resumeData?.resume_bullets
                                            ? resumeData.resume_bullets.map((bullet: string, idx: number) => (
                                                <li key={idx}>{bullet}</li>
                                            ))
                                            : (
                                                <>
                                                    <li>Replace this with generated resume bullet text</li>
                                                    <li>Bullet point 2</li>
                                                    <li>Bullet point 3</li>
                                                </>
                                            )
                                        }
                                    </ul>
                                </div>
                                <div className="w-1/5 rounded-lg flex flex-col gap-2">
                                    <button 
                                        className="flex items-center gap-2 rounded-lg border-2 border-neutral-500 text-gray-300 font-sans hover:bg-neutral-500"
                                        onClick={handleCopyTitle}
                                    >
                                        {copiedTitle ? (
                                            <>
                                            <CheckIcon className="ml-4 h-5 w-5 text-green-400" />
                                            Copied!
                                            </>
                                        ) : (
                                            <>
                                            <ClipboardIcon className="ml-4 h-5 w-5" />
                                            Copy title
                                            </>
                                        )}
                                    </button>

                                    <button 
                                        className="flex items-center gap-2 rounded-lg border-2 border-neutral-500 text-gray-300 font-sans hover:bg-neutral-500"
                                        onClick={handleCopyBullets}
                                    >
                                        {copiedBullets ? (
                                            <>
                                            <CheckIcon className="ml-4 h-5 w-5 text-green-400" />
                                            Copied!
                                            </>
                                        ) : (
                                            <>
                                            <ClipboardIcon className="ml-4 h-5 w-5" />
                                            Copy bullets
                                            </>
                                        )}
                                    </button>

                                    <button className="flex items-center gap-2 rounded-lg border-2 border-neutral-500 text-gray-300 font-sans hover:bg-neutral-500">
                                        <TrashIcon className="ml-4 h-5 w-5" />
                                        Delete section
                                    </button>
        
                                    <button className="flex items-center gap-2 rounded-lg bg-blue-950 border-2 border-neutral-500 text-white font-sans hover:bg-blue-900">
                                        <ArrowDownTrayIcon className="ml-4 h-5 w-5" />
                                        Save as version
                                    </button>
                                </div>

                            </div>    
                        </>
                    )
                }
                </div>
            </div>
        </div>
    );
}



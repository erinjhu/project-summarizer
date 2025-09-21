"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ClipboardIcon, TrashIcon, ArrowDownTrayIcon, PencilIcon, StarIcon } from "@heroicons/react/24/solid";


export default function Interview() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedTab, setSelectedTab] = useState("Interview");
    const [numBullets, setNumBullets] = useState(3); ``
    const [minWords, setMinWords] = useState(13);
    const [maxWords, setMaxWords] = useState(15);   
    const [jobInput, setJobInput] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('jobDescription') || "";
            console.log('Loaded jobDescription from localStorage:', saved);
            return saved;
        }
        return ""
    })
    const [projInput, setProjInput] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('repoUrl') || "";
            console.log('Loaded repoUrl from localStorage:', saved);
            return saved;
        }
        return ""
    })
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState("");
    const [company, setCompany] = useState("")
    const router = useRouter();
    const [complexity, setComplexity] = useState(5);
    const [stats, setStats] = useState(5);
    const [refQuestions, setrefQuestions] = useState("");
    const [versionName, setVersionName] = useState("Edit version name")
    const [interviewer, setInterviewer] = useState("")
    const cleanInput = (text: string) => text.replace(/[\r\n]+/g, ' ');
    const [custom, setCustom] = useState("");
    const [createProjNotes, setCreateProjNotes] = useState(false);
    const [createRoleNotes, setCreateRoleNotes] = useState(false);
    const [createCompanyNotes, setCreateCompanyNotes] = useState(false);
    const [createInterviewerQuestions, setCreateInterviewerQuestions] = useState(false);
    const [createInterviewPractice, setCreateInterviewPractice] = useState(false);
    const [interviewData, setInterviewData] = useState<any>(null);
    const isFormValid = projInput;

    const handleJobInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setJobInput(value);
        localStorage.setItem('jobDescription', value);
        console.log('Saved jobDescription to localStorage:', value);
    };

    const handleProjInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProjInput(value);
        localStorage.setItem('repoUrl', value);
        console.log('Saved repoUrl to localStorage:', value);
    };

    useEffect(() => {
        console.log('Interview page mounted');
        console.log('Current localStorage jobDescription:', localStorage.getItem('jobDescription'));
        console.log('Current localStorage repoUrl:', localStorage.getItem('repoUrl'));
    }, []);

    const handleGenerate = async () => {
        const payload = {
            repo_url: projInput,
            job_description: cleanInput(jobInput),
            company_info: company,
            interviewer_info: interviewer,
            ref_questions: refQuestions,
            keywords,
            complexity,
            stats,
            custom,
            create_proj_notes: createProjNotes,
            create_role_notes: createRoleNotes,
            create_company_notes: createCompanyNotes,
            create_interviewer_questions: createInterviewerQuestions,
            create_interview_practice: createInterviewPractice,
        };

        try {
            const res = await fetch("http://localhost:8000/create-interview-prep", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            setInterviewData(data);
            console.log(data);
        } catch (error) {
            console.error("Error generating interview prep:", error);
        }
    };

    const isUrl = (str: string) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
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
                    
                        {/* Structure */}
                        <div className="font-sans mt-3">
                            <h2 className="text-white mb-2">Notes and questions to generate</h2>
                            <div>
                                <label className="text-neutral-500">
                                    <input
                                    type="checkbox"
                                    checked={createProjNotes}
                                    onChange={e => setCreateProjNotes(e.target.checked)}
                                    /> Notes about your project
                                </label>
                                <input
                                    type="text"
                                    value={projInput}
                                    onChange={handleProjInputChange}
                                    placeholder="GitHub repo url"
                                    className="w-full h-8 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3"
                                />
                                {/* <label className="text-neutral-500">
                                    <input
                                    type="checkbox"
                                    checked={createRoleNotes}
                                    onChange={e => setCreateRoleNotes(e.target.checked)}
                                    /> Notes about the role
                                </label>
                                <input
                                    type="text"
                                    value={jobInput}
                                    onChange={handleJobInputChange}
                                    placeholder="Job description or url"
                                    className="w-full h-8 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3"
                                />
                                <label className="text-neutral-500">
                                    <input
                                    type="checkbox"
                                    checked={createCompanyNotes}
                                    onChange={e => setCreateCompanyNotes(e.target.checked)}
                                    /> Notes about the company
                                </label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={e => setCompany(e.target.value)}
    
                                    placeholder="Company website or other urls"
                                    className="w-full h-8 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3"
                                />
                                 */}
                               
                                {/* <label className="text-neutral-500">
                                    <input
                                    
                                    type="checkbox"
                                    checked={createInterviewerQuestions}
                                    onChange={e => setCreateInterviewerQuestions(e.target.checked)}
                                    /> Questions to ask the interviewer
                                </label>
                                <input
                                    type="text"
                                    value={interviewer}
                                    onChange={e => setInterviewer(e.target.value)}
                                
                                    placeholder="Your interviewer's LinkedIn or other urls"
                                    className="w-full h-8 mt-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3"
                                /> */}
                                <label className="text-neutral-500">
                                    <input
                                    
                                    type="checkbox"
                                    checked={createInterviewPractice}
                                    onChange={e => setCreateInterviewPractice(e.target.checked)}
                                    /> Questions to practice for interviews
                                </label>
                               
                               
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mt-4 font-sans">
                            <h2 className="text-white mb-2">Adjust the generated content</h2>
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
                                placeholder="Type keywords then press Enter"
                                className="w-full h-8 mt-1 mb-1 bg-neutral-900 text-gray-300 border-2 border-neutral-500 rounded-lg p-3"
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
                                    setrefQuestions("");
                                }}
                            >
                                Reset to defaults
                            </button>
                            <button
                                disabled={!isFormValid}
                                className={`w-full py-0.3 rounded-lg border-2 border-neutral-500 font-sans
                                    ${!isFormValid
                                        ? "bg-neutral-700 text-gray-400 cursor-not-allowed"
                                        : "bg-blue-950 text-white hover:bg-blue-900"}
                                `}
                                onClick={
                                    handleGenerate
                                }
                            >
                                Generate
                            </button>
                            <div>
                                {!projInput && (
                                    <span className="text-red-400 text-sm mb-2">
                                        Enter a GitHub repo URL to generate content.
                                    </span>
                                )}
                            </div>
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
                {/* Generated content */}
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
                                {interviewData && interviewData.practice_questions && interviewData.practice_questions.interview_questions ? (
                                    <ol className="list-decimal pl-6 text-gray-300">{interviewData.practice_questions.interview_questions.map((q: any, idx: number) => (
                                        <li key={idx} className="mb-2">
                                            {q.question}
                                        </li>
                                    ))}</ol>
                                ) : (
                                    "The question will go here?"
                                )}
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



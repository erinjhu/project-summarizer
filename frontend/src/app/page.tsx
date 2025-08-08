"use client"
import Image from "next/image";
import ReactMarkdown from "react-markdown"
import { useState, useRef } from "react"

const OPTIONS = [
    { key: "general", label: "General Summary" },
    { key: "resume", label: "Resume Bullets" },
    { key: "technical", label: "Technical Notes" },
    { key: "interview", label: "Interview Practice" },
  ];

export default function Home() {
  
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>(OPTIONS[0].key);



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setConcepts([]);
    setError(null);
    setLoading(true);

    try {

      if (!repoUrl) {
        alert("Please enter a GitHub URL.");
        setLoading(false);
        return;
      }

      if (repoUrl && !repoUrl.startsWith("https://github.com/")) {
        setError("Please enter a valid GitHub repository URL.");
        setLoading(false);
        return;
      }

      if (repoUrl) {
        console.log("Repo URL:", repoUrl);
        const response = await fetch("http://127.0.0.1:8000/summarize-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            repo_url: repoUrl,
          }),
        });
        const data = await response.json();
        console.log(data);
        setResult(data);
        setConcepts(data.concepts || []);
        setLoading(false);
      } else if (zipFile) {
        console.log("ZIP File:", zipFile);
        const formData = new FormData();
        formData.append("file", zipFile);

        const response = await fetch("http://127.0.0.1:8000/summarize-zip", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("Backend response:", data); 
        console.log("Concepts from backend:", data.concepts);
        console.log(data);
        setResult(data.summary);
        setConcepts(data.concepts || []);
        setLoading(false)
      }
    } catch (err){
      setError("Something went wrong. Please try again.");
    }
    setLoading(false)
  
    

    
  }
  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
      <h1 className="text-7xl font-bold mb-0 mt-40 text-center">
        asjdlkfjs;jks ajdlkfjl
      </h1>
      <h2 className="text-3xl text-center mt-10 mb-8 max-w-3xl mx-auto">sdjlkfjdslkflksj;jgl fjldsjfl;kjdklsfj;ljsgkldjklf fkldjglk;djflk;sdjg sdjfkl;sdjkgl;sjdklf;jldks;jgkls;djf;s </h2>
      
      <div className="flex flex-col items-center mt-10">
        {/*Inputs*/}
        <div className="flex flex-col items-center mt-10 w-[42rem] mx-auto">
          <form 
            className="flex flex-col gap-4 items-center mb-8"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-row gap-4 w-full justify-center items-center ">
              <input
                type="text"
                placeholder="Paste GitHub repo URL"
                value={repoUrl}
                className="border rounded px-3 py-2 w-full"
                onChange={e => setRepoUrl(e.target.value)}
              />
              
            </div>
            
  



            <div className="flex flex-row gap-4 w-full justify-center items-center">
              <button
                type="submit"
                className="mt-7 bg-blue-800 text-white px-4 py-2 hover:text-white rounded hover:bg-blue-700 w-full hover:border"
              >
                Generate
              </button>
            </div>
            <div className="flex flex-row gap-4 w-full justify-center items-center">
              <button
                type="button"
                className="mt-3 text-white px-4 py-2 rounded hover:bg-white hover:text-black w-full border"
                onClick={() => {
                  setResult(null);
                  setConcepts([]);
                  setError(null);
                  setRepoUrl("");
                }}
              >
                Clear
              </button>
            </div>
            <div className="flex flex-row gap-2 w-full justify-center items-center mt-8">
              {OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  className={`flex-1 px-4 py-2 h-16 rounded-t border-b-2 transition
                    ${activeTab === opt.key
                      ? "border-blue-700 text-blue-700 bg-white"
                      : "border-transparent text-gray-500 bg-gray-100"}
                  `}
                  onClick={() => setActiveTab(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </form>
        </div>
        <section className="mt-8 w-[42rem] mx-auto">
          {error && (
            <div className="text-red-600 font-semibold mb-4">{error}</div>
          )}
          {loading ? (
            <div className="text-blue-600 font-semibold">Loading...</div>
          ) : result ? (
            <div className="bg-white p-4 rounded shadow text-gray-900">
              {activeTab === "general" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4" >Summary</h2>
                  <h3 className="font-semibold">What it is</h3>
                  <ul className="list-disc pl-5">
                    {result.summary.what_it_is.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <h3 className="font-semibold mt-4 mb-1">Impact</h3>
                  <ul className="list-disc pl-5">
                    {result.summary.impact.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <h3 className="font-semibold mt-4 mb-1">How it works</h3>
                  <ul className="list-disc pl-5">
                    {result.summary.how_it_works.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === "resume" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Resume Bullets</h2>
                  <ul className="list-disc pl-5">
                    {result.resume_bullets.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === "technical" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Technical Notes</h2>
                  {Object.entries(result.technical_notes).map(([feature, notes]: [string, string[]]) => (
                    <div key={feature} className="mb-4">
                      <h3 className="font-semibold">{feature}</h3>
                      <ul className="list-disc pl-5">
                      {notes.map((note, idx) => (
                        <li key={idx}>
                          <ReactMarkdown components={{
                            p: ({node, ...props}) => <span {...props} />
                          }}>
                            {note}
                          </ReactMarkdown>
                        </li>
                      ))}
                    </ul>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "interview" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Interview Questions</h2>
                  <ul className="list-disc pl-5">
                    {result.interview_questions.map((item: string, idx: number) => (
                      <li key={idx}>
                        <ReactMarkdown components={{
                          p: ({node, ...props}) => <span {...props} />
                        }}>
                          {item}
                        </ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <h1>Results will appear after pressing generate</h1>
          )}
        </section>
      </div>
    </div>
  );
}

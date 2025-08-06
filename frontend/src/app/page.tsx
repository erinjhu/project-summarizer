"use client"
import Image from "next/image";
import { useState, useRef } from "react"

export default function Home() {
  
  const [repoUrl, setRepoUrl] = useState("");
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setConcepts([]);
    setError(null);
    setLoading(true);

    try {
      if (repoUrl && zipFile) {
        alert("Please submit either a GitHub URL or a ZIP file, not both.");
        return;
      }

      if (!repoUrl && !zipFile) {
        alert("Please enter a GitHub URL or upload a ZIP file.");
        return;
      }

      if (repoUrl && !repoUrl.startsWith("github.com/")) {
        setError("Please enter a valid GitHub repository URL.");
        setLoading(false);
        return;
      }

      if (repoUrl) {
        console.log("Repo URL:", repoUrl);
        const response = await fetch("http://127.0.0.1:8000/summarize-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repo_url: repoUrl}),
        });
        const data = await response.json();
        console.log(data);
        setResult(data.summary);
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
        console.log("Backend response:", data); // Add this line
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
      <form 
        className="flex flex-col gap-4 items-center mb-8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center">
          <div className="flex flex-row gap-4 w-full justify-center items-center">
            <input
              type="text"
              placeholder="Paste GitHub repo URL"
              value={repoUrl}
              className="border rounded px-3 py-2 w-80"
              onChange={e => setRepoUrl(e.target.value)}
            />
            <span className="font-bold text-white mx-2 items-center">OR</span>
            <input
              type="file"
              accept=".zip"
              className="border rounded px-3 py-2 w-80"
              onChange={e => setZipFile(e.target.files?.[0] || null)}
              ref={fileInputRef}
            />
          </div>
          
          {zipFile && (
            <div className="flex flex-col items-center">
              <span className="mb-2 text-sm text-gray-700">{zipFile.name}</span>
              
            </div>
          )}
          <div className="flex flex-row gap-4 w-full justify-center items-center">
            <button
              type="submit"
              className="mt-7 bg-white text-black px-4 py-2 hover:text-white rounded hover:bg-blue-700 w-full"
            >
              Summarize
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
                setZipFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Clear
            </button>
          </div>
        </div> 

        
      </form>
      <section className="mt-8 w-full max-w-2xl mx-auto">
        {error && (
          <div className="text-red-600 font-semibold mb-4">{error}</div>
        )}
        {loading ? (
          <div className="text-blue-600 font-semibold">Loading...</div>
        ) : result ? (
          <div className="bg-white p-4 rounded shadow text-gray-900">
            <h2 className="font-bold mb-2">Summary</h2>
            <pre className="whitespace-pre-wrap">{result}</pre>
            {concepts.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Concepts:</h3>
                <ul className="list-disc pl-5">
                  {concepts.map(c => <li key={c}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <h1>Results Placeholder</h1>
        )}
      </section>
    </div>
  );
}

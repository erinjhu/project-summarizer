"use client"
import Image from "next/image";
import { useState, useRef } from "react"

export default function Home() {
  
  const [repoUrl, setRepoUrl] = useState("");
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    if (repoUrl && zipFile) {
      alert("Please submit either a GitHub URL or a ZIP file, not both.");
      return;
    }

    if (!repoUrl && !zipFile) {
      alert("Please enter a GitHub URL or upload a ZIP file.");
      return;
    }

    if (repoUrl) {
       console.log("Repo URL:", repoUrl);
      const response = await fetch("http://127.0.0.1:8000/summarize-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl }),
      });
      const data = await response.json();
      console.log(data);
      setResult(data.summary);
      setConcepts(data.concepts || []);
    } else if (zipFile) {
      console.log("ZIP File:", zipFile);
      const formData = new FormData();
      formData.append("file", zipFile);

      const response = await fetch("http://127.0.0.1:8000/summarize-zip", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      setResult(data.summary);
      setConcepts(data.concepts || []);
    }
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Project Summarizer
      </h1>
      <form 
        className="flex flex-col gap-4 items-center mb-8"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Paste GitHub repo URL"
          className="border rounded px-3 py-2 w-80"
          onChange={e => setRepoUrl(e.target.value)}
        />
        <input
          type="file"
          accept=".zip"
          className="border rounded px-3 py-2 w-80"
          onChange={e => setZipFile(e.target.files?.[0] || null)}
          ref={fileInputRef}
        />
        {zipFile && (
          <div className="flex flex-col items-center">
            <span className="mb-2 text-sm text-gray-700">{zipFile.name}</span>
            <button
              type="button"
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => {
                setZipFile(null)
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Remove ZIP
            </button>
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Summarize
        </button>
      </form>
      <section className="mt-8 w-full max-w-2xl mx-auto">
        <h1>Results Placeholder</h1>
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Concepts:</h3>
          <ul className="list-disc pl-5">
            {concepts.map(c => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </section>
    </div>
  );
}

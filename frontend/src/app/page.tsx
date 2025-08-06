"use client"
import Image from "next/image";
import { useState } from "react"

export default function Home() {
  
  const [repoUrl, setRepoUrl] = useState("");
  const [zipFile, setZipFile] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Repo URL:", repoUrl);
    console.log("ZIP File:", zipFile);
    // Next: send to backend API
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
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Summarize
        </button>
      </form>
      <section className="mt-8 w-full max-w-2xl mx-auto">
        <h1>Results Placeholder</h1>
      </section>
    </div>
  );
}

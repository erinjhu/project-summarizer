const cleanInput = (text: string) => text.replace(/[\r\n]+/g, ' ').replace(/\t+/g, ' ');

const handleGenerate = async () => {
    const payload = {
        repo_url: "", 
        job_description: cleanInput("Paste job description here"), // Replace with your job description input
        num_bullets: numBullets,
        min_words: minWords,
        max_words: maxWords,
        ref_bullets,
        keywords,
        complexity,
        stats,
        custom: "", // Add custom input if you have it
        version_name,
    };

    const res = await fetch("http://localhost:8000/create-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    // Use data to update your UI with the generated resume bullets
};
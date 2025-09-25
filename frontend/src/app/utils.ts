export const cleanInput = (text: string) =>
  text.replace(/[\r\n]+/g, ' ').replace(/\t+/g, ' ');

export async function generateResume(payload: any) {
  const res = await fetch("http://localhost:8000/create-resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    
    if (res.status === 429) {
      throw new Error(
        errorData.detail?.message || 
        "API rate limit exceeded. Please wait a moment and try again."
      );
    } else if (res.status >= 500) {
      throw new Error(
        errorData.detail?.message || 
        "Server error. Please try again later."
      );
    } else {
      throw new Error(
        errorData.detail?.message || 
        "An error occurred. Please try again."
      );
    }
  }
  
  return await res.json();
}

export async function generateInterviewPrep(payload: any) {
  const res = await fetch("http://localhost:8000/create-interview-prep", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    
    if (res.status === 429) {
      throw new Error(
        errorData.detail?.message || 
        "API rate limit exceeded. Please wait a moment and try again."
      );
    } else if (res.status >= 500) {
      throw new Error(
        errorData.detail?.message || 
        "Server error. Please try again later."
      );
    } else {
      throw new Error(
        errorData.detail?.message || 
        "An error occurred. Please try again."
      );
    }
  }
  
  return await res.json();
}
export const cleanInput = (text: string) =>
  text.replace(/[\r\n]+/g, ' ').replace(/\t+/g, ' ');

export async function generateResume(payload: any) {
  const res = await fetch("http://localhost:8000/create-resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}
import { getRoastPersona } from "./Persona";

export const getRoastPrompt = (user: { name: string, jobTitle: string, bio: string, roastLevel: string }, tasks: any[]) => {
  const persona = getRoastPersona(user.roastLevel);
  

  const taskList = tasks.map(t => `- [${t.containerName}] ${t.title}`).join("\n");
  
  const material = `
    TARGET IDENTITY:
    - Name: ${user.name}
    - Profession: ${user.jobTitle}
    - Bio: "${user.bio}"

    OVERDUE TASKS:
    ${taskList}

    Based on the persona instructions, roast this user for their procrastination. 
    Reference their job title and bio to make it personal.
  `.trim();

  return { persona, material };
};
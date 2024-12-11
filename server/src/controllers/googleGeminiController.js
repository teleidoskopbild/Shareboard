import model from "../util/googleGeminiApi.js";

export const generateDescription = async (req, res) => {
  const { title } = req.body; // Erwartet einen `title` im Body der Anfrage

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const prompt = `Write a description for a task for a website feature/functionality based on the following title: ${title}. Always assume it is a programming context. If there are no specifics, try to contextualize its meaning within a website or app project but don't assume any tech stack unless you have the information. Do not give me options. Don't make up information if you don't have enough information. I want one user story and a couple (3-6) of acceptance criteria.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text(); //

    return res.status(200).json({ description });
  } catch (error) {
    console.error("Error generating description:", error);
    return res.status(500).json({ error: "Failed to generate description" });
  }
};

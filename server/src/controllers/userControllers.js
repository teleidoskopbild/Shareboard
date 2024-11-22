import db from "../util/db-connect.js";

// Nutzer erstellen
export const createUser = async (req, res) => {
  const { name, email, shareboard_key, rights } = req.body;

  try {
    // Nutzer in der Datenbank anlegen
    const [newUser] = await db("shareboard_users")
      .insert({ name, email, shareboard_key, rights })
      .returning("*");

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Erstellen des Nutzers" });
  }
};

// Alle Nutzer abrufen (optional für Tests)
export const getAllUsers = async (req, res) => {
  try {
    const users = await db("shareboard_users").select("*");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Abrufen der Nutzer" });
  }
};

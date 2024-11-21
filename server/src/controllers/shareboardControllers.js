// controllers/shareboardController.js

import db from "../util/db-connect.js"; // Dein knex-Datenbank-Setup

// Funktion für das Abrufen aller Shareboards
export const getAllShareboards = async (req, res) => {
  try {
    // Abrufen der Shareboards aus der Tabelle shareboard_shareboards
    const shareboards = await db("shareboard_shareboards").select("*");

    // Rückgabe der Shareboards als JSON
    res.json(shareboards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Abrufen der Shareboards" });
  }
};

// Funktion für das Erstellen eines neuen Shareboards
export const createShareboard = async (req, res) => {
  const { name } = req.body;

  try {
    // Erstellen des Shareboards in der Datenbank
    const [newShareboard] = await db("shareboard_shareboards")
      .insert({ name })
      .returning("*");

    // Rückgabe des neu erstellten Shareboards
    res.status(201).json(newShareboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Erstellen des Shareboards" });
  }
};

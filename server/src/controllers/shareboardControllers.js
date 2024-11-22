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

// Funktion für das Abrufen eines Shareboards

export const getShareboardById = async (req, res) => {
  const { id } = req.params;
  try {
    const shareboard = await db("shareboard_shareboards")
      .where("id", id)
      .first();

    if (!shareboard) {
      return res.status(404).json({ message: "Shareboard nicht gefunden" });
    }
    res.status(200).json(shareboard);
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

// Funktion für das Aktualisieren eines Shareboards
export const updateShareboard = async (req, res) => {
  const { id } = req.params; // ID aus der URL
  const { name } = req.body; // Neuer Name aus dem Body

  try {
    // Aktualisierung in der Datenbank
    const [updatedShareboard] = await db("shareboard_shareboards")
      .where({ id })
      .update({ name })
      .returning("*");

    // Rückgabe des aktualisierten Shareboards
    res.json(updatedShareboard);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Fehler beim Aktualisieren des Shareboards" });
  }
};

// Funktion für das Löschen eines Shareboards
export const deleteShareboard = async (req, res) => {
  const { id } = req.params; // ID aus der URL

  try {
    // Löschen aus der Datenbank
    await db("shareboard_shareboards").where({ id }).del();

    // Erfolgsnachricht zurückgeben
    res.json({ message: `Shareboard mit ID ${id} wurde gelöscht.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Löschen des Shareboards" });
  }
};

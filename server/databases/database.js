require('dotenv').config(); // Charge les variables du fichier .env
const { Pool } = require("pg");

// On utilise l'URL de connexion complète de Neon stockée dans le .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Indispensable pour se connecter à Neon depuis ton PC ou Render
    }
});

// Petit test de connexion pour être sûr que ça marche
pool.connect()
    .then(() => console.log("✅ Connecté avec succès à la base de données Neon !"))
    .catch(err => console.error("❌ Erreur de connexion à la base de données :", err.stack));

module.exports = pool;
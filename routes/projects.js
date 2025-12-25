const express = require('express');
const router = express.Router();
const {getDb} = require('../db/connection');

router.get('/', (req, res) => {
    const db = getDb();

    db.all('SELECT * FROM projects ORDER BY id DESC', (err, rows) => {
        db.close();

        if (err) return res.status(500).json({
            error: err.message
        });

        res.json(rows);
    });
});

router.post('/', (req, res) => {
    const {name, description} = req.body || {};

    if (!name || typeof name !== 'string') {
        return res.status(400).json({
            error: 'Название проекта обязательно.'
        });
    }

    const db = getDb();

    db.run(
        `INSERT INTO projects (name, description) VALUES (?, ?)`,
        [name, description || null],
        function (err) {
            if (err) {
                db.close();

                return res.status(500).json({
                    error: err.message
                });
            }

            const created = {
                id: this.lastID, name, description
            };

            db.close();

            res.status(201).json(created);
        }
    );
});

module.exports = router;
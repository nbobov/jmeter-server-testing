const express = require('express');
const router = express.Router({
    mergeParams: true
});
const {getDb} = require('../db/connection');

router.get('/', (req, res) => {
    const projectId = Number(req.params.id);

    const db = getDb();

    db.all(
        'SELECT * FROM tasks WHERE project_id = ? ORDER BY id DESC',
        [projectId],
        (err, rows) => {
            db.close();

            if (err) return res.status(500).json({
                error: err.message
            });

            res.json(rows);
        }
    );
});

router.post('/', (req, res) => {
    const projectId = Number(req.params.id);

    const {title, description, due_date} = req.body || {};

    if (!title || typeof title !== 'string') {
        return res.status(400).json({
            error: 'Название задачи обязательно.'
        });
    }

    const db = getDb();

    db.get('SELECT id FROM projects WHERE id = ?', [projectId], (err, row) => {
        if (err) {
            db.close();

            return res.status(500).json({
                error: err.message
            });
        }

        if (!row) {
            db.close();

            return res.status(404).json({
                error: 'Проект не найден.'
            });
        }

        db.run(
            `INSERT INTO tasks (project_id, title, description, due_date)
             VALUES (?, ?, ?, ?)`,
            [projectId, title, description || null, due_date || null],
            function (err) {
                if (err) {
                    db.close();

                    return res.status(500).json({
                        error: err.message
                    });
                }

                const created = {
                    id: this.lastID,
                    project_id: projectId,
                    title,
                    description,
                    due_date
                };

                db.close();

                res.status(201).json(created);
            }
        );
    });
});

module.exports = router;
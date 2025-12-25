const fs = require('fs');
const path = require('path');
const {getDb, DB_PATH} = require('./connection');

function ensureDataDir() {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, {
        recursive: true
    });
}

function runMigrations(db) {
    const createProjects = `
        CREATE TABLE IF NOT EXISTS projects
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createTasks = `
        CREATE TABLE IF NOT EXISTS tasks
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            completed INTEGER DEFAULT 0,
            due_date DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE)
        ;
    `;

    db.serialize(() => {
        db.run('BEGIN');
        db.run(createProjects);
        db.run(createTasks);
        db.run('CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id)');
        db.run('CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed)');
        db.run('COMMIT');
    });
}

function seed(db) {
    db.get('SELECT COUNT(*) as cnt FROM projects', (err, row) => {
        if (err) return console.error('Ошибка проверки начальных данных.', err);

        if (row && row.cnt === 0) {
            console.log('Наполнение базы данных начальными данными...');

            db.run(
                `INSERT INTO projects (name, description)
                 VALUES (?, ?)`,
                ['Обновление сайта', 'Редизайн и обновление контента для корпоративного сайта.'],
                function (err) {
                    if (err) return console.error(err);

                    const projectId = this.lastID;

                    db.run(
                        `INSERT INTO tasks (project_id, title, description, completed)
                         VALUES (?, ?, ?, ?)`,
                        [projectId, 'Создать прототипы', 'Используя Figma создать основные экраны', 0]
                    );
                }
            );
        } else {
            console.log('Начальные данные есть.');
        }
    });
}

async function init() {
    ensureDataDir();
    const db = getDb();
    runMigrations(db);
    setTimeout(() => seed(db), 200);
}

if (require.main === module) {
    init();
}

module.exports = {init};
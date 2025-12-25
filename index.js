const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks');

app.get('/health', (req, res) => res.json({
    status: 'ok'
}));

app.use('/projects', projectsRouter);
app.use('/projects/:id/tasks', tasksRouter);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: 'Ошибка сервера.'
    });
});

app.listen(port, () => {
    console.log(`Сервер доступен по адресу: http://localhost:${port}`);
});
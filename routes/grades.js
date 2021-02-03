import express from 'express';
import { promises } from 'fs';

const router = express.Router();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

router.post('/', async (req, res) => {
  let grade = req.body;
  try {
    let json = JSON.parse(await readFile(global.fileName, 'utf8'));

    grade = { id: json.nextId++, timestamp: new Date(), ...grade };
    json.grades.push(grade);

    await writeFile(global.fileName, JSON.stringify(json));

    res.send(grade);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let newGrade = req.body;

    let json = JSON.parse(await readFile(global.fileName, 'utf8'));
    let index = json.grades.findIndex((grade) => grade.id === newGrade.id);
    if (index === -1) {
      throw new Error('ID não existente.');
    }

    if (newGrade.student) {
      json.grades[index].student = newGrade.student;
    }
    if (newGrade.subject) {
      json.grades[index].subject = newGrade.subject;
    }
    if (newGrade.type) {
      json.grades[index].type = newGrade.type;
    }
    if (newGrade.value) {
      json.grades[index].value = newGrade.value;
    }

    await writeFile(global.fileName, JSON.stringify(json));

    res.send(json.grades[index]);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let json = JSON.parse(await readFile(global.fileName, 'utf8'));

    let index = json.grades.findIndex(
      (grade) => grade.id === parseInt(req.params.id, 10)
    );
    if (index === -1) {
      throw new Error('ID não existente.');
    }

    json.grades.splice(index, 1);

    await writeFile(global.fileName, JSON.stringify(json));
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let json = JSON.parse(await readFile(global.fileName, 'utf8'));

    const grade = json.grades.find(
      (grade) => grade.id === parseInt(req.params.id, 10)
    );
    if (grade) {
      res.send(grade);
    } else {
      throw new Error('ID não existente.');
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;

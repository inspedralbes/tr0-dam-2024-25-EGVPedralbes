const express = require('express');
const json=require('../db/dades.json');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(json);
});

app.get('/preguntes', (req, res) => {
    res.send(json.preguntes);
});

app.post('/addPregunta', (req, res) => {
    const { pregunta, respostes,correcta,imatge } = req.body;
    if(!pregunta || !respostes || !correcta || !imatge || respostes.length<4 || correcta<0 || correcta>3 || isNaN(correcta)){
        res.send('Falten dades o no són correctes');
    }
    else {
        json.preguntes.push({ "id": json.preguntes[json.preguntes.length-1].id+1, "pregunta":pregunta, "respostes":respostes, "resposta_correcta":correcta, "imatge": imatge });
        fs.writeFileSync('../db/dades.json', JSON.stringify(json));
        res.send('Pregunta afegida');
    }
    
});

app.delete('/deletePregunta/:id', (req, res) => {
    const id = req.params.id;
    const index = json.preguntes.findIndex(pregunta => pregunta.id == id);
    if(index === -1){
        res.send('No existeix la pregunta');
    }
    else {
        json.preguntes.splice(index, 1);
        fs.writeFileSync('../db/dades.json', JSON.stringify(json));
        res.send('Pregunta eliminada');
    }
});

app.put('/updatePregunta/:id', (req, res) => {
    const id = req.params.id;
    const index = json.preguntes.findIndex(pregunta => pregunta.id == id);
    if(index == -1){
        res.send('No existeix la pregunta');
    }
    else {
        const { pregunta, respostes,correcta,imatge } = req.body;
        if(!pregunta || !respostes || !correcta || !imatge || respostes.length<4 || correcta<0 || correcta>3 || isNaN(correcta)){
            res.send('Falten dades o no són correctes');
        }
        else {
            json.preguntes[index] = { "id": id, "pregunta":pregunta, "respostes":respostes, "resposta_correcta":correcta, "imatge": imatge };
            fs.writeFileSync('../db/dades.json', JSON.stringify(json));
            res.send('Pregunta modificada');
        }
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
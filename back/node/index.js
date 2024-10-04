const express = require('express');
const json = require('../db/dades.json');
const fs = require('fs');
const cors = require('cors');
const { spawn } = require('child_process');
const { spawn } = require('child_process');
const { v4: uuidv4, validate } = require('uuid');
const { isUuid } = require('uuidv4');
const partidas = [];

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

app.get('/pregunta/:id', (req, res) => {
    const id = req.params.id;
    const pregunta = json.preguntes.find(pregunta => pregunta.id == id);
    if (pregunta) {
        res.send(pregunta);
    }
    else {
        res.send('No existeix la pregunta');
    }
});

app.post('/preguntesPartida', (req, res) => {
    const uid = req.body.uid;
    const preguntes = json.preguntes;
    const partida = {
        uid: "",
        preguntes: [],
    };
    for (let i = 0; i < 10; i++) {
        const index = Math.floor(Math.random() * preguntes.length);
        if (partida.preguntes.some(p => p.enunciat === preguntes[index].pregunta)) {
            i--;
        }
        else {
            let auxObjext = {
                "id": preguntes[index].id,
                "enunciat": preguntes[index].pregunta,
                "respostes": [...preguntes[index].respostes],
                "imatge": preguntes[index].imatge
            };
            auxObjext.respostes.sort(() => Math.random() - 0.5);
            partida.preguntes.push(auxObjext);
        }
    }
    partida.uid = generateUid(uid);
    partidas[partida.uid] = JSON.parse(JSON.stringify(partida));
    partida.preguntes.forEach(pregunta => {
        delete pregunta.id;
    });
    console.log(partidas);
    res.send(partida);
});


app.post('/respostesPartida', (req, res) => {
    const uid = req.body.uid;
    const respostes = req.body.respostes;
    const partida = partidas[uid];
    let date = new Date();
    let today = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
    if (partida) {
        if (respostes.length == partida.preguntes.length) {
            if (!fs.existsSync('../db/' + today)) {
                fs.mkdirSync('../db/' + today);
                data = {
                    dadesTotals: {
                        preguntesIntentades: 0,
                        preguntesCorrectes: 0,
                    },
                    dadesPerPregunta: []
                };
                fs.writeFileSync('../db/' + today + '/dades.json', JSON.stringify(data));
            }
            let statFile = fs.readFileSync('../db/' + today + '/dades.json');
            statFile = JSON.parse(statFile);
            for (let i = 0; i < partida.preguntes.length; i++) {
                let pregunta = json.preguntes.find(pregunta => pregunta.id == partida.preguntes[i].id);
                if (pregunta.respostes[pregunta.resposta_correcta] == partida.preguntes[i].respostes[respostes[i]]) {
                    partida.preguntes[i].correcte = true;
                    statFile.dadesTotals.preguntesCorrectes++;
                    statFile.dadesTotals.preguntesIntentades++;
                    if (statFile.dadesPerPregunta.find(pregunta => pregunta.id == partida.preguntes[i].id)) {
                        statFile.dadesPerPregunta.find(pregunta => pregunta.id == partida.preguntes[i].id).intents++;
                        statFile.dadesPerPregunta.find(pregunta => pregunta.id == partida.preguntes[i].id).correctes++;
                    } else {
                        statFile.dadesPerPregunta.push({
                            id: partida.preguntes[i].id,
                            intents: 1,
                            correctes: 1,
                            respostes: []
                        });
                    }

                } else {
                    partida.preguntes[i].correcte = false;
                    statFile.dadesTotals.preguntesIntentades++;
                    if (statFile.dadesPerPregunta.find(pregunta => pregunta.id == partida.preguntes[i].id)) {
                        statFile.dadesPerPregunta.find(pregunta => pregunta.id == partida.preguntes[i].id).intents++;
                    } else {
                        statFile.dadesPerPregunta.push({
                            id: partida.preguntes[i].id,
                            intents: 1,
                            correctes: 0
                        });
                    }
                }
                if (!statFile.dadesPerPregunta.respostes.find(resposta.text == partida.preguntes[i].respostes[respostes[i]])) {
                    statFile.dadesPerPregunta.respostes.push({
                        text: partida.preguntes[i].respostes[respostes[i]],
                        escollida: 1,
                    });
                } else {
                    statFile.dadesPerPregunta.respostes.find(resposta.text == partida.preguntes[i].respostes[respostes[i]]).escollida++;
                }
            }
            fs.writeFileSync('../db/' + today + '/dades.json', JSON.stringify(statFile));
            res.send(partida);
        } else {
            res.send('Falten respostes');
        }
    }
    else {
        res.send('No existeix la partida');
    }
});

function generateUid(uid) {
    if (uid == undefined || !validate(uid)) {
        uid = uuidv4();
    }
    console.log(uid);
    return uid;
}

app.post('/addPregunta', (req, res) => {
    const { pregunta, respostes, correcta, imatge } = req.body;
    if (!pregunta || !respostes || !imatge || respostes.length < 4 || correcta < 0 || correcta > 3 || isNaN(correcta)) {
        res.send('Falten dades o no són correctes');
    }
    else {
        json.preguntes.push({ "id": json.preguntes[json.preguntes.length - 1].id + 1, "pregunta": pregunta, "respostes": respostes, "resposta_correcta": correcta, "imatge": imatge });
        fs.writeFileSync('../db/dades.json', JSON.stringify(json));
        res.send('Pregunta afegida');
    }

});

app.delete('/deletePregunta/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const index = json.preguntes.findIndex(pregunta => pregunta.id == id);
    if (index === -1) {
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
    if (index == -1) {
        res.send('No existeix la pregunta');
    }
    else {
        const { pregunta, respostes, correcta, imatge } = req.body;
        if (!pregunta || !respostes || !imatge || respostes.length < 4 || correcta < 0 || correcta > 3) {
            res.send('Falten dades o no són correctes');
        }
        else {
            json.preguntes[index] = { "id": id, "pregunta": pregunta, "respostes": respostes, "resposta_correcta": correcta, "imatge": imatge };
            fs.writeFileSync('../db/dades.json', JSON.stringify(json));

        }
    }
    res.send('Pregunta actualitzada');
});

app.get('/getPythonData', (req, res) => {
    console.log("inicio");
    const process=spawn('python', ['../python/prova.py']);
    process.stdout.on('data', (data) => {
        const messageFromPython = data.toString();
        console.log('[Mensaje recibido desde Python:] ', messageFromPython,"  [end message]");
        res.send(messageFromPython);
    });
}); 

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
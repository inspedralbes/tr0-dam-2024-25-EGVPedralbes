export async function findAllPreguntes() {
    const response = await fetch('http://quizeric.dam.inspedralbes.cat:24269/preguntes');
    let data = await response.json();

    return data;
    
}
export async function deletePregunta(id) {
    const response = await fetch('http://quizeric.dam.inspedralbes.cat:24269/deletePregunta/'+id, {
        method: 'DELETE'
    });
    let data = await response.text();

    return data;
}
export async function createPregunta(pregunta) {
    const response = await fetch('http://quizeric.dam.inspedralbes.cat:24269/addPregunta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pregunta)
    });
    
}

export async function getPregunta(id) {
    const response = await fetch('http://quizeric.dam.inspedralbes.cat:24269/pregunta/'+id);
    let data = await response.json();
    console.log(data);

    return data;
}

export async function updatePregunta(id, pregunta) {
    const response = await fetch('http://quizeric.dam.inspedralbes.cat:24269/updatePregunta/'+id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pregunta)
    });
    return 0;
}

export async function getPythonData() {
    const response = await fetch('http://quizeric.dam.inspedralbes.cat:24269/getPythonData');
    const data = await response.text();
    return data;
}
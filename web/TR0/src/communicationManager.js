export async function findAllPreguntes() {
    const response = await fetch('http://localhost:3000/preguntes');
    let data = await response.json();

    return data;
    
}
export async function deletePregunta(id) {
    const response = await fetch('http://localhost:3000/deletePregunta/'+id, {
        method: 'DELETE'
    });
    let data = await response.text();

    return data;
}
export async function createPregunta(pregunta) {
    const response = await fetch('http://localhost:3000/addPregunta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pregunta)
    });
    
}

export async function getPregunta(id) {
    const response = await fetch('http://localhost:3000/pregunta/'+id);
    let data = await response.json();
    console.log(data);

    return data;
}

export async function updatePregunta(id, pregunta) {
    const response = await fetch('http://localhost:3000/updatePregunta/'+id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pregunta)
    });
    return 0;
}

export async function getPythonData() {
    const response = await fetch('http://localhost:3000/getPythonData');
    const data = await response.text();
    return data;
}
import json
import numpy as np
route='../db/dades.json'
with open(route) as file:
    data = json.load(file)
for pregunta in data['preguntes']:
    print(pregunta['pregunta'])
    for resposta in pregunta['respostes']:
        if (resposta==pregunta['respostes'][pregunta['resposta_correcta']]):
            print(resposta,'correcta')
        else:
            print(resposta)
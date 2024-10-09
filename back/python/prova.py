import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl
import warnings
from datetime import datetime
import os

warnings.filterwarnings("ignore")
routeData='../db/dades.json'
today_date = datetime.now().strftime("%d-%m-%Y")
statisticsRoute='../db/'+today_date+'/dades.json'
if os.path.exists(statisticsRoute):
    with open(statisticsRoute) as f:
        todayData = json.load(f)
        f.close()
else:
    print("No hi ha dades per ", today_date)
    exit()
Data=[]
with open(routeData) as f:
        fulldata=json.load(f)
        f.close()
for pregunta in todayData["dadesPerPregunta"]:
    perEncertades=round((pregunta["correctes"]/pregunta["intents"])*100,2)
    for data in fulldata["preguntes"]:
        if data["id"]==pregunta["id"]:
            Data.append({
                "Pregunta": data["pregunta"],
                "Percentatge d'encert": perEncertades
            })
    

df = pd.DataFrame(Data)
df.set_index("Pregunta", inplace=True)

plt.figure(figsize=(10, 6))
df["Percentatge d'encert"].plot(kind='bar', color='skyblue')
plt.title('Percentatge d\'encert per Pregunta')
plt.xlabel('Pregunta')
plt.ylabel('Percentatge d\'encert')
plt.xticks(rotation=45, ha='right')

# Adjust layout to accommodate a large number of preguntes
plt.tight_layout()
plt.subplots_adjust(bottom=0.3)

plt.show()
<template>
  <div>
    <!-- Botó per mostrar o amagar el formulari -->
    <button @click="show = !show">Crear pregunta</button>
  </div>
  <!-- Formulari per afegir una nova pregunta -->
  <div v-if=show >
    <h2>Afegir Pregunta</h2>
    <form action="">
      <label for="Enunciat">Enunciat</label>
      <input v-model="newPregunta.pregunta" type="text" name="pregunta" id="Enunciat">
      <div>
        <div>
          <h2>Respostes</h2>
          <!-- Inputs per les respostes -->
           <div v-for="(resposta, index) in newPregunta.respostes" >
            <label :for="'radio'+index">Correcta?</label>
             <input type="radio" name="correcta" :id="'radio'+index" :value="index" v-model="newPregunta.correcta" class="resposta">
             <label :for="'resposta'+index">Resposta {{ index + 1 }}</label>
          <input 
            v-model="newPregunta.respostes[index]" 
            type="text" 
            :name="'resposta'+index" 
            :id="'resposta'+index" 
          >
          
        </div>
        </div>
      </div>
      <label for="imatge">Imatge (En link)</label>
      <input v-model="newPregunta.imatge" type="text" name="imatge" id="imatge">
      <!-- Botó per afegir la nova pregunta -->
      <button @click="callCreatePregunta">Afegir</button>
    </form>
  </div>
  <!-- Llista de preguntes existents -->
  <div v-if=!show class="table">
    <div v-for="pregunta in preguntes">
      <div v-if="!checkModifies(pregunta.id)">
        <p>{{ pregunta.pregunta }}</p>
        <img :src="pregunta.imatge ?? ''" alt="">
        <div class="respostes" >
          <p v-for="(resposta, index) in pregunta.respostes":class="index == pregunta.resposta_correcta ? 'correcta' : 'option'" >{{ resposta }}</p>
        </div>
        <button @click="changeModifyState(pregunta.id)">Editar</button>
        <!-- Botó per esborrar una pregunta -->
        <button @click="callDelete(pregunta.id)">Esborrar</button>
      </div>
      <div v-else>
        <label :for="'Enunciat' + pregunta.id">Enunciat</label>
        <input v-model="updatePreguntaData.pregunta" type="text" :name="'pregunta' + pregunta.id" :id="'Enunciat' + pregunta.id">
        <p>Respostes</p>
        <div :class="'respostes'+pregunta.id" v-for="(resposta, index) in updatePreguntaData.respostes" class="resposta">  
          <input  type="text" :name="index +'resposta' + pregunta.id" :id="index + 'resposta' + pregunta.id" :value="resposta" v-model="updatePreguntaData.respostes[index]">
          <label :for="index+'radio'+pregunta.id">Correcta?</label>
          <input type="radio" :name="'radio'+pregunta.id" :id="index+'radio'+pregunta.id" :value="index" v-if="index==updatePreguntaData.correcta" v-model="updatePreguntaData.correcta" checked>
          <input type="radio" :name="'radio'+pregunta.id" :id="index+'radio'+pregunta.id" :value="index" v-else v-model="updatePreguntaData.correcta">

        </div>
        <label :for="'imatge'+pregunta.id">Imatge</label>
        <input type="text" :name="'imatge'+pregunta.id" :id="'imatge'+pregunta.id" :value="updatePreguntaData.imatge">
        <button @click="callUpdate(pregunta.id)">Enviar</button>
        <button @click="changeModifyState(pregunta.id)">Cancela</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { findAllPreguntes } from "../communicationManager";
import { deletePregunta, createPregunta, getPregunta, updatePregunta } from "../communicationManager";
import { ref, reactive, onMounted } from "vue";

// Variable reactiva per emmagatzemar les preguntes
const preguntes = ref("");
// Variable per mostrar o amagar el formulari
const show = ref(false);
// Objecte reactiu per emmagatzemar la nova pregunta
const newPregunta = reactive({
  pregunta: "",
  respostes: ["", "", "", ""],
  correcta: "",
  imatge: ""
});

const updatePreguntaData = reactive({
  pregunta: "",
  respostes: ["", "", "", ""],
  correcta: "",
  imatge: ""
});

const modify = reactive({
  modifies:[]
});
// Funció per esborrar una pregunta
const callDelete = async (id) => {
  const data = await deletePregunta(id);
  preguntes.value = await callfindAllPreguntes();
};

// Funció per obtenir totes les preguntes
const callfindAllPreguntes = async () => {
  const data = await findAllPreguntes();
  modify.modifies = [];
  data.forEach(pregunta => {
    modify.modifies.push({id: pregunta.id, modify: false});
  });
  return data;
};

// Funció per crear una nova pregunta
const callCreatePregunta = async () => {
  const data = await createPregunta(newPregunta);
  preguntes.value = await callfindAllPreguntes();
  show.value = false;
  return data;
};

const changeModifyState = (id) => {
  modify.modifies.forEach(item => {
    if(item.id == id){
      item.modify = !item.modify;
      if(item.modify){
        preguntes.value.forEach( async (pregunta) => {
          if(pregunta.id == id){
            let auxData= await callGetPregunta(id);
            console.log('dis',auxData.respostes);
            updatePreguntaData.pregunta = auxData.pregunta;
            updatePreguntaData.respostes = auxData.respostes;
            updatePreguntaData.correcta = auxData.resposta_correcta;
            updatePreguntaData.imatge = auxData.imatge;
          }
        });
      }
    } else {
      item.modify = false;
    }
  });
};

const callGetPregunta = async (id) => {
  const data = await getPregunta(id);
  console.log('data',data);
  return data;
};

const checkModifies = (id) => {
  let check = false;
  modify.modifies.forEach(modify => {
    if(modify.id == id){
      check = modify.modify;
    }
  });
  return check;
};

const callUpdate = async (id) => {
  await updatePregunta(id, updatePreguntaData);
  preguntes.value = await callfindAllPreguntes();
  modify.modifies.forEach(modify => {
      modify.modify = false;
  });
};

// Funció que s'executa quan el component es munta
onMounted(async () => {
  preguntes.value = await callfindAllPreguntes();
});
</script>

<style>

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.respostes {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.correcta{
  background-color: green;
}
.table{
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}
.table>div{
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
img{
  display: block;
  margin: 0 auto;
  width: 50%
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

div {
  margin: 20px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin: 5px 0;
}

button:hover {
  background-color: #0056b3;
}

form {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input[type="radio"] {
  margin-right: 10px;
}

h2 {
  color: #333;
}

.table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.table div {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.respostes p {
  margin: 5px 0;
}

.correcta {
  background-color: #d4edda;
  color: #155724;
  padding: 5px;
  border-radius: 3px;
}

.option {
  background-color: #f8d7da;
  color: #721c24;
  padding: 5px;
  border-radius: 3px;
}

</style>
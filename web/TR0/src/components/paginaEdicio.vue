<template>
  <div>
    <!-- Botó per mostrar o amagar el formulari -->
    <button @click="show = !show">Mostrar</button>
  </div>
  <!-- Formulari per afegir una nova pregunta -->
  <div v-if=show>
    <h2>Afegir Pregunta</h2>
    <form action="">
      <label for="Enunciat">Enunciat</label>
      <input v-model="newPregunta.pregunta" type="text" name="pregunta" id="Enunciat">
      <div class="grid">
        <div>
          <h2>Respostes</h2>
          <!-- Inputs per les respostes -->
          <input v-for="(resposta, index) in newPregunta.respostes" v-model="newPregunta.respostes[index]" type="text" :name="'resposta'+index" :id="'resposta'+index">
        </div>
        <div>
          <h2>Correcta</h2>
          <!-- Inputs per seleccionar la resposta correcta -->
          <input v-for="(resposta, index) in newPregunta.respostes" type="radio" name="correcta" :id="'radio'+index" :value="index" v-model="newPregunta.correcta">
        </div>
      </div>
      <label for="imatge">Imatge (En link)</label>
      <input v-model="newPregunta.imatge" type="text" name="imatge" id="imatge">
      <!-- Botó per afegir la nova pregunta -->
      <button @click="callCreatePregunta">Afegir</button>
    </form>
  </div>
  <!-- Llista de preguntes existents -->
  <div v-if=!show>
    <div v-for="pregunta in preguntes">
      <div v-if="!checkModifies(pregunta.id)">
        <p>{{ pregunta.pregunta }}</p>
        <div class="respostes">
          <p v-for="resposta in pregunta.respostes">{{ resposta }}</p>
        </div>
        <button @click="changeModifyState(pregunta.id)">Editar</button>
        <!-- Botó per esborrar una pregunta -->
        <button @click="callDelete(pregunta.id)">Esborrar</button>
      </div>
      <div v-else>
        <label :for="'Enunciat' + pregunta.id">Enunciat</label>
        <input v-model="updatePreguntaData.pregunta" type="text" :name="'pregunta' + pregunta.id" :id="'Enunciat' + pregunta.id">
        <p>Respostes</p>
        <div :class="'respostes'+pregunta.id" v-for="(resposta, index) in updatePreguntaData.respostes">  
          <input  type="text" :name="index +'resposta' + pregunta.id" :id="index + 'resposta' + pregunta.id" :value="resposta" v-model="updatePreguntaData.respostes[index]">
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

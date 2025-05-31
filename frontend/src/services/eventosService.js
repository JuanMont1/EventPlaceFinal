
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const guardarEventoPasado = async (evento) => {
  try {
    const docRef = await addDoc(collection(db, 'eventosPasados'), evento);
    console.log("Evento guardado en eventos pasados con ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error al guardar el evento en eventos pasados: ", e);
    throw e;
  }
};
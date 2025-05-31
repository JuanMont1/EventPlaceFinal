import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const getEventos = async () => {
  const eventosCollection = collection(db, 'eventos');
  const snapshot = await getDocs(eventosCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addEvento = async (evento) => {
  const eventosCollection = collection(db, 'eventos');
  return await addDoc(eventosCollection, evento);
};

export const updateEvento = async (id, evento) => {
  const eventoRef = doc(db, 'eventos', id);
  await updateDoc(eventoRef, evento);
};

export const deleteEvento = async (id) => {
  await deleteDoc(doc(db, 'eventos', id));
};

export const eliminarSuscripcionesDeUsuarios = async (eventoId) => {
  // Implementa esta función según tus necesidades
};
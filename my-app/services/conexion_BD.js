// Importar Firebase
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyAkGEtNRu-nk3wR87KqW0L96u1cLISixIc",
  authDomain: "recetas-perfectas-32438.firebaseapp.com",
  databaseURL: "https://recetas-perfectas-32438-default-rtdb.firebaseio.com",
  projectId: "recetas-perfectas-32438",
  storageBucket: "recetas-perfectas-32438.firebasestorage.app",
  messagingSenderId: "905357265813",
  appId: "1:905357265813:web:61a6096bceb2fcb9b1449c",
  measurementId: "G-8CZJG2T67G"
};

// Inicializar Firebase y DB
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);


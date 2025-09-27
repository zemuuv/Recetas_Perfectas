import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Image, Alert } from "react-native";
import { ref, push, onValue, remove } from "firebase/database";
import { database } from "../services/conexion_BD"; 
import Styles from "../Styles"; // 👈 estilos globales

export default function NuevaRecetaScreen() {
  const [titulo, setTitulo] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [imagen, setImagen] = useState("");
  const [recetas, setRecetas] = useState([]);

  // Escuchar recetas en tiempo real
  useEffect(() => {
    const recetasRef = ref(database, "recetas");
    const unsubscribe = onValue(recetasRef, (snapshot) => {
      const data = snapshot.val() || {};
      const lista = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setRecetas(lista);
    });

    return () => unsubscribe();
  }, []);

  // Guardar receta en Firebase
  const guardarReceta = () => {
    if (titulo.trim() === "" || ingredientes.trim() === "" || instrucciones.trim() === "") {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    const recetasRef = ref(database, "recetas");
    push(recetasRef, {
      titulo,
      ingredientes,
      instrucciones,
      imagen: imagen || "https://via.placeholder.com/150",
      fecha: new Date().toISOString(),
    });

    setTitulo("");
    setIngredientes("");
    setInstrucciones("");
    setImagen("");
  };

  // Eliminar receta
  const eliminarReceta = (id) => {
    remove(ref(database, `recetas/${id}`));
  };

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Nueva Receta</Text>

      {/* 🔹 Contenedor blanco para los inputs */}
      <View style={Styles.whiteContainer}>
        <TextInput
          style={Styles.inputBox}
          placeholder="Título de la receta"
          placeholderTextColor="#888"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={Styles.inputBox}
          placeholder="Ingredientes"
          placeholderTextColor="#888"
          value={ingredientes}
          onChangeText={setIngredientes}
          multiline
        />
        <TextInput
          style={Styles.inputBox}
          placeholder="Instrucciones"
          placeholderTextColor="#888"
          value={instrucciones}
          onChangeText={setInstrucciones}
          multiline
        />        
      </View>

      <Button title="Guardar Receta" onPress={guardarReceta} />

      <FlatList
        data={recetas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={Styles.recipeCard}>
            <Text style={Styles.recipeTitle}>{item.titulo}</Text>
            <Image source={{ uri: item.imagen }} style={Styles.recipeImage} />
            <Text style={Styles.recipeText}>🥗 Ingredientes: {item.ingredientes}</Text>
            <Text style={Styles.recipeText}>📖 Instrucciones: {item.instrucciones}</Text>
            <Button title="Eliminar" color="#FF6347" onPress={() => eliminarReceta(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

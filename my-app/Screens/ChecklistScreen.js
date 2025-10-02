import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { ref, push, onValue, update, remove } from "firebase/database";
import { database } from "../services/conexion_BD";

export default function ShoppingListScreen() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const itemsRef = ref(database, "shopping"); // nodo en Firebase
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const parsed = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name,
          checked: data[key].checked,
        }));
        setItems(parsed);
      } else {
        setItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Agregar ítem a Firebase
  const addItem = () => {
    if (!newItem.trim()) return;
    const itemsRef = ref(database, "shopping");
    push(itemsRef, {
      name: newItem,
      checked: false,
    });
    setNewItem("");
  };

  // Cambiar estado del check en Firebase
  const toggleCheck = (id, checked) => {
    const itemRef = ref(database, `shopping/${id}`);
    update(itemRef, { checked });
  };

  // Eliminar ítem en Firebase
  const deleteItem = (id) => {
    const itemRef = ref(database, `shopping/${id}`);
    remove(itemRef);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Lista de Compras</Text>

      {/* Input para agregar */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Agregar producto..."
          value={newItem}
          onChangeText={setNewItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={{ color: "#fff" }}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Checkbox
              value={!!item.checked}
              onValueChange={(val) => toggleCheck(item.id, val)}
              color={item.checked ? "#4caf50" : undefined}
            />
            <Text style={[styles.itemText, item.checked && styles.checkedText]}>
              {item.name}
            </Text>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Text style={styles.delete}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  inputRow: { flexDirection: "row", marginBottom: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
  addButton: { marginLeft: 10, backgroundColor: "#4caf50", padding: 10, borderRadius: 8 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 5,
  },
  itemText: { marginLeft: 10, flex: 1 },
  checkedText: { textDecorationLine: "line-through", color: "gray" },
  delete: { marginLeft: 10, fontSize: 16, color: "red" },
});
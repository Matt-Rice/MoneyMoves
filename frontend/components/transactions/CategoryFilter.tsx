import { View, Text, StyleSheet, Pressable } from "react-native";

interface CategoryFilterProps {
  category: string[];              // currently selected categories
  setCategory: (val: string[]) => void;
  allCategories: string[];         // all checkbox options
}

export default function CategoryFilter({
  category,
  setCategory,
  allCategories,
}: CategoryFilterProps) {

  const toggleCategory = (cat: string) => {
    if (category.includes(cat)) {
      setCategory(category.filter(c => c !== cat));
    } else {
      setCategory([...category, cat]);
    }
  };

  return (
    <View style={styles.container}>
      {allCategories.map(cat => {
        const selected = category.includes(cat);

        return (
          <Pressable
            key={cat}
            onPress={() => toggleCategory(cat)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 6,
              marginRight: 8,
              marginBottom: 6,
              borderWidth: 1,
              borderColor: selected ? "#007AFF" : "#ccc",
              borderRadius: 6,
              backgroundColor: selected ? "#E0F0FF" : "#fff",
            }}
          >
            <Text style={{ marginRight: 4 }}>
              {selected ? "✓" : ""}
            </Text>
            <Text>{cat}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
container:{
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10
  },

});
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { ShoppingCart, Plus, Check, Trash2, X } from "lucide-react-native";

import Header from "./components/Header";

const initialGroceryItems = [
  { id: 1, name: "Oatmeal", category: "Grains", checked: false },
  { id: 2, name: "Mixed Berries", category: "Fruits", checked: false },
  { id: 3, name: "Honey", category: "Sweeteners", checked: true },
  { id: 4, name: "Quinoa", category: "Grains", checked: false },
  { id: 5, name: "Chickpeas", category: "Legumes", checked: true },
  { id: 6, name: "Cucumber", category: "Vegetables", checked: false },
  { id: 7, name: "Tomatoes", category: "Vegetables", checked: false },
  { id: 8, name: "Feta Cheese", category: "Dairy", checked: false },
  { id: 9, name: "Olive Oil", category: "Oils", checked: true },
  { id: 10, name: "Salmon", category: "Protein", checked: false },
  { id: 11, name: "Brown Rice", category: "Grains", checked: false },
  { id: 12, name: "Greek Yogurt", category: "Dairy", checked: false },
  { id: 13, name: "Granola", category: "Grains", checked: false },
  { id: 14, name: "Nuts", category: "Snacks", checked: false },
  { id: 15, name: "Lentils", category: "Legumes", checked: false },
];

const categories = [
  "All",
  "Fruits",
  "Vegetables",
  "Grains",
  "Protein",
  "Dairy",
  "Legumes",
  "Oils",
  "Sweeteners",
  "Snacks",
];

export default function GroceryList() {
  const router = useRouter();
  const [groceryItems, setGroceryItems] = useState(initialGroceryItems);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Fruits");
  const [showAddItem, setShowAddItem] = useState(false);

  const handleCategorySelect = (category : string) => {
    setSelectedCategory(category);
  };

  const handleToggleCheck = (id : number) => {
    setGroceryItems(
      groceryItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleDeleteItem = (id: number) => {
    setGroceryItems(groceryItems.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    if (newItemName.trim() === "") return;

    const newItem = {
      id: Date.now(),
      name: newItemName.trim(),
      category: newItemCategory,
      checked: false,
    };

    setGroceryItems([...groceryItems, newItem]);
    setNewItemName("");
    setShowAddItem(false);
  };

  const filteredItems = groceryItems.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory,
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      {/* <Header title="Grocery List" showBackButton={true} /> */}
      <View className="px-4 py-2 bg-green-50 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <ShoppingCart size={20} color="#16a34a" />
          <Text className="ml-2 text-green-700 font-semibold">
            Shopping List
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowAddItem(!showAddItem)}
          className="flex-row items-center bg-green-600 px-3 py-1 rounded-full"
        >
          {showAddItem ? (
            <>
              <X size={16} color="white" />
              <Text className="text-white ml-1 font-medium text-sm">
                Cancel
              </Text>
            </>
          ) : (
            <>
              <Plus size={16} color="white" />
              <Text className="text-white ml-1 font-medium text-sm">
                Add Item
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {showAddItem && (
        <View className="px-4 py-3 bg-white border-b border-gray-200">
          <View className="flex-row items-center mb-2">
            <TextInput
              value={newItemName}
              onChangeText={setNewItemName}
              placeholder="Enter item name"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2"
            />
            <TouchableOpacity
              onPress={handleAddItem}
              className="bg-green-600 p-2 rounded-md"
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-1"
          >
            {categories.slice(1).map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setNewItemCategory(category)}
                className={`px-3 py-1 mr-2 rounded-full  ${newItemCategory === category ? "bg-green-600" : "bg-gray-200"}`}
              >
                <Text
                  className={`text-sm ${newItemCategory === category ? "text-white" : "text-gray-700"}`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white py-2 container"
        style={{ flexGrow: 0 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => handleCategorySelect(category)}
            className={`px-4 py-1 mx-1 rounded-xl rounded-xl w-[110px] h-[40px] items-center justify-center ${selectedCategory === category ? "bg-green-600" : "bg-gray-200"}`}
          >
            <Text
              className={`font-medium ${selectedCategory === category ? "text-white" : "text-gray-700"}`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView className="flex-1 bg-gray-100 p-4 mb-4">
        {filteredItems.length === 0 ? (
          <View className="bg-white rounded-xl p-8 items-center justify-center">
            <Text className="text-gray-500 text-center">
              No items in this category. Add some items to your grocery list!
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row justify-between items-center"
            >
              <TouchableOpacity
                onPress={() => handleToggleCheck(item.id)}
                className="flex-row items-center flex-1"
              >
                <View
                  className={`w-6 h-6 rounded-md mr-3 items-center justify-center ${item.checked ? "bg-green-500" : "border border-gray-300"}`}
                >
                  {item.checked && <Check size={16} color="white" />}
                </View>
                <View>
                  <Text
                    className={`text-base ${item.checked ? "text-gray-400 line-through" : "text-gray-800"}`}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xs text-gray-500">{item.category}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteItem(item.id)}
                className="p-2"
              >
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

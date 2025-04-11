import { create } from "zustand";

export interface ListGroceryTotal {
    total: number;
    checkedItems: number;
    setTotal: (newTotal: number) => void;
    setCheckedItems: (count: number) => void;
    incrementChecked: () => void;
    decrementChecked: () => void;
}

export const useTotalGroceryListStore = create<ListGroceryTotal>() (
    (set, get) => ({
        total: 0,
        checkedItems: 0,
        setTotal: (newTotal: number) => set({total: newTotal}),
        setCheckedItems: (count) => set({ checkedItems: count }),
        incrementChecked: () => set((state) => ({ checkedItems: state.checkedItems + 1 })),
        decrementChecked: () => set((state) => ({ checkedItems: state.checkedItems - 1 })),
    })
)
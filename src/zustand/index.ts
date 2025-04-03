import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DataType {
  id: string;
  text: string;
}

interface StoreState {
  data: DataType[];
  addData: (newItem: DataType) => void;
  removeData: (id: DataType) => void;
  editData: (id: string, newText: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      data: [],
      addData: (newItem) => {
        set({ data: [...get().data, newItem] });
      },
      removeData: (id) => {
        set({ data: get().data.filter((item: DataType) => item.id !== id) });
      },
      editData: (id, newText) => {
        set({
          data: get().data.map((item) =>
            item.id === id ? { ...item, text: newText } : item
          ),
        });
      },
    }),
    {
      name: "todo-storage",
    }
  )
);

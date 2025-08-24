import { apiFetch } from "@/lib/middleware/clientAuth";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useItemListStore = create<ItemListState>()(
    devtools((set, get) => ({
        personalItemList: [],
        teamItemList: [],

        setPersonalItemList: (itemList: personalItem[]) =>
            set(() => ({
                personalItemList: itemList,
            })),

        setTeamItemList: (itemList: teamItem[]) =>
            set(() => ({
                teamItemList: itemList,
            })),
        addNewItemToDB: async (newItem: Item) => {
            await apiFetch('/item', {
                method: "POST",
                body: JSON.stringify({
                    newItem: newItem,
                }),
            })
            return;
        },
        getPersonalItemList: async () => {
            const state = get();
            const dataJson = await apiFetch<Item[]>('/item/list', {
                method: "POST",
                body: JSON.stringify({
                    idArray: state.personalItemList.map((p) => p.itemId),
                })
            })
            const rowData = dataJson.map(d => ({
                ...d,
                ...state.personalItemList.find(p => p.itemId === d.id)
            }));
            return rowData;
        },
        getTeamItemList: async () => {
            const state = get();
            const dataJson = await apiFetch<Item[]>('/item/list', {
                method: "POST",
                body: JSON.stringify({
                    idArray: state.teamItemList.map((p) => p.itemId),
                })
            })
            const rowData = dataJson.map(d => ({
                ...d,
                ...state.teamItemList.find(p => p.itemId === d.id)
            }));
            return rowData;
        }
    }), {
        name: "itemList"
    })
)
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
            const accessToken = localStorage.getItem("access_token");
            await fetch("/api/item", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    newItem: newItem,
                }),
            });
            return;
        },
        getPersonalItemList: async () => {
            const state = get();
            const accessToken = localStorage.getItem('access_token');
            const res = await fetch('/api/item/list', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    idArray: state.personalItemList.map((p) => p.itemId),
                }),
            })
            const dataJson: Item[] = await res.json();
            const rowData = dataJson.map(d => ({
                ...d,
                ...state.personalItemList.find(p => p.itemId === d.id)
            }));
            return rowData;
        },
        getTeamItemList: async () => {
            const state = get();
            const accessToken = localStorage.getItem('access_token');
            const res = await fetch('/api/item/list', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    idArray: state.teamItemList.map((p) => p.itemId),
                }),
            })
            const dataJson: Item[] = await res.json();
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
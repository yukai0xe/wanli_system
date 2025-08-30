declare global {
    type personalItem = {
        itemId: string,
        required: boolean,
        quantity: string
    }

    type teamItem = {
        itemId: string,
        quantity: string,
        ownerId: string,
    }

    interface ItemListState {
        personalItemList: personalItem[],
        teamItemList: teamItem[],
        setPersonalItemList: (items: personalItem[]) => void;
        setTeamItemList: (items: teamItem[]) => void;
        getPersonalItemList: () => RowData[];
        getTeamItemList: () => (Item & teamItem)[];
        addNewItemToDB: (newItem: item) => void;
    }
}

export {}
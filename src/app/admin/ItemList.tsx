import React, { useState, useEffect } from "react";
import EditableTable from "@/app/components/table/editTable";
import { personalIteamListFakeData as pItemfake, teamItemListFakeData as tItemfake } from "@/lib/viewModel/tableData";
import {
  HiEllipsisHorizontal,
  HiSquaresPlus,
  HiArrowDownTray,
} from "react-icons/hi2";
import { AddNewItem, GetItemFromDB } from "@/app/components/dialog/ItemDialog";
import { useRouter } from "next/navigation";
import { usePlanTeamStore } from "@/state/planTeamStore";
import { useItemListStore } from "@/state/ItemListStore";
import { ItemType } from "@/types/enum";


const keyOrder = [...new Set([...pItemfake.keyOrder, ...tItemfake.keyOrder])];
const sortHeaderRule = (data: EditableRowHeader[]) => {
  return keyOrder
    .map((key) => data.find((h) => h.key === key))
    .filter((h): h is EditableRowHeader => !!h);
};
const sortDataRule = (data: RowData[]) => {
  return data.map((row) => {
    const sortedRow: RowData = { id: row.id };
    keyOrder.forEach((key) => {
      if (key in row) sortedRow[key] = row[key];
    });
    return sortedRow;
  });
};

enum EventType {
  createNewItem = "新增裝備",
  getItemFromDB = "從記錄抓取",
  exportItemsAsDocs = "匯出裝備清單 (.docs)"
}

const ItemListTable: React.FC<{
  isTeam?: boolean
}> = ({ isTeam=false }) => {
  const [q, setQ] = useState("");
  const [groupData, setGroupData] = useState<groupData>({});
  const [showBtn, setShowBtn] = useState<boolean>(false);
  const [itemsFromDB, setItemsFromDB] = useState<Item[]>([]);
  const [eventType, setEventType] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const teamId = usePlanTeamStore((state) => state.id);
  const [loading, setLoading] = useState(true);
  const {
    addNewItemToDB,
    getTeamItemList,
    getPersonalItemList,
    setPersonalItemList,
    setTeamItemList,
    personalItemList,
    teamItemList
  } = useItemListStore();
  const rowsSortingProp = isTeam ?
    sortHeaderRule(tItemfake.rowsHeader) :
    sortHeaderRule(pItemfake.rowsHeader);


  useEffect(() => {
    const gdata: groupData = {};
    async function fetchData() {
      setLoading(true);
      const rowData = isTeam ? await getTeamItemList() : await getPersonalItemList();
      const sortedData = sortDataRule(rowData);
      sortedData.forEach((data) => {
        if ("type" in data && (typeof data.type === "string" || typeof data.type === "number")) {
          if (!(data.type in gdata)) {
            gdata[data.type] = { data: [], isOpen: true };
          }
          gdata[data.type].data.push(data);
        }
      });
      setGroupData(gdata);
      setLoading(false);
    }
    fetchData();
  }, [personalItemList, teamItemList]);

  const openHandler = (type: string) => {
    setShowBtn(false);
    setOpen(true);
    setEventType(type);

    if (type === EventType.getItemFromDB) {
      getItemsFromDB();
    }
  }
  const closeHandler = () => {
    setOpen(false);
  }

  const getItemsFromDB = async () => {
    const accessToken = localStorage.getItem('access_token');
    fetch('/api/item', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setItemsFromDB(data)
      });
  }

  const addNewItemsFromDB = (itemIds: Set<string>) => {
    if (isTeam) {
      setTeamItemList([
        ...teamItemList,
        ...Array.from(itemIds).map(itemId => ({
          itemId,
          ownerId: "",
          quantity: "適量"
        }))
      ])
    }
    else {
      setPersonalItemList([
        ...personalItemList,
        ...Array.from(itemIds).map((itemId) => ({
          itemId,
          required: true,
          quantity: "適量",
        })),
      ]);
    }
    closeHandler();
  }

  const addNewItem = (newItem: Item) => {
    addNewItemToDB(newItem);
    if (isTeam) {
      const { id, quantity } = newItem;
      setTeamItemList([
        ...teamItemList,
        { itemId: id, quantity: quantity || "適量", ownerId: "" },
      ]);
    } else {
      const { id, required, quantity } = newItem;
      setPersonalItemList([
        ...personalItemList,
        { itemId: id, required: required || true, quantity: quantity || "適量" },
      ]);
    }
    closeHandler();
  }

  const renderDialog = () => {
    switch (eventType) {
      case EventType.createNewItem:
        return (
          <AddNewItem
            open={open}
            isTeam={isTeam}
            handleClose={closeHandler}
            handleConfirm={(newItem: Item) => addNewItem(newItem)}
          />
        )
      case EventType.getItemFromDB:
        return (
          <GetItemFromDB
            open={open}
            data={itemsFromDB}
            handleClose={closeHandler}
            handleConfirm={(ids: Set<string>) => addNewItemsFromDB(ids)}
          />
        )
      case EventType.exportItemsAsDocs:
        return (
          <></>
        )
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="relative min-h-96 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* <h1 className="text-xl font-semibold tracking-tight">使用者清單</h1> */}
          <div className="w-1/2 flex items-end gap-x-2">
            {isTeam && (
              <button
                className="px-3 py-1 rounded bg-amber-200 text-gray-800 hover:bg-amber-300"
                onClick={() =>
                  router.push(`/admin/myTeam/${teamId}/finalCheck/allocation`)
                }
              >
                公裝分配
              </button>
            )}
            <div className="mt-4 text-xs text-gray-500">
              提示：點右側「三個點的符號」可以新增裝備
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-end gap-3">
            <div className="flex gap-x-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜尋裝備名稱"
                className="w-64 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none ring-0 focus:border-gray-400 focus:outline-none focus:ring-0"
              />
              <div className="relative">
                <HiEllipsisHorizontal
                  className={`size-8 cursor-pointer hover:bg-gray-100 rounded ${
                    showBtn && "bg-gray-200"
                  }`}
                  onClick={() => setShowBtn(!showBtn)}
                />
                {showBtn && (
                  <div className="absolute top-10 right-0 flex flex-col gap-2 text-left w-64 bg-white rounded shadow-2xl">
                    <button
                      className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition"
                      onClick={() => openHandler(EventType.createNewItem)}
                    >
                      <HiSquaresPlus className="size-6 hover:text-slate-700 transition" />
                      {EventType.createNewItem}
                    </button>
                    <button
                      className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition"
                      onClick={() => openHandler(EventType.getItemFromDB)}
                    >
                      <HiSquaresPlus className="size-6 hover:text-slate-700 transition" />
                      {EventType.getItemFromDB}
                    </button>
                    <button
                      className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition"
                      onClick={() => {}}
                    >
                      <HiArrowDownTray className="size-6 hover:text-slate-700 transition" />
                      {EventType.exportItemsAsDocs}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded">
            <div className="flex flex-col items-center">
              <div className="loader mb-2"></div>
              <p className="text-gray-600 text-sm">資料加載中...</p>
            </div>
          </div>
        ) : Object.entries(groupData).length === 0 ? (
          <div className="text-xl min-h-96 flex w-full justify-center items-center">
            沒有任何裝備
          </div>
        ) : (
          Object.entries(groupData).map(([key, object], idx) => {
            return (
              <div key={idx} className="mb-5">
                <h3 className="text-xl pb-2">
                  {(ItemType as Record<string, string>)[key]}
                  <span
                    onClick={() => {
                      setGroupData({
                        ...groupData,
                        [key]: {
                          ...object,
                          isOpen: !object.isOpen,
                        },
                      });
                    }}
                    className="cursor-pointer"
                  >
                    {" "}
                    {object.isOpen ? "▲" : "▼"}
                  </span>
                </h3>
                {object.isOpen && (
                  <EditableTable
                    rowsSortingProp={rowsSortingProp}
                    dataSortingProp={object.data}
                    q={q}
                  />
                )}
                <div className="flex justify-end">
                  {rowsSortingProp.map((r) =>
                    r.calc
                      ? r.calc.map((v) => (
                          <span
                            key={`${idx}-${key}`}
                            className="text-sm text-gray-600"
                          >
                            {v.label}: {v.f(object.data)}
                          </span>
                        ))
                      : null
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      {open && renderDialog()}
    </div>
  );
};

export default ItemListTable;

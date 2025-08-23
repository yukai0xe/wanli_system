import { ItemColumn } from "@/types/enum";
import DialogComponent from ".";
import InputComponent from "@/app/components/form/input";
import { useEffect, useState } from "react";
import SelectableTable from "@/app/components/table/selectTable";
import { uuidToNumericId } from "@/lib/utility";
import { ItemType } from "@/types/enum";

const AddNewItem: React.FC<{
  open: boolean;
  isTeam: boolean;  
  handleClose: () => void;
  handleConfirm: (newItem: Item) => void;
}> = ({ open, isTeam, handleClose, handleConfirm }) => {
  const [addDescription, setAddDescription] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<Item>({
    id: "eq_" + uuidToNumericId(),
    name: "",
    description: "",
    type: "Other" as ItemType,
    weight: 100,
    quantity: "適量"
  });

    return (
      <DialogComponent
        title="新增裝備"
        open={open}
        handleClose={() => {
          handleClose();
        }}
        handleConfirm={() => {
          handleConfirm(newItem);
          handleClose();
        }}
        button={{
          cancel: "取消",
          confirm: "新增",
        }}
      >
        <InputComponent
          direction
          label={ItemColumn.name}
          input={{ type: "text" }}
          value={newItem?.name}
          placeholder={`輸入${ItemColumn.name}`}
          inputChangeHandler={(v: string) => {
            setNewItem({ ...newItem, name: v });
          }}
        />
        {Object.entries(ItemColumn).map(([, value], idx) => {
          switch (value) {
            case ItemColumn.type:
              return (
                <InputComponent
                  direction
                  key={idx}
                  label={value}
                  value={newItem?.type}
                  input={{
                    type: "select",
                    value: Object.entries(
                      ItemType
                    ).map(([key, value]) => {
                      return {
                        label: value,
                        value: key,
                      };
                    }),
                  }}
                  inputChangeHandler={(v: string) => {
                    setNewItem({
                      ...newItem,
                      type: v as ItemType
                    });
                  }}
                />
              );
            case ItemColumn.required:
              return (
                !isTeam && (
                  <InputComponent
                    direction
                    key={idx}
                    label={value}
                    value={!!newItem.required}
                    input={{ type: "checkbox" }}
                    inputChangeHandler={(v: string) => {
                      setNewItem({ ...newItem, required: v === "true" });
                    }}
                  />
                )
              );

            case ItemColumn.quantity:
              return (
                <InputComponent
                  direction
                  key={idx}
                  label={value}
                  value={newItem?.quantity}
                  placeholder={`輸入${value}`}
                  input={{ type: "text" }}
                  inputChangeHandler={(v: string) => {
                    setNewItem({ ...newItem, quantity: v });
                  }}
                />
              );
            case ItemColumn.weight:
              return (
                (
                  <InputComponent
                    direction
                    key={idx}
                    label={value}
                    value={newItem?.weight}
                    placeholder={`輸入${value}${"(g)"}`}
                    input={{ type: "number" }}
                    inputChangeHandler={(v: string) => {
                      setNewItem({ ...newItem, weight: Number(v) });
                    }}
                  />
                )
              );
          }
        })}
        {!addDescription ? (
        <div className="mt-2 flex gap-x-3 items-center justify-between text-sm/6 font-medium text-gray-900">
            <label>{ItemColumn.description}</label>
                <button
                    className="px-3 py-1 rounded bg-amber-500 text-gray-800 hover:bg-amber-600"
                    onClick={() => setAddDescription(true)}
                >
                  增加敘述
                </button>
            </div>
        ) : (
            <div className="mt-2 flex flex-col gap-y-2 text-sm/6 font-medium text-gray-900">
                <label>{ItemColumn.description}</label>
              <textarea
                className="p-3"
                rows={10}
                value={newItem.description}
                placeholder={ItemColumn.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
        )}
      </DialogComponent>
    );
}

const GetItemFromDB: React.FC<{
  data: Item[]
  open: boolean;
  handleClose: () => void;
  handleConfirm: (ids: Set<string>) => void;
}> = ({ data, open, handleClose, handleConfirm }) => {

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const rowsheader = [ItemColumn.name, ItemColumn.weight, ItemColumn.type, ItemColumn.description];
  const rowsSortingProp: RowHeader[] = Object.entries(ItemColumn)
      .filter(([, label]) => rowsheader.includes(label))
      .map(([key, label]) => {
        return { key, label };
      });
    
  const itemTypeSet = new Set();
  const itemType: { label: string; value: string; }[] = [{
    label: "全部種類",
    value: "all"
  }];
  for (const d of data) {
    if (!itemTypeSet.has(d.type)) {
      itemTypeSet.add(d.type);
      itemType.push({
        label: (ItemType as Record<string, string>)[d.type],
        value: d.type.toString(),
      });
    }
  }
    
    const [dataSortingProp, setDataSortingProp] = useState<RowData[]>([]);
    useEffect(() => {
      if (filterType === "all") setDataSortingProp(data.map(d => ({ ...d })));
      else setDataSortingProp(data.filter(d => d.type === filterType).map(d => ({ ...d })));
    }, [filterType]);
  
  useEffect(() => {
    if (data.length != 0) {
      setDataSortingProp(data.map((d) => ({ ...d })));
      setLoading(false);
    } 
  }, [data])

    return (
      <DialogComponent
        title={"從記錄中加入裝備"}
        open={open}
        handleClose={handleClose}
        handleConfirm={() => {
          handleConfirm(selectedRows);
        }}
        button={{
          cancel: "取消",
          confirm: "加入裝備表",
        }}
      >
        <div className="w-full flex flex-col gap-y-3">
          <div className="w-full flex gap-x-3">
            <InputComponent
              nolabel
              direction
              value={search}
              input={{ type: "text" }}
              inputChangeHandler={(v: string) => setSearch(v)}
              placeholder="搜尋裝備名稱"
            />
            <InputComponent
              nolabel
              direction
              value={filterType}
              input={{
                type: "select",
                value: itemType,
              }}
              inputChangeHandler={(v) => setFilterType(v)}
            />
          </div>

          <div className="relative w-full min-h-[200px]">
              <SelectableTable
                rowsSortingProp={rowsSortingProp}
                dataSortingProp={dataSortingProp}
                search={search}
                selectedRows={selectedRows}
                onDataChange={(v: Set<string>) => setSelectedRows(new Set([...v]))}
              />

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded">
                  <div className="flex flex-col items-center">
                    <div className="loader mb-2"></div>
                    <p className="text-gray-600 text-sm">資料加載中...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
      </DialogComponent>
    );
};

export { AddNewItem, GetItemFromDB };
"use client";

import { useItemListStore } from "@/state/ItemListStore";
import { useState, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import type { DragEndEvent } from "@dnd-kit/core";
import { PiNotePencilFill } from "react-icons/pi";
import InputComponent from "@/app/components/form/input";
import { useRouter } from "next/navigation";
import { usePlanTeamStore } from "@/state/planTeamStore";

type Equipment = {
  id: string;
  name: string;
  weight: number;
  ownerId: string;
  quantity: string;
};

type Member = {
  id: string;
  name: string;
  items: Equipment[];
  maxWeight: number;
};

const renderWeight = (item: Equipment) => {
  if (item.quantity === "適量") {
    return ` ${item.weight}g`;
  } else {
    return `*${item.quantity}/${item.weight}g`;
  }
};

export default function AllocationPage() {
    const { team, setTeam } = usePlanTeamStore();
    const { teamItemList, getTeamItemList, setTeamItemList } = useItemListStore();
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [dragItem, setDragItem] = useState<Equipment | null>(null);
    const [splitItem, setSplitItem] = useState<Equipment | null>(null);
    const [memberId, setMemberId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const teamId = usePlanTeamStore(state => state.id);
    
    useEffect(() => {
      async function getEquipment() {
        const teamItemList: (Item & teamItem)[] = await getTeamItemList();
        setEquipment(teamItemList.map(item => ({
            id: item.id,
            name: item.name,
            weight: Number(item.weight),
            ownerId: item.ownerId,
            quantity: item.quantity
          })));
      }
        getEquipment();
    }, [])

      useEffect(() => {
        setLoading(true);
        const newMembers = team.members
          .map((m) => ({
            id: String(m.id),
            name: m.name,
            items: equipment.filter(
              (e) => e.ownerId.toString() === m.id?.toString()
            ),
            maxWeight: m.maxWeight || 1000,
            edit: false,
          }))
          .sort((a, b) => b.maxWeight - a.maxWeight);
        setMembers(newMembers);
        setLoading(false);
      }, [team.members, equipment, teamItemList]);
  
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const itemId = active.id;
      const sourceMemberId = active.data.current?.memberId || null;
      const targetMemberId = over.data.current?.memberId || null;

      if (sourceMemberId && targetMemberId) {
        const movedItem = members.find((m) => m.id === sourceMemberId)?.items.find(it => it.id === itemId);
        if (movedItem) {
          setTeamItemList(
            teamItemList.map((item) =>
              item.itemId === itemId
                ? {
                    itemId: movedItem!.id,
                    quantity: movedItem!.quantity,
                    ownerId: targetMemberId
                  }
                : item
            )
          );
          setEquipment((prev) =>
            prev.map((e) =>
              e.id === itemId
                ? {
                    ...e,
                    ownerId: targetMemberId,
                  }
                : e
            )
          );
        }
      }

      if(!sourceMemberId && targetMemberId) {
        const movedItem = equipment.find((e) => e.id === itemId);
        if (movedItem) {
          setEquipment((prev) => prev.map(e => (
            e.id === itemId ? {
              ...e,
              ownerId: targetMemberId
            } : e
          )));
          setTeamItemList(
            teamItemList.map((item) =>
              item.itemId === itemId
                ? {
                    itemId: movedItem!.id,
                    quantity: movedItem!.quantity,
                    ownerId: targetMemberId
                  }
                : { ...item }
            )
          );
        }
      }
      
      if (sourceMemberId && !targetMemberId) {
        const movedItem = members
          .find((m) => m.id === sourceMemberId)
          ?.items.find((it) => it.id === itemId);
        if (movedItem) {
          setEquipment((prev) =>
            prev.map((e) =>
              e.id === itemId
                ? {
                    ...e,
                    ownerId: "",
                  }
                : e
            )
          );
          setTeamItemList(
            teamItemList.map((item) =>
              item.itemId === movedItem!.id
                ? {
                    itemId: movedItem!.id,
                    quantity: movedItem!.quantity,
                    ownerId: "",
                  }
                : { ...item }
            )
          );
        }
      }  

      setDragItem(null);
    };

    const closeHandler = () => {
      setSplitItem(null);
      setMemberId(null);
      setDragItem(null);
    }

    const handleSplit = (
      item: Equipment,
      memberId: string | null,
      splitValues: string[]
    ) => {
      const splitByQuantity = !isNaN(Number(item.quantity));
      const newValues = splitValues.filter(sp => !isNaN(Number(sp)));
      if (newValues.length <= 1) return;
      if (!splitByQuantity && newValues.reduce((sum, v) => Number(v) + sum, 0) !== item.weight) return;
      if (splitByQuantity && newValues.reduce((sum, v) => Number(v) + sum, 0) !== Number(item.quantity)) return;
      const newItems: Equipment[] = [];
      
      for (let idx = 0; idx < newValues.length; idx++) {
        const numericValue = Number(newValues[idx]);
        if (splitByQuantity) {
          if (Number(item.quantity) < 1 || Number(item.quantity) <= numericValue || numericValue < 1) break;
          newItems.push({
            ...item,
            id: item.id + "_" + (idx + 1),
            weight: item.weight,
            quantity: numericValue.toString()
          });
        } else {
          if (item.weight < 0 || item.weight <= numericValue || numericValue < 0) break;
          newItems.push({
            ...item,
            id: item.id + "_" + (idx + 1),
            weight: numericValue,
          });
        }
      }
      if (memberId) {
        setTeamItemList([
          ...teamItemList.filter((it) => it.itemId !== item.id),
          ...newItems.map(newItem => ({
            itemId: newItem.id,
            ownerId: newItem.ownerId,
            quantity: newItem.quantity,
          }))
        ]);
      }

      setEquipment((prev) => [
        ...prev.filter((e) => e.id !== item.id),
        ...newItems,
      ]);
    };

    const handleMerge = (
        source: { memberId: string | null; itemId: string },
        target: { memberId: string | null; itemId: string }
    ) => {
      let sourceItem: Equipment | undefined;
      let targetItem: Equipment | undefined;

      // 取得 source item
      if (source.memberId) {
        const sourceMember = members.find((m) => m.id === source.memberId);
        sourceItem = sourceMember?.items.find((i) => i.id === source.itemId);
        if (!sourceItem) return;
      } else {
        sourceItem = equipment.find((i) => i.id === source.itemId);
        if (!sourceItem) return;
      }

      // 取得 target item
      if (target.memberId) {
        const targetMember = members.find((m) => m.id === target.memberId);
        targetItem = targetMember?.items.find((i) => i.id === target.itemId);
        if (!targetItem) return;
      } else {
        targetItem = equipment.find((i) => i.id === target.itemId);
        if (!targetItem) return;
      }

      let mergedItem: Equipment;
      if (isNaN(Number(sourceItem.quantity)) || isNaN(Number(targetItem.quantity))){
        mergedItem = {
          ...sourceItem,
          id: sourceItem.id + "_merged_" + targetItem.id,
          weight: sourceItem.weight + targetItem.weight,
        };
      } else {
        mergedItem = {
          ...sourceItem,
          id: sourceItem.id + "_merged_" + targetItem.id,
          weight: sourceItem.weight,
          quantity: (Number(sourceItem.quantity) + Number(targetItem.quantity)).toString()
        }
      }

      setTeamItemList([
        ...teamItemList.filter((it) => ![sourceItem.id, targetItem.id].includes(it.itemId)),
        {
          itemId: mergedItem.id,
          quantity: mergedItem.quantity,
          ownerId: mergedItem.ownerId ? source.memberId! : target.memberId!
        },
      ]);
      setEquipment((prev) => [
        ...prev.filter((eq) => ![sourceItem.id, targetItem.id].includes(eq.id)),
        mergedItem,
      ]);

      closeHandler();
    };
    

    return (
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToWindowEdges]}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => {
          const eq = equipment.find((e) => e.id === active.id);
          if (eq) setDragItem(eq);
        }}
      >
        <div className="flex flex-col w-full min-h-screen p-6 gap-6 bg-gray-100">
          <div>
            <div className="flex justify-between item-center">
              <h1 className="text-2xl font-bold mb-1">公裝分配</h1>
              <button
                className="px-4 py-2 rounded bg-amber-200 text-gray-800 hover:bg-amber-300"
                onClick={() =>
                  router.push(`/admin/myTeam/${teamId}/finalCheck?tab=2`)
                }
              >
                返回計劃書
              </button>
            </div>
            <div className="text-xs text-gray-500">
              提示：從右側公裝表拖曳到隊員上，對公裝右鍵可以將重量拆解、合併相同名稱的裝備
            </div>
          </div>
          <div className="flex gap-6 relative min-h-96">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded">
                <div className="flex flex-col items-center">
                  <div className="loader mb-2"></div>
                  <p className="text-gray-600 text-2xl">資料加載中...</p>
                </div>
              </div>
            ) : (
              <>
                {/* 左側成員 */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {members.length === 0 ? (
                    <div className="inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded">
                      <div className="flex flex-col items-center">
                        <p className="text-gray-600 text-2xl">
                          還沒有加入任何隊員
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {members.map((m) => (
                        <DroppableMember key={m.id} member={m} />
                      ))}
                    </>
                  )}
                </div>

                {/* 右側裝備清單 */}
                <DroppableEquipment
                  id="equipmentList"
                  items={equipment.filter((eq) => eq.ownerId.length === 0)}
                />
              </>
            )}
          </div>

          {/* 拖曳預覽 */}
          <DragOverlay>
            {dragItem && (
              <div className="p-2 border rounded bg-blue-200 shadow">
                {dragItem.name} ({dragItem.weight}g)
              </div>
            )}
          </DragOverlay>
        </div>
        {splitItem && (
          <SplitAndCombineDialog
            splitItem={splitItem}
            mergeCandidates={equipment.filter(
              (e) => e.name === splitItem.name && e.id !== splitItem.id
            )}
            mergeHandler={(id) =>
              handleMerge(
                { memberId: memberId, itemId: splitItem.id },
                {
                  memberId:
                    members.find((m) => m.items.some((it) => it.id === id))
                      ?.id || null,
                  itemId: id,
                }
              )
            }
            closeHandler={closeHandler}
            confirmHandler={(splitValue) => {
              handleSplit(splitItem, memberId, splitValue);
              closeHandler();
            }}
          />
        )}
      </DndContext>
    );

  function DroppableMember({ member }: { member: Member }) {
    const { setNodeRef, isOver } = useDroppable({
      id: member.id,
      data: { memberId: member.id },
    });
    const [editMember, setEditMember] = useState<{
      maxWeight: string;
      edit: boolean;
    }>({
      maxWeight: "",
      edit: false,
    });

    const totalWeight = member.items.reduce((sum, item) => {
      const weight = Number(item.weight || 0);
      const quantity = isNaN(Number(item.quantity)) ? 1 : Number(item.quantity);
      return sum + weight * quantity;
    }, 0);
    const isOverWeight = totalWeight > member.maxWeight;

    return (
      <div
        ref={setNodeRef}
        className={`relative p-4 rounded shadow flex flex-col transition
        ${
          editMember.edit
            ? "col-span-2 md:col-span-2 lg:col-span-2"
            : "col-span-1"
        } 
        ${
          isOverWeight
            ? "bg-red-100 border border-red-500 animate-shake"
            : isOver
            ? "bg-blue-50 border border-blue-300"
            : "bg-white"
        }
      `}
      >
        <PiNotePencilFill
          title="編輯內容"
          onClick={() => {
            console.log(member.id)
            if (editMember.edit) {
              console.log(editMember)
              setTeam({
                ...team,
                members: team.members.map((m) => {
                  return m.id?.toString() === member.id.toString()
                    ? { ...m, maxWeight: Number(editMember.maxWeight) }
                    : m;
                }),
              });
              console.log(team.members);
            }
            setEditMember({
              maxWeight: member.maxWeight.toString(),
              edit: !editMember.edit,
            });
          }}
          className={`cursor-pointer size-8 absolute top-0 right-0 
          hover:bg-gray-300 rounded duration-200 trasition p-1 mr-2 mt-2 ${
            editMember.edit && "bg-gray-300 rounded"
          }`}
        />
        <h3 className="font-semibold text-gray-700">{member.name}</h3>
        {!editMember.edit ? (
          <p className="text-sm text-gray-500">
            總重量: {totalWeight} g / 最大負重: {member.maxWeight} g
          </p>
        ) : (
          <InputComponent
            input={{ type: "text" }}
            direction
            value={editMember.maxWeight}
            label={"最大負重"}
            inputChangeHandler={(v: string) =>
              setEditMember({ ...editMember, maxWeight: v })
            }
          />
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {member.items.map((item) => (
            <DraggableTag key={item.id} item={item} mId={member.id} />
          ))}
          {member.items.length === 0 && (
            <span className="text-gray-400 text-sm">拖曳裝備到這裡</span>
          )}
        </div>
      </div>
    );
  }

  function DroppableEquipment({
    id,
    items,
  }: {
    id: string;
    items: Equipment[];
  }) {
    const { setNodeRef, isOver } = useDroppable({
      id,
      data: { type: "equipmentList" },
    });

    return (
      <div
        ref={setNodeRef}
        className={`w-1/5 bg-white p-4 rounded shadow transition ${
          isOver ? "bg-blue-50 border border-blue-300" : ""
        }`}
      >
        <h2 className="text-lg font-semibold mb-2">公裝表</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <DraggableTag
              key={item.id}
              item={item}
            />
          ))}
          {items.length === 0 && (
            <span className="text-gray-400 text-sm">沒有剩餘裝備</span>
          )}
        </div>
      </div>
    );
  }

  function DraggableTag({
    item,
    mId,
  }: {
    item: Equipment;
    mId?: string;
  }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: item.id,
        data: { memberId: mId || null },
      });

    const style = transform
      ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
      : undefined;
    
    

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={`relative flex items-center bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full cursor-grab ${
          isDragging ? "opacity-50" : ""
        }`}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setSplitItem(item);
          if (mId) setMemberId(mId);
        }}
      >
        <span>
          {item.name}{renderWeight(item)}
        </span>
      </div>
    );
  }
}

const SplitAndCombineDialog: React.FC<{
  splitItem: Equipment;
  mergeCandidates?: Equipment[];
  mergeHandler?: (targetId: string) => void;
  closeHandler: () => void;
  confirmHandler: (splitValue: string[]) => void;
}> = ({ splitItem, closeHandler, confirmHandler, mergeCandidates, mergeHandler }) => {
  const [splitValue, setSplitValue] = useState<string[]>(["", ""]);
  const [notSplitByQuantity, setNotSplitByQuantity] = useState<boolean>(false);
  const [invalid, setInvalid] = useState<boolean>(false);

  useEffect(() => {
    const sum = splitValue.filter((v) => !isNaN(Number(v))).reduce((sum, v) => sum + Number(v), 0);
    let result = false;
    if (notSplitByQuantity) result = splitItem.weight !== sum;
    else result = splitItem.weight * Number(splitItem.quantity) !== sum * splitItem.weight;
    setInvalid(result);
  }, [splitValue]);

  useEffect(() => {
    setNotSplitByQuantity(isNaN(Number(splitItem.quantity)));
  }, [])

  useEffect(() => {
    if (notSplitByQuantity) setSplitValue([(splitItem.weight).toString(), ""]);
    else setSplitValue([(Number(splitItem.quantity) - 1).toString(), "1"]);
  }, [notSplitByQuantity])

  const renderLastWeight = (value: number, idx: number) => {
    let lastWeight: number, currentWeight: number;
    const prefixSplitValue = splitValue
      .slice(0, idx)
      .filter((v) => !isNaN(Number(v)))
      .reduce((sum, v) => sum + Number(v), 0);
    
    if (notSplitByQuantity) {
      lastWeight = splitItem.weight - prefixSplitValue;
      currentWeight = value;
    }
    else {
      lastWeight = splitItem.weight * (Number(splitItem.quantity) - prefixSplitValue);
      currentWeight = value * splitItem.weight;
    }

    if (currentWeight > lastWeight) {
      const moreWeight = currentWeight - lastWeight;
      return (
        <div className="text-sm text-red-700">
          超出重量 ({moreWeight > 0 ? moreWeight : 0} g)
        </div>
      );
    }
    if (notSplitByQuantity) return null;
    return (
      <div className="text-sm text-gray-700">重量：{currentWeight} g</div>
    );
  }

  const addNewSplitItem = () => {
    const sum = splitValue
      .filter((v) => !isNaN(Number(v)))
      .reduce((sum, value) => sum + Number(value), 0);
    if (notSplitByQuantity) {
      const newValue =
        sum < splitItem.weight
          ? (splitItem.weight - sum).toString()
          : "";
      setSplitValue([...splitValue, newValue]);
    }
    else {
      const newValue =
        sum < Number(splitItem.quantity)
          ? (Number(splitItem.quantity) - sum).toString()
          : "";
      setSplitValue([...splitValue, newValue]);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex gap-x-3 items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-1/3">
        <h2 className="text-lg font-semibold mb-4">{splitItem.name} 拆分</h2>

        <div>
          {notSplitByQuantity ? (
            <div className="my-5 text-gray-700">
              總重量: {splitItem.weight} g
              <br />
              總數量：{splitItem.quantity}
            </div>
          ) : (
            <div className="my-5 text-gray-700">
              總重量：{Number(splitItem.weight) * Number(splitItem.quantity)} g
              / 單個重量：{Number(splitItem.weight)} g
              <br />
              總數量：{Number(splitItem.quantity)}
            </div>
          )}

          <div className="space-y-4">
            {splitValue.map((value, idx) => (
              <div
                className="flex items-center gap-4 p-2 border rounded px-5"
                key={idx}
              >
                {!notSplitByQuantity ? (
                  <>
                    <label className="text-sm text-gray-600">{"數量："}</label>
                    <input
                      type="number"
                      className="border p-2 w-24 rounded shadow-sm outline-none"
                      value={value}
                      placeholder={"輸入數量"}
                      onChange={(e) => {
                        const newValue = [...splitValue];
                        newValue[idx] = e.currentTarget.value;
                        setSplitValue(newValue);
                      }}
                      title={"不能小於 1 或大於總數量"}
                      min={1}
                      max={splitItem.quantity}
                    />
                    {renderLastWeight(
                      isNaN(Number(value)) ? 0 : Number(value),
                      idx
                    )}
                  </>
                ) : (
                  <>
                    <label className="text-sm text-gray-600">{"重量："}</label>
                    <input
                      type="number"
                      className="border p-2 w-24 rounded shadow-sm outline-none"
                      value={value}
                      placeholder={"輸入重量(g)"}
                      onChange={(e) => {
                        const newValue = [...splitValue];
                        newValue[idx] = e.currentTarget.value;
                        setSplitValue(newValue);
                      }}
                      title={"不能小於 0 或大於總重量"}
                      min={0}
                      max={splitItem.weight}
                    />
                    {renderLastWeight(
                      isNaN(Number(value)) ? 0 : Number(value),
                      idx
                    )}
                  </>
                )}
                <button
                  className="ml-auto text-red-500 hover:text-red-700 text-sm"
                  onClick={() => {
                    const newValue = splitValue.filter((_, i) => i !== idx);
                    setSplitValue(newValue);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            <div className="my-4 flex justify-start">
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                onClick={() => addNewSplitItem()}
              >
                ＋ 新增拆分
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={closeHandler}
          >
            取消
          </button>
          <button
            disabled={invalid}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            style={{ opacity: invalid ? "0.5" : "1" }}
            onClick={() => confirmHandler(splitValue)}
          >
            拆分
          </button>
        </div>
      </div>

      {mergeCandidates && mergeCandidates.length > 0 && (
        <div className="bg-white p-6 rounded shadow w-80">
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">可合併的同名裝備:</h3>
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
              {mergeCandidates.map((item) => (
                <button
                  key={item.id}
                  className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
                  onClick={() => mergeHandler && mergeHandler(item.id)}
                >
                  {item.name}
                  {renderWeight(item)} - 點擊合併
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
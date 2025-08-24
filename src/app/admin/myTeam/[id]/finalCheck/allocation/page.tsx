"use client";

import { usePlanTeamStore } from "@/state/planTeamStore";
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

export default function AllocationPage() {
    const { team, setTeam } = usePlanTeamStore();
    const { teamItemList, getTeamItemList, setTeamItemList } = useItemListStore();
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [dragItem, setDragItem] = useState<Equipment | null>(null);
    const [splitItem, setSplitItem] = useState<Equipment | null>(null);
    const [memberId, setMemberId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
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

    const handleSplit = (item: Equipment, memberId: string | null, weight: number) => {
       if (item.weight <= 1 || item.weight <= weight || weight <= 0) return;

       const newItem1: Equipment = {
         ...item,
         id: item.id + "_1",
         weight: weight,
       };
       const newItem2: Equipment = {
         ...item,
         id: item.id + "_2",
         weight: item.weight - weight,
       };

      if (memberId) {
        setTeamItemList([
          ...teamItemList.filter((it) => it.itemId !== item.id),
          {
            itemId: newItem1.id,
            ownerId: newItem1.ownerId,
            quantity: newItem1.quantity,
          },
          {
            itemId: newItem2.id,
            ownerId: newItem2.ownerId,
            quantity: newItem2.quantity,
          },
        ]);
      }
      setEquipment((prev) => [
        ...prev.filter((e) => e.id !== item.id),
        newItem1,
        newItem2,
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

      const mergedItem: Equipment = {
        ...sourceItem,
        id: sourceItem.id + "_merged_" + targetItem.id,
        weight: sourceItem.weight + targetItem.weight,
      };

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
            <h1 className="text-2xl font-bold mb-1">公裝分配系統</h1>
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
            confirmHandler={(w) => {
              handleSplit(splitItem, memberId, w);
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

    const totalWeight = member.items.reduce((sum, i) => sum + i.weight, 0);
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
          {item.name} ({item.weight}g)
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
  confirmHandler: (w: number) => void;
}> = ({ splitItem, closeHandler, confirmHandler, mergeCandidates, mergeHandler }) => {
  const [splitWeight, setSplitWeight] = useState<string>(
    splitItem?.weight.toString() || ""
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex gap-x-3 items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-lg font-semibold mb-4">{splitItem.name} 拆分</h2>
          <input
            type="number"
            className="border p-2 w-full mb-4"
            value={splitWeight}
            placeholder={"輸入要拆多少重量 (g)"}
            onChange={(e) => setSplitWeight(e.target.value)}
            min={1}
            max={splitItem?.weight ? splitItem.weight : undefined}
          />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={closeHandler}
          >
            取消
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => confirmHandler(Number(splitWeight) || 0)}
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
                  {item.name} ({item.weight} g) - 點擊合併
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

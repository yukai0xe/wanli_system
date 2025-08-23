"use client";

import { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

type Equipment = { id: string; name: string; weight: number };

const initialEquipment: Equipment[] = [
  { id: "eq1", name: "帳篷", weight: 2000 },
  { id: "eq2", name: "炊具", weight: 1500 },
  { id: "eq3", name: "繩索", weight: 800 },
  { id: "eq4", name: "醫療包", weight: 500 },
  { id: "eq5", name: "發電機", weight: 3000 },
];

type Member = {
  id: string;
  name: string;
  items: Equipment[];
  maxWeight: number; // 新增負重上限
};

// 範例初始成員資料
const initialMembers: Member[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `m${i + 1}`,
  name: `成員${i + 1}`,
  items: [],
  maxWeight: 5000 + i * 500, // 每個成員負重能力不同
}));

export default function AllocationPage() {
    const [equipment, setEquipment] = useState(initialEquipment);
    const [members, setMembers] = useState(initialMembers);
    const [dragItem, setDragItem] = useState<Equipment | null>(null);
    const [splitItem, setSplitItem] = useState<Equipment | null>(null);
    const [memberId, setMemberId] = useState<string | null>(null);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over) return;

        const itemId = active.id;
        const sourceMemberId = active.data.current?.memberId || null;
        const targetMemberId = over.data.current?.memberId || null;

        let movedItem: Equipment | null = null;

        // 移除原來的地方
        if (sourceMemberId) {
        setMembers((prev) =>
            prev.map((m) => {
            if (m.id === sourceMemberId) {
                const idx = m.items.findIndex((i) => i.id === itemId);
                if (idx >= 0) {
                movedItem = m.items[idx];
                const newItems = [...m.items];
                newItems.splice(idx, 1);
                return { ...m, items: newItems };
                }
            }
            return m;
            })
        );
        } else {
            const idx = equipment.findIndex((e) => e.id === itemId);
            if (idx >= 0) {
                movedItem = equipment[idx];
                setEquipment((prev) => prev.filter((e) => e.id !== itemId));
            }
        }

        // 拖到成員
        if (targetMemberId && movedItem) {
            setMembers((prev) =>
                prev.map((m) =>
                m.id === targetMemberId
                    ? { ...m, items: [...m.items, movedItem!] }
                    : m
                )
            );
        }

        // 拖回裝備清單
        if (over.id === "equipmentList" && movedItem) {
            setEquipment((prev) => [...prev, movedItem!]);
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
         setMembers((prev) =>
           prev.map((m) =>
             m.id === memberId
               ? {
                   ...m,
                   items: [
                     ...m.items.filter((i) => i.id !== item.id),
                     newItem1,
                     newItem2,
                   ],
                 }
               : m
           )
         );
       } else {
         setEquipment((prev) => [
           ...prev.filter((e) => e.id !== item.id),
           newItem1,
           newItem2,
         ]);
       }
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

      // 處理 source & target 的更新
      if (source.memberId && target.memberId) {
        // 成員 → 成員
        setMembers((prev) =>
            prev.map((m) => {
                if (source.memberId === target.memberId && m.id === source.memberId) {
                    return {
                      ...m,
                      items: [
                        ...m.items.filter((i) => i.id !== sourceItem!.id && i.id !== targetItem!.id),
                        mergedItem,
                      ],
                    };
                }
                if (m.id === source.memberId) {
                    return {
                        ...m,
                        items: [
                        ...m.items.filter((i) => i.id !== sourceItem!.id),
                        mergedItem,
                        ],
                    };
                }
                if (m.id === target.memberId) {
                    return {
                        ...m,
                        items: m.items.filter((i) => i.id !== targetItem!.id),
                    };
                }
                return m;
            })
        );
      } else if (!source.memberId && !target.memberId) {
        // 裝備清單 → 裝備清單
        setEquipment((prev) => [
          ...prev.filter(
            (i) => i.id !== sourceItem!.id && i.id !== targetItem!.id
          ),
          mergedItem,
        ]);
      } else if (source.memberId && !target.memberId) {
        // 裝備清單 → 成員
        setEquipment((prev) => prev.filter((i) => i.id !== targetItem!.id));
        setMembers((prev) =>
          prev.map((m) =>
            m.id === source.memberId
              ? {
                  ...m,
                  items: [
                    ...m.items.filter((i) => i.id !== sourceItem!.id),
                    mergedItem,
                  ],
                }
              : m
          )
        );
      } else if (!source.memberId && target.memberId) {
        // 成員 → 裝備清單
        setMembers((prev) =>
          prev.map((m) =>
            m.id === target.memberId
              ? { ...m, items: m.items.filter((i) => i.id !== targetItem!.id) }
              : m
          )
        );
        setEquipment((prev) => [
          ...prev.filter((i) => i.id !== sourceItem!.id),
          mergedItem,
        ]);
      }

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
          <div className="flex gap-6">
            {/* 左側成員 */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {members.map((m) => (
                <DroppableMember key={m.id} member={m} />
              ))}
            </div>

            {/* 右側裝備清單 */}
            <DroppableEquipment id="equipmentList" items={equipment} />
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
            mergeCandidates={[
              ...equipment,
              ...members.flatMap((m) => m.items),
            ].filter((e) => e.name === splitItem.name && e.id !== splitItem.id)}
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

    const totalWeight = member.items.reduce((sum, i) => sum + i.weight, 0);
    const isOverWeight = totalWeight > member.maxWeight;

    return (
      <div
        ref={setNodeRef}
        className={`p-4 rounded shadow flex flex-col transition 
        ${isOver ? "bg-blue-50 border border-blue-300" : "bg-white"}
        ${isOverWeight ? "bg-red-100 border border-red-500" : ""}
      `}
      >
        <h3 className="font-semibold text-gray-700">{member.name}</h3>
        <p className="text-sm text-gray-500">
          總重量: {totalWeight} g / 最大負重: {member.maxWeight} g
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {member.items.map((item) => (
            <DraggableTag
              key={item.id}
              item={item}
              mId={member.id}
            />
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

import React, { useMemo, useState, useEffect } from "react";
import InputComponent from "@/app/components/form/input";
import { motion, AnimatePresence } from "framer-motion";
import { Gender } from "@/types/enum";

type RowData = {
  id: number;
  [key: string]: number | string | boolean | undefined;
};

type RowHeader = {
  key: string;
  label: string;
  type: InputObject;
  validate: (v: string) => boolean;
};

const SortButton: React.FC<{
  k: string;
  label: string;
  sortObject: {
    sortKey: string | number;
    sortAsc: boolean;
  };
  handleClick: () => void;
}> = ({ k, label, sortObject, handleClick }) => (
  <button
    type="button"
    onClick={handleClick}
    className={`inline-flex items-center gap-1 text-sm font-medium hover:underline ${
      sortObject.sortKey === k ? "" : "text-gray-600"
    }`}
    aria-label={`Sort by ${label}`}
  >
    <span>{label}</span>
    {sortObject.sortKey === k && (
      <span aria-hidden>{sortObject.sortAsc ? "▲" : "▼"}</span>
    )}
  </button>
);

const EditableTable: React.FC<{
    rowsSortingProp: RowHeader[];
    dataSortingProp: RowData[];
    q: string;
}> = ({ rowsSortingProp, dataSortingProp, q }) => {
  const initialData: RowData[] = useMemo(() => dataSortingProp, []);
  const rowHeaders: RowHeader[] =
    rowsSortingProp
      .filter(
        (r) => r.key !== "id" && r.key !== "isLeader" && r.key !== "type"
      ) || [];

  const [rowData, setRowData] = useState<RowData[]>(initialData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<RowData>>({});

  const [sortKey, setSortKey] = useState<keyof RowData | string>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const normalized = q.trim().toLowerCase();
    const base = normalized
      ? rowData.filter((row) =>
          Object.entries(row)
            .filter(([k]) => k !== "id" && k !== "isLeader" && k !== "type")
            .some(([, cell]) => {
              if (typeof cell === "string") {
                return cell.toLowerCase().includes(normalized);
              }
            })
        )
      : rowData;

    const sorted = [...base].sort((a, b) => {
      const av = String(a[sortKey]).toLowerCase();
      const bv = String(b[sortKey]).toLowerCase();
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [rowData, q, sortKey, sortAsc]);

  const startEdit = (row: RowData) => {
    setEditingId(row.id);
    setDraft({ ...row });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = () => {
    if (editingId == null) return;

    let isValid = true;
    rowHeaders.forEach((rowHeader) => {
      if (!isValid) return;
        const r = draft[rowHeader.key] ?? null;
        if (typeof r === "string" && !rowHeader.validate(r.trim())) isValid = false;
    });
    if (!isValid) return;

    setRowData((prev) =>
      prev.map((r) => {
        if (r.id === editingId) {
          return { ...(r as RowData), ...(draft as RowData) };
        } else return r;
      })
    );
    setHighlightedId(editingId);
    setEditingId(null);
    setDraft({});
  };

  const setDraftField = (key: string, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const sortHandler = (k: string) => {
    if (sortKey === k) {
      setSortAsc((s) => !s);
    } else {
      setSortKey(k);
      setSortAsc(true);
    }
    };
    
    const renderValue = (key: string, value?: number | string | boolean) => {
        switch (key) {
            case "gender":
                return Gender[value as keyof typeof Gender];
            case "important":
                return value === "true" ? "必須" : "選配"
            default:
                return value;
        }
    }

    const renderEditInput = (rowheader: RowHeader, key: string, value?: string | number | boolean) => {
        switch (typeof value) {
          case "boolean":
          case "string":
            return (
              <InputComponent
                direction
                label={rowheader.label}
                value={value}
                input={rowheader.type}
                inputChangeHandler={(v: string) => setDraftField(key, v)}
              />
            );
        }
    };

  useEffect(() => {
    if (highlightedId != null) {
      const timer = setTimeout(() => setHighlightedId(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  return (
    <div className="overflow-x-auto">
      <table
        className="table-fixed text-left min-w-full border-collapse"
        style={{ width: "max-content" }}
      >
        <thead className="max-w-full">
          <tr className="border-b bg-gray-50 text-sm">
            <th className="px-4 py-3 text-left">操作</th>
            {rowHeaders.map((row, idx) => {
              return (
                <th key={idx} className="px-4 py-3">
                  <SortButton
                    sortObject={{ sortKey, sortAsc }}
                    handleClick={() => sortHandler(row.key)}
                    k={row.key}
                    label={row.label}
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="max-w-full">
          {filtered.map((row) => {
            const isEditing = editingId === row.id;
            return (
              <React.Fragment key={row.id}>
                <tr
                  className={`border-b last:border-0 ${
                    row.id === highlightedId
                      ? "bg-green-200 transition-colors hover:bg-green-300 duration-1000"
                      : "hover:bg-gray-50/60"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex justify-strart gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="rounded-xl border border-green-600 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-50"
                          >
                            儲存
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded-xl border border-gray-400 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            取消
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(row)}
                            className="rounded-xl border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => startEdit(row)}
                            className="rounded-xl border border-red-600 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                          >
                            刪除
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                  {Object.entries(row)
                    .filter(
                      ([k]) => k !== "id" && k !== "isLeader" && k !== "type"
                    )
                    .map(([key, value], idx) => (
                      <td
                        style={{ width: "max-content" }}
                        key={idx}
                        className="px-4 py-3 align-middle w-[150px]"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {renderValue(key, value)}
                        </span>
                      </td>
                    ))}
                </tr>

                <AnimatePresence>
                  {isEditing && (
                    <tr>
                      <td colSpan={12} className="p-0 border-0">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-2 border-solid p-5"
                        >
                          {Object.entries(draft)
                            .filter(([k]) => k !== "id")
                            .map(([key, value], idx) => {
                              const rowheader = rowHeaders.find(
                                (rh) => rh.key === key
                              );
                              return (
                                rowheader && (
                                  <div key={idx} className="w-full">
                                    {renderEditInput(rowheader, key, value)}
                                  </div>
                                )
                              );
                            })}
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
          {filtered.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                沒有符合搜尋的資料
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;
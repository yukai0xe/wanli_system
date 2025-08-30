import React, { useMemo, useState, useEffect } from "react";
import InputComponent from "@/app/components/form/input";
import { motion, AnimatePresence } from "framer-motion";
import { Gender } from "@/types/enum";

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
    rowsSortingProp: EditableRowHeader[];
    dataSortingProp: RowData[];
    q: string;
    onDataChange: (newData: RowData[]) => void;
}> = ({ rowsSortingProp, dataSortingProp, q, onDataChange }) => {
  const rowHeaders: EditableRowHeader[] =
    rowsSortingProp
      .filter(
        (r) => r.key !== "id" && r.key !== "isLeader" && r.key !== "type"
      ) || [];

  const [rowData, setRowData] = useState<RowData[]>(dataSortingProp);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<RowData>>({});

  const [sortKey, setSortKey] = useState<keyof RowData | string>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

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
    const _rowheader = rowHeaders.map(r => {
        return (
        {
          key: r.key,
          edit: r.edit
        })
    })
    const draftRow: RowData = { id: row.id };
    Object.keys(row).forEach(k => {
      if(_rowheader.some(rh => rh.key === k && rh.edit)) draftRow[k] = row[k];
    })

    setEditingId(row.id);
    setDraft(draftRow);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = () => {
    if (editingId == null) return;

    let isValid = true;
    rowHeaders.forEach((rowHeader) => {
      if (!isValid || !(rowHeader.key in draft)) return;
        const r = draft[rowHeader.key] ?? null;
        if (typeof r === "string" && !rowHeader.validate(r.trim())) isValid = false;
    });
    if (!isValid) return;

    onDataChange(
      rowData.map((r) => {
        if (r.id === editingId) {
          return { ...(r as RowData), ...(draft as RowData) };
        } else return r;
      })
    );
    setHighlightedId(editingId);
    setEditingId(null);
    setDraft({});
  };

  const setDraftField = (key: string, value: string | boolean) => {
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
          case "required":
            if (typeof value === "string") return value === "true" ? "必配" : "選配";
            if (typeof value === "number") return Boolean(value) ? "必配" : "選配";
            return value ? "必配" : "選配";
          default:
            return value;
        }
    }

    const renderEditInput = (rowheader: EditableRowHeader, key: string, value?: string | number | boolean) => {
        switch (typeof value) {
          case "boolean":
            return (
              <InputComponent
                direction
                label={rowheader.label}
                value={value}
                input={rowheader.type}
                inputChangeHandler={(v: string) => setDraftField(key, v === "true")}
              />
            );
          case "string":
          case "number":
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
  
  const deleteHandler = (row: RowData) => {
    setRowData((prev) => prev.filter((r) => r.id !== row.id));
  }

  useEffect(() => {
    if (highlightedId != null) {
      const timer = setTimeout(() => setHighlightedId(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  useEffect(() => {
    setRowData(dataSortingProp);
  }, [dataSortingProp])

  return (
    <div className="overflow-x-auto">
      <table
        className="table-fixed text-left min-w-full border-collapse border border-gray-200 text-sm"
        style={{ width: "max-content" }}
      >
        <thead className="border-b max-w-full">
          <tr className="bg-gray-50 text-sm">
            <th className="px-4 py-3 text-left border">操作</th>
            {rowHeaders.map((row, idx) => {
              return (
                <th key={idx} className="px-4 py-3 border">
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
                  <td className="px-4 py-3 border">
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
                            onClick={() => deleteHandler(row)}
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
                        className="px-4 py-3 border align-middle w-[150px]"
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
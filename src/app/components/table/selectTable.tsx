import React, { useMemo, useState, useEffect } from "react";

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

const SelectableTable: React.FC<{
  rowsSortingProp: RowHeader[];
  dataSortingProp: RowData[];
  search: string
  selectedRows: Set<string>;
  onDataChange: (v: Set<string>) => void;
}> = ({ rowsSortingProp, dataSortingProp, search, selectedRows, onDataChange }) => {
  const rowHeaders: RowHeader[] =
    rowsSortingProp
      .filter(
        (r) => r.key !== "id" && r.key !== "isLeader" && r.key !== "type"
      ) || [];

  const [rowData, setRowData] = useState<RowData[]>(dataSortingProp);
  const [sortKey, setSortKey] = useState<keyof RowData | string>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
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
  }, [rowData, search, sortKey, sortAsc]);

  const sortHandler = (k: string) => {
    if (sortKey === k) {
      setSortAsc((s) => !s);
    } else {
      setSortKey(k);
      setSortAsc(true);
    }
  };

  const toggleRow = (id: string) => {
    if (selectedRows.has(id)) selectedRows.delete(id);
    else selectedRows.add(id);
    onDataChange(selectedRows);
  };

  const renderValue = (key: string, value?: number | string | boolean) => {
    switch (key) {
        default:
            return value;
    }
  }

  useEffect(() => {
    setRowData(dataSortingProp);
  }, [dataSortingProp])

  return (
    <div className="overflow-x-auto">
      <table
        className="table-fixed text-left min-w-[1000px] border-collapse"
        style={{ width: "max-content" }}
      >
        <thead className="max-w-full">
          <tr className="border-b bg-gray-50 text-sm">
            <th className="px-4 py-3 text-left">勾選</th>
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
          {filtered.map((row) => (
            <React.Fragment key={row.id}>
              <tr
                key={row.id}
                className={`border-b last:border-0 hover:bg-gray-50/60 ${
                  selectedRows.has(row.id) ? "bg-blue-50" : ""
                }`}
                onClick={() => toggleRow(row.id)}
              >
                <td
                  className="px-4 py-3 w-[40px]"
                  style={{ width: "max-content" }}
                >
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </td>
                {Object.entries(row)
                  .filter(
                    ([k]) => k !== "id" && k !== "isLeader" && k !== "type"
                  )
                  .map(([key, value], idx) => (
                    <td
                      key={idx}
                      className="px-4 py-3 align-middle w-[150px]"
                      style={{ width: "max-content" }}
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {renderValue(key, value)}
                      </span>
                    </td>
                  ))}
              </tr>
            </React.Fragment>
          ))}
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

export default SelectableTable;
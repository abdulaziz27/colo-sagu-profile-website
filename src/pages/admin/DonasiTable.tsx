import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function DonasiTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/donations");
      console.log("Donations data:", res.data);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
    setLoading(false);
  };

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      { accessorKey: "order_id", header: "Order ID" },
      { accessorKey: "name", header: "Nama" },
      {
        accessorKey: "amount",
        header: "Nominal",
        cell: (info) => "Rp " + Number(info.getValue()).toLocaleString("id-ID"),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const statusMap = {
            settlement: {
              text: "Berhasil",
              color: "text-green-600 bg-green-100",
            },
            failed: { text: "Gagal", color: "text-red-600 bg-red-100" },
            cancel: { text: "Dibatalkan", color: "text-gray-600 bg-gray-100" },
            deny: { text: "Ditolak", color: "text-red-600 bg-red-100" },
            expire: {
              text: "Kadaluarsa",
              color: "text-orange-600 bg-orange-100",
            },
            capture: { text: "Diproses", color: "text-blue-600 bg-blue-100" },
            authorize: {
              text: "Diauthorisasi",
              color: "text-purple-600 bg-purple-100",
            },
          };
          const statusInfo = statusMap[status] || {
            text: status,
            color: "text-gray-600 bg-gray-100",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
            >
              {statusInfo.text}
            </span>
          );
        },
      },
      { accessorKey: "event_id", header: "Event" },
      {
        accessorKey: "created_at",
        header: "Tanggal",
        cell: (info) => String(info.getValue()).slice(0, 19).replace("T", " "),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Daftar Donasi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 bg-forest text-white"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-6">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-6">
                    Belum ada donasi
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-secondary/30">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

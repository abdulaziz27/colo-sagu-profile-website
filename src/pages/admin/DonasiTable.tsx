import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Users } from "lucide-react";
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

  // Calculate statistics from data
  const statistics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalAmount: 0,
        totalDonations: 0,
        successfulDonations: 0,
        averageAmount: 0,
        successRate: 0,
      };
    }

    const successfulStatuses = ["settlement", "capture"]; // Status yang dianggap berhasil
    const successful = data.filter((item) =>
      successfulStatuses.includes(item.status)
    );
    const totalAmount = successful.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    const totalDonations = data.length;
    const successfulDonations = successful.length;
    const averageAmount =
      successfulDonations > 0 ? totalAmount / successfulDonations : 0;
    const successRate =
      totalDonations > 0 ? (successfulDonations / totalDonations) * 100 : 0;

    return {
      totalAmount,
      totalDonations,
      successfulDonations,
      averageAmount,
      successRate,
    };
  }, [data]);

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
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Amount Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Donasi Berhasil
                </p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {statistics.totalAmount.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Count Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Transaksi
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {statistics.totalDonations}
                </p>
                <p className="text-xs text-muted-foreground">
                  {statistics.successfulDonations} berhasil
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Amount Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rata-rata Donasi
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  Rp{" "}
                  {Math.round(statistics.averageAmount).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">%</span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tingkat Keberhasilan
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {statistics.successRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donations Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daftar Donasi</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Menampilkan {data.length} transaksi donasi
            </p>
          </div>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="text-green-600 border-green-200"
            >
              {statistics.successfulDonations} Berhasil
            </Badge>
            <Badge variant="outline" className="text-red-600 border-red-200">
              {statistics.totalDonations - statistics.successfulDonations}{" "}
              Gagal/Pending
            </Badge>
          </div>
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
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-forest"></div>
                        <span>Memuat data donasi...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">Belum ada donasi</p>
                        <p className="text-sm">
                          Donasi akan muncul di sini setelah ada transaksi
                        </p>
                      </div>
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
    </div>
  );
}

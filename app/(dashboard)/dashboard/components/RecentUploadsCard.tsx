import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export type RecentAnalysis = {
  id: string;
  title: string | null;
  createdAt: string;
  cvId: string;
  keywords: string[];
};

type Props = {
  analyses: RecentAnalysis[];
};

export default function RecentUploadsCard({ analyses }: Props) {
  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Son Yüklemeler</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-slate-400 hover:text-white"
        >
          <Link href="/me/cvs">Tümünü Gör</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-950/30">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400">Dosya</TableHead>
              <TableHead className="text-slate-400">Tarih</TableHead>
              <TableHead className="text-right text-slate-400">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-slate-500"
                >
                  Kayıt yok.
                </TableCell>
              </TableRow>
            ) : (
              analyses.slice(0, 5).map((a) => (
                <TableRow
                  key={a.id}
                  className="border-slate-800 hover:bg-slate-800/30"
                >
                  <TableCell className="font-medium text-slate-200">
                    {a.title || "İsimsiz"}
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/me/cvs/${a.cvId}`}
                      className="text-indigo-400 hover:underline text-xs"
                    >
                      Detay
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

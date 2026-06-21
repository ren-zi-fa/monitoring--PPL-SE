import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TARGET_DATA, UNIQUE_PPLS } from "@/hooks/use-monitoring-data";

interface MonitoringFilterProps {
  onSearch: (idsubsls: string) => void;
}

export function MonitoringFilter({ onSearch }: MonitoringFilterProps) {
  const [selectedPpl, setSelectedPpl] = useState<string>("");
  const [selectedIdsubsls, setSelectedIdsubsls] = useState<string>("");

  // Derived options based on selections
  const slsOptions = useMemo(() => {
    if (!selectedPpl) return [];
    return TARGET_DATA.filter(t => t.ppl === selectedPpl);
  }, [selectedPpl]);

  const handlePplChange = (value: string | null) => {
    if (!value) return;
    setSelectedPpl(value);
    setSelectedIdsubsls("");
  };

  const handleSlsChange = (value: string | null) => {
    if (!value) return;
    setSelectedIdsubsls(value);
    onSearch(value);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>PPL</Label>
            <Select value={selectedPpl} onValueChange={handlePplChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih PPL..." />
              </SelectTrigger>
              <SelectContent>
                {UNIQUE_PPLS.map((ppl) => (
                  <SelectItem key={ppl} value={ppl}>
                    {ppl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Wilayah Tugas (ID SUBSLS - Desa - SLS)</Label>
            <Select value={selectedIdsubsls} onValueChange={handleSlsChange} disabled={!selectedPpl}>
              <SelectTrigger className="w-full h-auto min-h-10 text-left [&>span]:line-clamp-none [&>span]:whitespace-normal">
                <SelectValue placeholder="Pilih ID SUBSLS / Wilayah..." />
              </SelectTrigger>
              <SelectContent className="w-auto max-w-[95vw] md:max-w-2xl">
                {slsOptions.map((t) => (
                  <SelectItem key={t.idsubsls} value={t.idsubsls} className="whitespace-normal py-2 pr-8">
                    {t.idsubsls} - {t.desa} ({t.sls})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

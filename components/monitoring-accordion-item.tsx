import { UseFormReturn } from "react-hook-form";
import { MonitoringForm } from "@/lib/schema";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface MonitoringAccordionItemProps {
  form: UseFormReturn<MonitoringForm>;
  index: number;
}

export function MonitoringAccordionItem({
  form,
  index,
}: MonitoringAccordionItemProps) {
  const dateStr = form.getValues(`monitoring.${index}.date`);
  const formattedDate = dateStr
    ? format(parseISO(dateStr), "dd MMMM yyyy", { locale: id })
    : `Hari ke-${index + 1}`;

  return (
    <AccordionItem value={`item-${index}`} className="border-none mb-3">
      <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-900/50">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="font-semibold text-base text-slate-900 dark:text-slate-100">{formattedDate}</div>
            <div className="flex gap-4 text-sm font-normal text-slate-500">
              <span className="hidden sm:inline-block">Sudah Didata: {form.watch(`monitoring.${index}.sudahDidata`) || 0}</span>
              <span className="hidden sm:inline-block">Belum Submit: {form.watch(`monitoring.${index}.belumSubmit`) || 0}</span>
              <span className="hidden sm:inline-block">Sudah Submit: {form.watch(`monitoring.${index}.sudahSubmit`) || 0}</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-5 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <FormField
              control={form.control}
              name={`monitoring.${index}.sudahDidata`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">Sudah Didata</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      className="bg-slate-50 dark:bg-slate-900 focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`monitoring.${index}.belumSubmit`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">Belum Submit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      className="bg-slate-50 dark:bg-slate-900 focus-visible:ring-emerald-500"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`monitoring.${index}.sudahSubmit`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">Sudah Submit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      className="bg-slate-50 dark:bg-slate-900 focus-visible:ring-purple-500"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}

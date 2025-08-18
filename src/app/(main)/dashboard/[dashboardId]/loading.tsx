import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-48" />
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-[24rem] w-full" />
        </div>
        <div className="lg:col-span-3 space-y-4">
            <Skeleton className="h-[24rem] w-full" />
        </div>
      </div>
    </div>
  );
}

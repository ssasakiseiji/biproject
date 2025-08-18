import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-48" />
      </header>

      <div className="grid gap-8">
         <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { Dashboard, DashboardData, DashboardPage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { generateDashboardSummaryAction } from './actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ChartComponent } from './ChartComponent';

type DashboardClientProps = {
  initialData: DashboardData;
  dashboard: Dashboard;
  page: DashboardPage;
};

export default function DashboardClient({ initialData, dashboard, page }: DashboardClientProps) {
  const [data] = useState<DashboardData>(initialData);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    const result = await generateDashboardSummaryAction(dashboard, data, page);
    setIsSummaryLoading(false);

    if (result.success) {
      setSummary(result.summary);
      setIsDialogOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };
  
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold font-headline">{dashboard.name}</h1>
          <p className="text-muted-foreground">{page.name}</p>
        </div>
        <Button onClick={handleGenerateSummary} disabled={isSummaryLoading}>
          {isSummaryLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate AI Summary
        </Button>
      </header>

      <div className="grid gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Data Visualization</CardTitle>
            <CardDescription>Visual representation of the data for the {page.name.toLowerCase()} page.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartComponent data={data} />
          </CardContent>
        </Card>
      </div>

       <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                AI-Powered Summary for {page.name}
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 text-foreground">
              {summary}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

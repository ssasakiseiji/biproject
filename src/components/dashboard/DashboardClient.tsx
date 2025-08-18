'use client';

import { useState } from 'react';
import type { Dashboard, DashboardData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChartComponent } from './BarChart';
import { PieChartComponent } from './PieChart';
import { Wand2, Loader2 } from 'lucide-react';
import { generateDashboardSummaryAction } from '@/app/(main)/dashboard/[dashboardId]/actions';
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

type DashboardClientProps = {
  initialData: DashboardData;
  dashboard: Dashboard;
};

export default function DashboardClient({ initialData, dashboard }: DashboardClientProps) {
  const [data] = useState<DashboardData>(initialData);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    const result = await generateDashboardSummaryAction(dashboard, data);
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
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold font-headline">{dashboard.name} Dashboard</h1>
          <p className="text-muted-foreground">Key insights and performance metrics.</p>
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

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-lg">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Bar chart showing key metrics over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent data={data.barChartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 shadow-lg">
          <CardHeader>
            <CardTitle>Metric Distribution</CardTitle>
            <CardDescription>Pie chart breaking down performance categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={data.pieChartData} />
          </CardContent>
        </Card>
      </div>

       <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                AI-Powered Summary
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

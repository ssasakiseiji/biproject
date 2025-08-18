'use server';

/**
 * @fileOverview An AI agent that summarizes dashboard insights and suggests business actions.
 *
 * - summarizeDashboard - A function that takes dashboard data and returns a summary.
 * - SummarizeDashboardInput - The input type for the summarizeDashboard function.
 * - SummarizeDashboardOutput - The return type for the summarizeDashboard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDashboardInputSchema = z.object({
  dashboardName: z.string().describe('The name of the dashboard to summarize.'),
  dashboardData: z.string().describe('The JSON data for the dashboard.'),
});
export type SummarizeDashboardInput = z.infer<typeof SummarizeDashboardInputSchema>;

const SummarizeDashboardOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the key insights from the dashboard, highlighting potential business actions.'),
});
export type SummarizeDashboardOutput = z.infer<typeof SummarizeDashboardOutputSchema>;

export async function summarizeDashboard(input: SummarizeDashboardInput): Promise<SummarizeDashboardOutput> {
  return summarizeDashboardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDashboardPrompt',
  input: {schema: SummarizeDashboardInputSchema},
  output: {schema: SummarizeDashboardOutputSchema},
  prompt: `You are an expert business analyst. Summarize the key insights from the following dashboard data and highlight potential business actions. Be concise and focus on what the user should do.

Dashboard Name: {{dashboardName}}
Dashboard Data: {{{dashboardData}}}`,
});

const summarizeDashboardFlow = ai.defineFlow(
  {
    name: 'summarizeDashboardFlow',
    inputSchema: SummarizeDashboardInputSchema,
    outputSchema: SummarizeDashboardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

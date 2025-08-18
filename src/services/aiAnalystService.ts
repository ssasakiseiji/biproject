import type { DashboardData } from "@/lib/types";

export function getAIResponse(message: string, dashboardContext: DashboardData): Promise<string> {
    return new Promise(resolve => {
        setTimeout(() => {
            const lowerCaseMessage = message.toLowerCase();

            if (lowerCaseMessage.includes('sales')) {
                if (dashboardContext?.overview?.barChartData) {
                    const totalSales = dashboardContext.overview.barChartData.reduce((acc, item) => acc + item.value, 0);
                    resolve(`The total sales across all quarters amount to $${totalSales.toLocaleString()}.`);
                } else {
                    resolve("I can't find the specific sales data at the moment.");
                }
            } else if (lowerCaseMessage.includes('best') && lowerCaseMessage.includes('region')) {
                 if (dashboardContext?.regions?.pieChartData) {
                    const bestRegion = dashboardContext.regions.pieChartData.reduce((prev, current) => (prev.value > current.value) ? prev : current);
                    resolve(`The best performing region is ${bestRegion.name}, contributing ${bestRegion.value}% of the total sales.`);
                } else {
                    resolve("I don't have the regional sales breakdown right now.");
                }
            } else if (lowerCaseMessage.includes('compare') || lowerCaseMessage.includes('comparison')) {
                if (dashboardContext?.overview?.barChartData && dashboardContext.overview.barChartData.length >= 2) {
                    const q1 = dashboardContext.overview.barChartData[0].value;
                    const q4 = dashboardContext.overview.barChartData[3].value;
                    const difference = q4 - q1;
                    const direction = difference > 0 ? 'increase' : 'decrease';
                    resolve(`Comparing Q4 to Q1, there was an ${direction} of $${Math.abs(difference).toLocaleString()}.`);
                } else {
                     resolve("I need more quarterly data to make a useful comparison.");
                }
            } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
                resolve("Hello! I'm your BizzViz AI Analyst. How can I help you with your sales data today?");
            }
            else {
                resolve("I'm not sure I understand the question. Can you please rephrase it? You can ask me about total sales, the best region, or a comparison between quarters.");
            }
        }, 1500);
    });
}
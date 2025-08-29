import type { DashboardData, Transaction } from "@/lib/types";

export function getAIResponse(message: string, dashboardContext: DashboardData): Promise<string> {
    return new Promise(resolve => {
        const lowerCaseMessage = message.toLowerCase();
        
        // El contexto recibido es un array de transacciones: Transaction[]
        const transactions = dashboardContext as Transaction[];

        if (lowerCaseMessage.includes('sales')) {
            if (transactions && transactions.length > 0) {
                const totalSales = transactions.reduce((acc, item) => acc + item.ingresos, 0);
                resolve(`The total sales across all transactions amount to $${totalSales.toLocaleString()}.`);
            } else {
                resolve("I can't find the specific sales data at the moment.");
            }
        } else if (lowerCaseMessage.includes('best') && lowerCaseMessage.includes('region')) {
             if (transactions && transactions.length > 0) {
                const regionSales: { [key: string]: number } = {};
                transactions.forEach(t => {
                    if (!regionSales[t.region]) regionSales[t.region] = 0;
                    regionSales[t.region] += t.ingresos;
                });
                const bestRegion = Object.entries(regionSales).reduce((prev, current) => (prev[1] > current[1]) ? prev : current);
                resolve(`The best performing region is ${bestRegion[0]}, with total sales of $${bestRegion[1].toLocaleString()}.`);
            } else {
                resolve("I don't have the regional sales breakdown right now.");
            }
        } else if (lowerCaseMessage.includes('compare') || lowerCaseMessage.includes('comparison')) {
            resolve("I can provide comparisons, but can you be more specific? For example, 'compare sales between Norte and Sur regions'.");
        } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
            resolve("Hello! I'm your KIN BI AI Analyst. How can I help you with your sales data today?");
        }
        else {
            resolve("I'm not sure I understand the question. Can you please rephrase it? You can ask me about total sales, the best region, or a comparison between regions.");
        }
    });
}
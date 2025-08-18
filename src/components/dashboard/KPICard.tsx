
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KPICardProps = {
    title: string;
    value: string | number;
    description?: string;
}

export function KPICard({ title, value, description }: KPICardProps) {
    return (
        <Card className="shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
}

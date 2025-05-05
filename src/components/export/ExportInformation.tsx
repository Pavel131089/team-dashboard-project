
import React from "react";
import { Card } from "@/components/ui/card";

const ExportInformation: React.FC = () => {
  return (
    <Card className="p-4 bg-slate-50">
      <h3 className="font-medium mb-2">Информация об отчетах:</h3>
      <p className="text-sm text-slate-700">
        Отчеты экспортируются в формате CSV и содержат детальную информацию о проектах,
        задачах, назначенных исполнителях, сроках выполнения и текущем прогрессе.
        Файл можно открыть в Excel или другом табличном редакторе.
      </p>
    </Card>
  );
};

export default ExportInformation;

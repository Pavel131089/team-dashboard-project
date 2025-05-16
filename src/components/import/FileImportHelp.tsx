
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Alert, AlertDescription } from '../ui/alert';
import Icon from '../ui/icon';

export const FileImportHelp: React.FC = () => {
  return (
    <Accordion type="single" collapsible className="mt-4">
      <AccordionItem value="help">
        <AccordionTrigger>Инструкции по импорту</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-sm">
            <section className="space-y-2">
              <h3 className="font-medium">Поддерживаемые форматы файлов:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>CSV</strong> - текстовый формат с разделителями (поля разделены запятыми)</li>
                <li><strong>JSON</strong> - формат структурированных данных</li>
              </ul>
            </section>
            
            <Alert>
              <Icon name="InfoCircle" className="h-4 w-4" />
              <AlertDescription>
                Для импорта из Excel, пожалуйста, сохраните таблицу как CSV-файл: 
                в Excel выберите "Файл" → "Сохранить как" → выберите "CSV (разделители - запятые)"
              </AlertDescription>
            </Alert>
            
            <section className="space-y-2">
              <h3 className="font-medium">Структура CSV файла:</h3>
              <p>CSV файл должен содержать следующие колонки:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>projectName</strong> - название проекта</li>
                <li><strong>name</strong> - название задачи</li>
                <li><strong>description</strong> - описание задачи (необязательно)</li>
                <li><strong>price</strong> - стоимость задачи (необязательно)</li>
                <li><strong>estimatedTime</strong> - оценка времени в часах (необязательно)</li>
                <li><strong>startDate</strong> - дата начала (необязательно)</li>
                <li><strong>endDate</strong> - дата окончания (необязательно)</li>
                <li><strong>assignedTo</strong> - назначенные исполнители через запятую (необязательно)</li>
                <li><strong>progress</strong> - прогресс выполнения в процентах (необязательно)</li>
              </ul>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-medium">Структура JSON файла:</h3>
              <p>JSON файл должен содержать объект проекта или массив проектов со следующей структурой:</p>
              <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto">
{`{
  "name": "Название проекта",
  "description": "Описание проекта",
  "tasks": [
    {
      "name": "Задача 1",
      "description": "Описание задачи",
      "price": 1000,
      "estimatedTime": 8,
      "startDate": "2023-05-15",
      "endDate": "2023-05-20",
      "assignedTo": "Иванов И.И., Петров П.П.",
      "progress": 50
    }
  ]
}`}
              </pre>
            </section>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

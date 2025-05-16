
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

export const FileImportHelp: React.FC = () => {
  return (
    <div className="mt-6">
      <Alert className="mb-4">
        <Icon name="Info" className="h-4 w-4" />
        <AlertTitle>Инструкция по импорту проектов</AlertTitle>
        <AlertDescription>
          Для импорта проектов вы можете использовать файлы CSV или JSON формата. 
          Если у вас есть данные в Excel, сохраните их как CSV перед загрузкой.
        </AlertDescription>
      </Alert>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="csv-format">
          <AccordionTrigger>Формат CSV файла</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">CSV файл должен содержать следующие заголовки:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>projectName</strong> - название проекта</li>
              <li><strong>name</strong> - название задачи</li>
              <li><strong>description</strong> - описание задачи (опционально)</li>
              <li><strong>price</strong> - стоимость задачи (опционально)</li>
              <li><strong>estimatedTime</strong> - оценка времени задачи в часах (опционально)</li>
              <li><strong>startDate</strong> - дата начала задачи в формате YYYY-MM-DD (опционально)</li>
              <li><strong>endDate</strong> - дата окончания задачи в формате YYYY-MM-DD (опционально)</li>
              <li><strong>assignedTo</strong> - исполнители задачи (опционально)</li>
              <li><strong>progress</strong> - прогресс выполнения задачи в процентах (опционально)</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Пример: projectName,name,description,price,startDate,endDate<br/>
              "Мой проект","Задача 1","Описание задачи",10000,"2023-05-01","2023-05-15"
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="json-format">
          <AccordionTrigger>Формат JSON файла</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">JSON файл должен иметь следующую структуру:</p>
            <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
              {`{
  "id": "unique-id",
  "name": "Название проекта",
  "description": "Описание проекта",
  "startDate": "2023-05-01",     // Дата начала проекта
  "endDate": "2023-06-01",       // Дата окончания проекта
  "tasks": [
    {
      "id": "task-1",
      "name": "Задача 1",
      "description": "Описание задачи",
      "price": 10000,
      "estimatedTime": 20,
      "startDate": "2023-05-01",
      "endDate": "2023-05-15",
      "assignedTo": "Иванов И.И.",
      "progress": 50
    }
  ]
}`}
            </pre>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="excel-conversion">
          <AccordionTrigger>Как конвертировать Excel в CSV</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Для конвертации Excel файла в CSV:</p>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Откройте ваш Excel файл</li>
              <li>Выберите меню <strong>Файл</strong> → <strong>Сохранить как</strong></li>
              <li>В выпадающем списке форматов выберите <strong>CSV (разделители - запятые) (*.csv)</strong></li>
              <li>Нажмите <strong>Сохранить</strong></li>
              <li>Загрузите полученный CSV файл</li>
            </ol>
            <p className="mt-2 text-sm text-muted-foreground">
              Убедитесь, что в вашей таблице есть все необходимые колонки с корректными заголовками.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

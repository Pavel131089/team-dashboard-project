import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Icon from "../ui/icon";

export const FileImportHelp: React.FC = () => {
  return (
    <div className="mt-6">
      <Alert>
        <Icon name="Info" className="h-4 w-4" />
        <AlertTitle>Подсказка по импорту</AlertTitle>
        <AlertDescription>
          Вы можете импортировать проекты из CSV, JSON или Excel файлов.
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="csv-format">
          <AccordionTrigger>Формат CSV файла</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">
              CSV файл должен содержать следующие обязательные заголовки:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <code>projectName</code> - Название проекта
              </li>
              <li>
                <code>name</code> - Название задачи
              </li>
            </ul>
            <p className="mt-2 mb-2">Дополнительные поля:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <code>description</code> - Описание задачи
              </li>
              <li>
                <code>price</code> - Стоимость
              </li>
              <li>
                <code>estimatedTime</code> - Оценка времени (в часах)
              </li>
              <li>
                <code>startDate</code> - Дата начала (формат YYYY-MM-DD)
              </li>
              <li>
                <code>endDate</code> - Дата окончания (формат YYYY-MM-DD)
              </li>
              <li>
                <code>assignedTo</code> - Исполнитель (через запятую для
                нескольких)
              </li>
              <li>
                <code>progress</code> - Прогресс выполнения (0-100)
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="json-format">
          <AccordionTrigger>Формат JSON файла</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">
              JSON файл должен содержать объект проекта или массив проектов со
              следующей структурой:
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto mt-2">
              {`{
  "name": "Название проекта",
  "description": "Описание проекта",
  "tasks": [
    {
      "name": "Название задачи",
      "description": "Описание задачи",
      "price": 1000,
      "estimatedTime": 5,
      "startDate": "2023-06-01",
      "endDate": "2023-06-10",
      "assignedTo": "Иванов И.И., Петров П.П.",
      "progress": 50
    }
  ]
}`}
            </pre>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="excel-format">
          <AccordionTrigger>Формат Excel файла</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">
              Excel файл должен содержать таблицу со следующими обязательными
              столбцами:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <code>projectName</code> - Название проекта
              </li>
              <li>
                <code>name</code> - Название задачи
              </li>
            </ul>
            <p className="mt-2 mb-2">Дополнительные столбцы:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <code>description</code> - Описание задачи
              </li>
              <li>
                <code>price</code> - Стоимость
              </li>
              <li>
                <code>estimatedTime</code> - Оценка времени (в часах)
              </li>
              <li>
                <code>startDate</code> - Дата начала
              </li>
              <li>
                <code>endDate</code> - Дата окончания
              </li>
              <li>
                <code>assignedTo</code> - Исполнитель (через запятую для
                нескольких)
              </li>
              <li>
                <code>progress</code> - Прогресс выполнения (0-100)
              </li>
            </ul>
            <p className="mt-2 text-sm italic">
              Поддерживаются также русские названия столбцов: Имя проекта,
              Название задачи, Описание, Цена, Время и т.д.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

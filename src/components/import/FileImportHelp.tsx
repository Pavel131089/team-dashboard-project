import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FileImportHelp: React.FC = () => {
  return (
    <Accordion type="single" collapsible className="mt-4">
      <AccordionItem value="item-1">
        <AccordionTrigger>Поддерживаемые форматы файлов</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 text-sm">
            <p>
              <strong>CSV файлы</strong> - разделенные запятыми данные с
              заголовками.
            </p>
            <p>
              <strong>JSON файлы</strong> - в формате объекта проекта или
              массива проектов.
            </p>
            <p>
              <strong>Excel файлы</strong> - таблицы в формате .xlsx или .xls с
              заголовками.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>Структура данных</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 text-sm">
            <p>Обязательные поля в CSV/Excel:</p>
            <ul className="list-disc pl-5">
              <li>
                <code>projectName</code> - название проекта
              </li>
              <li>
                <code>name</code> - название задачи
              </li>
            </ul>
            <p className="mt-2">Дополнительные поля:</p>
            <ul className="list-disc pl-5">
              <li>
                <code>description</code> - описание задачи
              </li>
              <li>
                <code>price</code> - стоимость задачи
              </li>
              <li>
                <code>estimatedTime</code> - оценка времени
              </li>
              <li>
                <code>startDate</code> - плановая дата начала
              </li>
              <li>
                <code>endDate</code> - плановая дата окончания
              </li>
              <li>
                <code>assignedTo</code> - исполнители (через запятую)
              </li>
              <li>
                <code>progress</code> - прогресс выполнения (0-100)
              </li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>Формат JSON</AccordionTrigger>
        <AccordionContent>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {`{
  "name": "Название проекта",
  "description": "Описание проекта",
  "tasks": [
    {
      "name": "Задача 1",
      "description": "Описание задачи",
      "price": 5000,
      "estimatedTime": 8,
      "startDate": "2023-05-01",
      "endDate": "2023-05-10",
      "assignedToNames": ["Иванов И.И."],
      "progress": 50
    }
  ]
}`}{" "}
          </pre>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger>Пример Excel/CSV таблицы</AccordionTrigger>
        <AccordionContent>
          <div className="overflow-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-1">projectName</th>
                  <th className="border border-gray-300 p-1">name</th>
                  <th className="border border-gray-300 p-1">description</th>
                  <th className="border border-gray-300 p-1">price</th>
                  <th className="border border-gray-300 p-1">estimatedTime</th>
                  <th className="border border-gray-300 p-1">assignedTo</th>
                  <th className="border border-gray-300 p-1">progress</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-1">Проект 1</td>
                  <td className="border border-gray-300 p-1">Задача 1</td>
                  <td className="border border-gray-300 p-1">
                    Описание задачи 1
                  </td>
                  <td className="border border-gray-300 p-1">5000</td>
                  <td className="border border-gray-300 p-1">8</td>
                  <td className="border border-gray-300 p-1">Иванов И.И.</td>
                  <td className="border border-gray-300 p-1">50</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-1">Проект 1</td>
                  <td className="border border-gray-300 p-1">Задача 2</td>
                  <td className="border border-gray-300 p-1">
                    Описание задачи 2
                  </td>
                  <td className="border border-gray-300 p-1">3000</td>
                  <td className="border border-gray-300 p-1">4</td>
                  <td className="border border-gray-300 p-1">Петров П.П.</td>
                  <td className="border border-gray-300 p-1">25</td>
                </tr>
              </tbody>
            </table>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

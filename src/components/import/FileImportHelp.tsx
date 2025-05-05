
import React from 'react';

export const FileImportHelp: React.FC = () => {
  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
      <h4 className="font-medium mb-2">Формат CSV файла:</h4>
      <p className="text-sm text-slate-700">
        Первая строка должна содержать заголовки: "Проект;Задача;Описание;Стоимость;Время;Прогресс;Исполнитель;Дата начала;Дата окончания"
      </p>
      <p className="text-sm text-slate-700 mt-2">
        Пример содержимого:
      </p>
      <pre className="text-xs bg-slate-100 p-2 mt-1 rounded overflow-x-auto">
        Проект;Задача;Описание;Стоимость;Время;Прогресс;Исполнитель;Дата начала;Дата окончания{"\n"}
        Сайт компании;Дизайн главной;Разработка дизайна;10000;20;50;Иванов И.И.;01.06.2023;15.06.2023{"\n"}
        Сайт компании;Вёрстка;Вёрстка главной;5000;10;0;Петров П.П.;16.06.2023;20.06.2023
      </pre>
    </div>
  );
};

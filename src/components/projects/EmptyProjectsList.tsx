
import React from "react";

const EmptyProjectsList: React.FC = () => {
  return (
    <div className="text-center py-8">
      <p className="text-slate-500">Проекты отсутствуют</p>
      <p className="text-slate-400 text-sm mt-2">
        Создайте новый проект или импортируйте существующие через вкладку "Импорт данных"
      </p>
    </div>
  );
};

export default EmptyProjectsList;

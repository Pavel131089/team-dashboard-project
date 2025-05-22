
import React from "react";
import Icon from "@/components/ui/icon";

const EmptyAvailableTasks: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <Icon name="ClipboardList" className="h-12 w-12 text-slate-300 mb-3" />
      <h3 className="text-lg font-medium mb-2">Нет доступных задач</h3>
      <p className="text-sm text-slate-500">
        В данный момент нет задач, которые вы могли бы взять в работу.
        Проверьте позже или обратитесь к руководителю проекта.
      </p>
    </div>
  );
};

export default EmptyAvailableTasks;


import React from "react";
import Icon from "@/components/ui/icon";

const EmptyAvailableTasks: React.FC = () => {
  return (
    <div className="text-center py-10 px-4">
      <Icon 
        name="Inbox" 
        className="mx-auto h-12 w-12 text-slate-300 mb-3" 
      />
      <h3 className="text-lg font-medium text-slate-700 mb-1">
        Нет доступных задач
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto">
        В настоящее время нет задач, которые вы могли бы взять в работу. 
        Новые задачи появятся, когда руководитель добавит их в систему.
      </p>
    </div>
  );
};

export default EmptyAvailableTasks;

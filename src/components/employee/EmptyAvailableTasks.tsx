
import React from "react";
import Icon from "@/components/ui/icon";

const EmptyAvailableTasks: React.FC = () => {
  return (
    <div className="text-center py-8 px-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon name="ClipboardList" className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">Нет доступных задач</h3>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">
        В данный момент нет задач, которые вы могли бы взять в работу. 
        Задачи появятся здесь, когда руководитель создаст их и назначит вам.
      </p>
    </div>
  );
};

export default EmptyAvailableTasks;

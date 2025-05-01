
import React from "react";
import { Project } from "@/types/project";
import {
  AccordionTrigger
} from "@/components/ui/accordion";

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  return (
    <AccordionTrigger className="px-4 py-3 hover:bg-slate-50">
      <div className="flex-1 text-left">
        <span className="font-medium text-slate-900">{project.name}</span>
        <div className="text-sm text-slate-500 font-normal mt-1">
          {project.description}
        </div>
      </div>
    </AccordionTrigger>
  );
};

export default ProjectHeader;

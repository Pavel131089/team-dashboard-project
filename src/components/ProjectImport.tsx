
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription } from './ui/card';
import { toast } from 'sonner';
import { Project, Task } from '../types/project';
import Icon from './ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { ManualProjectForm } from './import/ManualProjectForm';
import { FileImportForm } from './import/FileImportForm';
import { parseCSVFile, parseJSONFile } from './import/fileParsingUtils';

interface ProjectImportProps {
  onImport: (project: Project) => void;
}

const ProjectImport: React.FC<ProjectImportProps> = ({ onImport }) => {
  const [activeTab, setActiveTab] = useState<string>("manual");

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Создать вручную</TabsTrigger>
          <TabsTrigger value="import">Импорт из файла</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="mt-4">
          <ManualProjectForm onImport={onImport} />
        </TabsContent>
        
        <TabsContent value="import" className="mt-4">
          <FileImportForm onImport={onImport} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectImport;

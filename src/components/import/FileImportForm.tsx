
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from "../ui/label";
import { toast } from 'sonner';
import { Project } from '@/types/project';
import { parseCSVFile, parseJSONFile } from './fileParsingUtils';
import { FileImportHelp } from './FileImportHelp';

interface FileImportFormProps {
  onImport: (project: Project) => void;
}

export const FileImportForm: React.FC<FileImportFormProps> = ({ onImport }) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Проверяем тип файла
        if (file.name.endsWith('.csv')) {
          parseCSVFile(e.target?.result as string, onImport, resetForm);
        } else if (file.name.endsWith('.json')) {
          parseJSONFile(e.target?.result as string, onImport, resetForm);
        } else {
          setError('Поддерживаются только файлы .csv и .json');
        }
      } catch (err) {
        console.error('Ошибка обработки файла:', err);
        setError('Ошибка при обработке файла. Проверьте формат данных.');
      }
    };

    reader.onerror = () => {
      setError('Ошибка при чтении файла');
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else if (file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      setError('Поддерживаются только файлы .csv и .json');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Импорт проекта из файла</CardTitle>
        <CardDescription>
          Загрузите файл CSV или JSON с данными о проектах и задачах
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="block text-sm font-medium mb-1">
              Выберите файл
            </Label>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Поддерживаются файлы .csv (разделитель - точка с запятой) и .json
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <FileImportHelp />
        </div>
      </CardContent>
    </Card>
  );
};

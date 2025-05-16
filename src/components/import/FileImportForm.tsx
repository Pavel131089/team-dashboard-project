import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Project } from "@/types/project";
import { parseCSVFile, parseJSONFile } from "./fileParsingUtils";
import { FileImportHelp } from "./FileImportHelp";
import Icon from "../ui/icon";

interface FileImportFormProps {
  onImport: (project: Project) => void;
}

export const FileImportForm: React.FC<FileImportFormProps> = ({ onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Пожалуйста, выберите файл для импорта");
      return;
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "csv" && fileExtension !== "json") {
      toast.error("Поддерживаются только файлы CSV или JSON");
      return;
    }

    setLoading(true);
    try {
      const fileContent = await readFileAsText(file);

      if (fileExtension === "csv") {
        parseCSVFile(fileContent, onImport, resetForm);
      } else if (fileExtension === "json") {
        parseJSONFile(fileContent, onImport, resetForm);
      }
    } catch (error) {
      console.error("Ошибка при импорте файла:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Произошла ошибка при импорте файла",
      );
    } finally {
      setLoading(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Не удалось прочитать файл"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Ошибка при чтении файла"));
      };

      reader.readAsText(file);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Импорт из файла</CardTitle>
        <CardDescription>
          Загрузите CSV или JSON файл с данными проекта
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="file-upload"
              className="block text-sm font-medium mb-1"
            >
              Выберите файл для импорта
            </Label>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Для Excel-файлов: сохраните таблицу как CSV в Excel и затем
              загрузите полученный CSV-файл
            </p>
          </div>

          {file && (
            <div className="bg-blue-50 p-2 rounded text-sm flex items-center">
              <Icon name="FileText" className="mr-2 h-4 w-4 text-blue-500" />
              <span>
                Выбран файл: <strong>{file.name}</strong> (
                {(file.size / 1024).toFixed(2)} КБ)
              </span>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={handleImport} disabled={!file || loading}>
              {loading ? (
                <>
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Импорт...
                </>
              ) : (
                <>
                  <Icon name="Upload" className="mr-2 h-4 w-4" />
                  Импортировать
                </>
              )}
            </Button>
          </div>

          <FileImportHelp />
        </div>
      </CardContent>
    </Card>
  );
};

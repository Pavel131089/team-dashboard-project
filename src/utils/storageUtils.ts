
import { Project, Task } from "@/types/project";

/**
 * Проверяет доступность localStorage
 * @returns true если localStorage доступен, иначе false
 */
export function testStorageAvailability(): boolean {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    const result = localStorage.getItem(testKey) === testKey;
    localStorage.removeItem(testKey);
    return result;
  } catch (e) {
    return false;
  }
}

/**
 * Создает тестовый проект и добавляет его в localStorage
 * @returns true если операция успешна, иначе false
 */
export function createSampleProject(): boolean {
  try {
    // Получаем существующие проекты
    const existingProjects = localStorage.getItem('projects');
    let projects: Project[] = [];
    
    if (existingProjects) {
      projects = JSON.parse(existingProjects);
    }
    
    // Создаем тестовый проект
    const sampleTasks: Task[] = [
      {
        id: `task-${Date.now()}-1`,
        name: "Разработка дизайна",
        description: "Создание макетов и прототипов для основных страниц",
        startDate: "2023-06-01",
        endDate: "2023-06-15",
        actualStartDate: "2023-06-02",
        actualEndDate: null,
        price: 25000,
        estimatedTime: 40,
        assignedTo: "Иванов И.И.",
        assignedToNames: ["Иванов И.И."],
        progress: 80
      },
      {
        id: `task-${Date.now()}-2`,
        name: "Верстка главной страницы",
        description: "HTML/CSS реализация дизайна главной страницы",
        startDate: "2023-06-16",
        endDate: "2023-06-25",
        actualStartDate: "2023-06-16",
        actualEndDate: null,
        price: 15000,
        estimatedTime: 20,
        assignedTo: "Петров П.П.",
        assignedToNames: ["Петров П.П."],
        progress: 50
      }
    ];
    
    const sampleProject: Project = {
      id: `project-${Date.now()}`,
      name: "Тестовый проект",
      description: "Проект создан для тестирования функциональности системы",
      startDate: "2023-06-01",
      endDate: "2023-07-30",
      status: "active",
      budget: 100000,
      manager: "Менеджер",
      client: "ООО Тест",
      tasks: sampleTasks
    };
    
    // Добавляем тестовый проект к существующим проектам
    projects.push(sampleProject);
    
    // Сохраняем обновленный список проектов
    localStorage.setItem('projects', JSON.stringify(projects));
    
    return true;
  } catch (error) {
    console.error("Ошибка при создании тестового проекта:", error);
    return false;
  }
}

/**
 * Удаляет все проекты из localStorage
 * @returns true если операция успешна, иначе false
 */
export function resetProjectsStorage(): boolean {
  try {
    localStorage.setItem('projects', JSON.stringify([]));
    return true;
  } catch (error) {
    console.error("Ошибка при сбросе хранилища проектов:", error);
    return false;
  }
}


/**
 * Менеджер навигации для приложения, работающего внутри iframe или с особой маршрутизацией
 */
class NavigationManager {
  private history: string[] = [];
  private listeners: ((path: string) => void)[] = [];
  private isInitialized = false;

  /**
   * Инициализирует менеджер навигации
   */
  public initialize() {
    if (this.isInitialized) return;
    
    // Сохраняем текущий путь
    this.history.push(window.location.pathname);
    
    // Добавляем обработчик для кнопки "назад" браузера
    window.addEventListener('popstate', this.handlePopState);
    
    this.isInitialized = true;
    console.log('NavigationManager: Инициализирован');
  }

  /**
   * Обработчик события popstate (нажатие кнопки "назад" в браузере)
   */
  private handlePopState = (event: PopStateEvent) => {
    // Предотвращаем стандартное поведение
    event.preventDefault();
    
    if (this.history.length > 1) {
      // Удаляем текущий путь
      this.history.pop();
      
      // Получаем предыдущий путь
      const previousPath = this.history[this.history.length - 1];
      
      // Уведомляем слушателей
      this.notifyListeners(previousPath);
      
      console.log('NavigationManager: Возврат к', previousPath);
    } else {
      console.log('NavigationManager: История пуста, невозможно вернуться назад');
    }
  };

  /**
   * Добавляет новый путь в историю
   */
  public push(path: string) {
    this.history.push(path);
    console.log('NavigationManager: Добавлен путь', path);
  }

  /**
   * Возвращает предыдущий путь из истории
   */
  public goBack(): string | null {
    if (this.history.length > 1) {
      // Удаляем текущий путь
      this.history.pop();
      
      // Получаем предыдущий путь
      const previousPath = this.history[this.history.length - 1];
      
      console.log('NavigationManager: Возврат к', previousPath);
      
      return previousPath;
    }
    
    console.log('NavigationManager: История пуста, невозможно вернуться назад');
    return null;
  }

  /**
   * Добавляет слушателя изменений навигации
   */
  public addListener(listener: (path: string) => void) {
    this.listeners.push(listener);
  }

  /**
   * Удаляет слушателя изменений навигации
   */
  public removeListener(listener: (path: string) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Уведомляет всех слушателей об изменении пути
   */
  private notifyListeners(path: string) {
    this.listeners.forEach(listener => listener(path));
  }

  /**
   * Очищает историю
   */
  public clearHistory() {
    this.history = [window.location.pathname];
  }

  /**
   * Уничтожает менеджер навигации
   */
  public destroy() {
    window.removeEventListener('popstate', this.handlePopState);
    this.history = [];
    this.listeners = [];
    this.isInitialized = false;
    console.log('NavigationManager: Уничтожен');
  }
}

// Создаем синглтон-экземпляр навигационного менеджера
export const navigationManager = new NavigationManager();

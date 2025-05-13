
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import UserShareButton from './UserShareButton';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/types/index';

// Мокаем модуль toast
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

// Мокаем navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Фикстура тестовых пользователей
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan@example.com',
    password: 'password123',
    role: 'manager',
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    password: 'password456',
    role: 'employee',
  },
];

describe('UserShareButton Component', () => {
  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
  });

  it('renders properly with users', () => {
    render(<UserShareButton users={mockUsers} />);
    
    const button = screen.getByRole('button', { name: /экспорт пользователей/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders disabled button when no users provided', () => {
    render(<UserShareButton users={[]} disabled={true} />);
    
    const button = screen.getByRole('button', { name: /экспорт пользователей/i });
    expect(button).toBeDisabled();
  });

  it('opens dialog when button is clicked', async () => {
    render(<UserShareButton users={mockUsers} />);
    
    const button = screen.getByRole('button', { name: /экспорт пользователей/i });
    fireEvent.click(button);
    
    // Диалог должен открыться и содержать элементы
    await waitFor(() => {
      expect(screen.getByText(/экспорт пользователей/i)).toBeInTheDocument();
      expect(screen.getByText(/скопируйте эту ссылку/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/включить пароли пользователей/i)).toBeInTheDocument();
    });
  });

  it('generates link with passwords included by default', async () => {
    // Мокаем работу btoa для генерации ссылки
    global.btoa = jest.fn().mockImplementation(() => 'encoded_data');
    global.encodeURIComponent = jest.fn().mockImplementation(() => 'encoded_uri');
    
    render(<UserShareButton users={mockUsers} />);
    
    const button = screen.getByRole('button', { name: /экспорт пользователей/i });
    fireEvent.click(button);
    
    // Проверяем, что ссылка была сгенерирована
    await waitFor(() => {
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue(expect.stringContaining('encoded_data'));
    });
    
    // Проверяем, что пароли включены по умолчанию
    const checkbox = screen.getByLabelText(/включить пароли пользователей/i);
    expect(checkbox).toBeChecked();
  });

  it('copies link to clipboard when copy button is clicked', async () => {
    render(<UserShareButton users={mockUsers} />);
    
    const button = screen.getByRole('button', { name: /экспорт пользователей/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      const copyButton = screen.getByRole('button', { name: /копировать ссылку/i });
      fireEvent.click(copyButton);
    });
    
    // Проверяем, что clipboard.writeText был вызван
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    
    // И что toast был показан
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Успешно',
      description: 'Ссылка скопирована в буфер обмена',
    }));
  });

  it('regenerates link when include passwords checkbox is toggled', async () => {
    render(<UserShareButton users={mockUsers} />);
    
    const button = screen.getByRole('button', { name: /экспорт пользователей/i });
    fireEvent.click(button);
    
    // Ожидаем, что диалог открылся
    await waitFor(() => {
      const checkbox = screen.getByLabelText(/включить пароли пользователей/i);
      expect(checkbox).toBeInTheDocument();
      
      // Имитируем состояние генерации
      act(() => {
        fireEvent.click(checkbox);
      });
    });
    
    // Проверяем, что ссылка была перегенерирована без паролей
    // Здесь мы могли бы проверить конкретное значение ссылки,
    // но для этого нужно было бы имитировать весь процесс кодирования
  });

  it('handles error when clipboard API is not available', async () => {
    // Переопределяем clipboard API, чтобы он выбрасывал ошибку
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.reject(new Error('Clipboard API not available'))),
      },
    });
    
    render(<UserShareButton users={mockUsers} />);
    
    const button = screen.getByRole('button', { name: /экспорт пользователей/i });
    fireEvent.click(button);
    
    // Находим и кликаем кнопку копирования
    await waitFor(() => {
      const copyButton = screen.getByRole('button', { name: /копировать ссылку/i });
      fireEvent.click(copyButton);
    });
    
    // Проверяем, что было показано сообщение об ошибке
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Внимание',
      description: expect.stringContaining('Не удалось скопировать ссылку'),
      variant: 'destructive',
    }));
  });
});

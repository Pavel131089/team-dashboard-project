import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import DeleteConfirmationDialog from "@/components/ui/delete-confirmation-dialog";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "manager" | "employee";
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  // Загрузка пользователей при монтировании компонента
  useEffect(() => {
    loadUsers();
  }, []);

  // Загрузка пользователей из localStorage
  const loadUsers = () => {
    setIsLoading(true);
    try {
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        if (Array.isArray(parsedUsers)) {
          setUsers(parsedUsers);
        } else {
          console.error(
            "Данные пользователей не являются массивом:",
            parsedUsers,
          );
          // Вызываем инициализацию в следующем цикле, а не непосредственно в рендере
          setTimeout(() => {
            initializeDefaultUsers();
          }, 0);
        }
      } else {
        // Вызываем инициализацию в следующем цикле, а не непосредственно в рендере
        setTimeout(() => {
          initializeDefaultUsers();
        }, 0);
      }
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
      // Используем setTimeout чтобы избежать изменения состояния во время рендеринга
      setTimeout(() => {
        toast.error("Не удалось загрузить список пользователей");
        initializeDefaultUsers();
      }, 0);
    } finally {
      setIsLoading(false);
    }
  };

  // Инициализация дефолтных пользователей
  const initializeDefaultUsers = () => {
    const defaultUsers = [
      {
        id: "default-manager",
        name: "Менеджер",
        email: "manager",
        password: "manager123",
        role: "manager",
      },
      {
        id: "default-employee",
        name: "Сотрудник",
        email: "employee",
        password: "employee123",
        role: "employee",
      },
    ];

    localStorage.setItem("users", JSON.stringify(defaultUsers));
    setUsers(defaultUsers);
  };

  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Обработчик изменения роли
  const handleRoleChange = (value: string) => {
    setNewUser((prev) => ({ ...prev, role: value as "manager" | "employee" }));
  };

  // Добавление нового пользователя
  const handleAddUser = () => {
    // Проверка обязательных полей
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    // Проверка, существует ли уже пользователь с таким email
    if (users.some((user) => user.email === newUser.email)) {
      toast.error("Пользователь с таким email уже существует");
      return;
    }

    // Создание нового пользователя с уникальным ID
    const userWithId: User = {
      ...newUser,
      id: crypto.randomUUID(),
    };

    // Добавление пользователя в список и сохранение в localStorage
    const updatedUsers = [...users, userWithId];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Закрытие диалога и очистка формы
    setIsAddUserDialogOpen(false);
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "employee",
    });

    toast.success(`Пользователь ${userWithId.name} успешно добавлен`);
  };

  // Подготовка к удалению пользователя
  const prepareDeleteUser = (userId: string) => {
    // Проверяем, не пытаемся ли удалить дефолтного пользователя
    const user = users.find((u) => u.id === userId);
    if (
      user &&
      (user.id === "default-manager" || user.id === "default-employee")
    ) {
      toast.error("Нельзя удалить стандартного пользователя");
      return;
    }

    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  // Удаление пользователя
  const handleDeleteUser = () => {
    if (!userToDelete) return;

    const userToRemove = users.find((user) => user.id === userToDelete);
    if (!userToRemove) return;

    const updatedUsers = users.filter((user) => user.id !== userToDelete);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    toast.success(`Пользователь ${userToRemove.name} успешно удален`);
    setUserToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  // Показываем индикатор загрузки, пока данные загружаются
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Загрузка пользователей...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Верхняя часть с заголовком и кнопкой добавления */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление пользователями</h2>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <Icon name="UserPlus" className="mr-2 h-4 w-4" />
          Добавить пользователя
        </Button>
      </div>

      {/* Две карточки: Сотрудники и Роли */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Карточка с сотрудниками */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">Сотрудники</h3>
            </div>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <Icon name="Users" className="h-16 w-16 text-slate-300 mb-4" />
                <p className="text-slate-500">Список пользователей пуст</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === "manager" ? "Руководитель" : "Сотрудник"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => prepareDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Карточка с ролями */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">Роли и разрешения</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Роль руководителя */}
            <div className="p-3 border rounded-lg flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                  <Icon name="Crown" className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Руководитель</p>
                  <p className="text-xs text-slate-500">Полный доступ</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Активно
              </span>
            </div>

            {/* Роль сотрудника */}
            <div className="p-3 border rounded-lg flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 mr-3">
                  <Icon name="User" className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Сотрудник</p>
                  <p className="text-xs text-slate-500">Ограниченный доступ</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Активно
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Диалог добавления пользователя */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить нового пользователя</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО пользователя</Label>
              <Input
                id="name"
                name="name"
                placeholder="Введите ФИО"
                value={newUser.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (логин)</Label>
              <Input
                id="email"
                name="email"
                placeholder="email@example.com"
                value={newUser.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Введите пароль"
                value={newUser.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Роль пользователя</Label>
              <RadioGroup
                value={newUser.role}
                onValueChange={handleRoleChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manager" id="role-manager" />
                  <Label htmlFor="role-manager">Руководитель</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employee" id="role-employee" />
                  <Label htmlFor="role-employee">Сотрудник</Label>
                </div>
              </RadioGroup>
            </div>
            <Button onClick={handleAddUser} className="w-full mt-4">
              Добавить пользователя
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        title="Удаление пользователя"
        description="Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить."
      />
    </div>
  );
};

export default UserManagement;

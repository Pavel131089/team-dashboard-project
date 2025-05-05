
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/index";

interface CreateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (user: Omit<User, "id">) => boolean;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  onCreateUser 
}) => {
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    password: "",
    role: "employee"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setNewUser(prev => ({ ...prev, role: value as "manager" | "employee" }));
  };

  const handleSubmit = () => {
    // Проверка обязательных полей
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    // Вызываем функцию создания пользователя
    const success = onCreateUser(newUser);
    
    // Сбрасываем форму в случае успеха
    if (success) {
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "employee"
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>
            <Icon name="UserPlus" className="mr-2 h-4 w-4" />
            Добавить пользователя
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать нового пользователя</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <UserFormFields 
              user={newUser} 
              onInputChange={handleInputChange}
              onRoleChange={handleRoleChange}
            />
            <Button 
              onClick={handleSubmit} 
              className="w-full mt-4"
            >
              Создать пользователя
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface UserFormFieldsProps {
  user: Omit<User, "id">;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (value: string) => void;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ 
  user, 
  onInputChange, 
  onRoleChange 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">ФИО пользователя</Label>
        <Input
          id="name"
          name="name"
          placeholder="Введите ФИО"
          value={user.name}
          onChange={onInputChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email (логин)</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="email@example.com"
          value={user.email}
          onChange={onInputChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Введите пароль"
          value={user.password}
          onChange={onInputChange}
        />
      </div>
      <div className="space-y-2">
        <Label>Роль пользователя</Label>
        <RadioGroup
          value={user.role}
          onValueChange={onRoleChange}
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
    </>
  );
};

export default CreateUserDialog;


import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import { LoginFormData } from "@/hooks/useAuth";

/**
 * Компонент отображения ошибки авторизации
 */
export const LoginError = ({ message }: { message: string }) => {
  return (
    <Alert variant="destructive">
      <Icon name="AlertTriangle" className="h-4 w-4" />
      <AlertTitle>Ошибка</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

/**
 * Компонент с демонстрационными учетными данными
 */
export const DemoCredentials = () => {
  return (
    <div className="pt-2 text-sm text-slate-500">
      <p>Для демо-доступа используйте:</p>
      <ul className="list-disc pl-5 mt-1 space-y-1">
        <li>Руководитель: <span className="font-medium">manager / manager123</span></li>
        <li>Сотрудник: <span className="font-medium">employee / employee123</span></li>
      </ul>
    </div>
  );
};

/**
 * Компонент формы входа в систему
 */
interface LoginFormProps {
  formData: LoginFormData;
  error: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm = ({
  formData,
  error,
  onInputChange,
  onRoleChange,
  onSubmit
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <CardContent className="space-y-4">
        {error && <LoginError message={error} />}
        
        <UsernameField value={formData.username} onChange={onInputChange} />
        <PasswordField value={formData.password} onChange={onInputChange} />
        <RoleSelector value={formData.role} onChange={onRoleChange} />
        
        <DemoCredentials />
      </CardContent>
      
      <CardFooter>
        <Button type="submit" className="w-full">Войти</Button>
      </CardFooter>
    </form>
  );
};

/**
 * Поле для ввода имени пользователя
 */
const UsernameField = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="username">Имя пользователя</Label>
      <Input
        id="username"
        name="username"
        placeholder="Введите имя пользователя"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

/**
 * Поле для ввода пароля
 */
const PasswordField = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="password">Пароль</Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Введите пароль"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

/**
 * Выбор роли пользователя
 */
const RoleSelector = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void 
}) => {
  return (
    <div className="space-y-2">
      <Label>Выберите роль</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manager" id="manager" />
          <Label htmlFor="manager">Руководитель</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="employee" id="employee" />
          <Label htmlFor="employee">Сотрудник</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default LoginForm;

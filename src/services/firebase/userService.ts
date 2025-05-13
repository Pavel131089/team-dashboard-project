
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  getDocs, 
  where, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { db } from "./firebase";
import { User, UserRole } from "@/types/index";

/**
 * Сервис для работы с пользователями в Firestore
 */
export const firebaseUserService = {
  /**
   * Дефолтные пользователи для демо-доступа
   */
  defaultUsers: [
    {
      id: "default-manager",
      name: "Менеджер",
      email: "manager@example.com",
      password: "manager123", // В реальном приложении храним только хэш
      role: "manager" as UserRole
    },
    {
      id: "default-employee",
      name: "Сотрудник",
      email: "employee@example.com",
      password: "employee123", // В реальном приложении храним только хэш
      role: "employee" as UserRole
    }
  ],

  /**
   * Получение пользователя по ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      
      return null;
    } catch (error) {
      console.error("Ошибка при получении пользователя:", error);
      return null;
    }
  },

  /**
   * Получение пользователя по email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      // Проверяем дефолтных пользователей
      if (email === "manager" || email === "manager@example.com") {
        return this.defaultUsers[0];
      }
      
      if (email === "employee" || email === "employee@example.com") {
        return this.defaultUsers[1];
      }

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      
      return null;
    } catch (error) {
      console.error("Ошибка при получении пользователя по email:", error);
      return null;
    }
  },

  /**
   * Получение всех пользователей
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      
      const users = querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() } as User;
      });
      
      // Добавляем дефолтных пользователей, если их нет в базе
      const managerExists = users.some(user => user.email === "manager@example.com");
      const employeeExists = users.some(user => user.email === "employee@example.com");
      
      if (!managerExists) {
        users.push(this.defaultUsers[0]);
      }
      
      if (!employeeExists) {
        users.push(this.defaultUsers[1]);
      }
      
      return users;
    } catch (error) {
      console.error("Ошибка при получении всех пользователей:", error);
      return this.defaultUsers; // В случае ошибки возвращаем хотя бы дефолтных пользователей
    }
  },

  /**
   * Создание нового пользователя
   */
  async createUser(user: Omit<User, "id">): Promise<User | null> {
    try {
      // Проверяем, существует ли пользователь с таким email
      const existingUser = await this.getUserByEmail(user.email);
      
      if (existingUser) {
        console.error("Пользователь с таким email уже существует");
        return null;
      }
      
      // Генерируем ID
      const newUserId = crypto.randomUUID();
      const newUser = { id: newUserId, ...user };
      
      // Сохраняем пользователя
      await setDoc(doc(db, "users", newUserId), newUser);
      
      return newUser;
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
      return null;
    }
  },

  /**
   * Обновление пользователя
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<boolean> {
    // Не позволяем обновлять дефолтных пользователей
    if (userId === "default-manager" || userId === "default-employee") {
      console.warn("Нельзя обновлять дефолтных пользователей");
      return false;
    }
    
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, userData);
      return true;
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
      return false;
    }
  },

  /**
   * Удаление пользователя
   */
  async deleteUser(userId: string): Promise<boolean> {
    // Не позволяем удалять дефолтных пользователей
    if (userId === "default-manager" || userId === "default-employee") {
      console.warn("Нельзя удалять дефолтных пользователей");
      return false;
    }
    
    try {
      await deleteDoc(doc(db, "users", userId));
      return true;
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      return false;
    }
  },

  /**
   * Проверка учетных данных пользователя
   */
  async validateCredentials(email: string, password: string, role: UserRole): Promise<User | null> {
    // Проверяем дефолтных пользователей
    if ((email === "manager" || email === "manager@example.com") && 
        password === "manager123" && 
        role === "manager") {
      return this.defaultUsers[0];
    }
    
    if ((email === "employee" || email === "employee@example.com") && 
        password === "employee123" && 
        role === "employee") {
      return this.defaultUsers[1];
    }
    
    try {
      const user = await this.getUserByEmail(email);
      
      if (user && user.password === password && user.role === role) {
        return user;
      }
      
      return null;
    } catch (error) {
      console.error("Ошибка при проверке учетных данных:", error);
      return null;
    }
  },

  /**
   * Инициализация дефолтных пользователей
   */
  async initializeDefaultUsers(): Promise<void> {
    try {
      // Проверяем наличие дефолтных пользователей
      const manager = await this.getUserByEmail("manager@example.com");
      const employee = await this.getUserByEmail("employee@example.com");
      
      if (!manager) {
        await setDoc(doc(db, "users", "default-manager"), this.defaultUsers[0]);
        console.log("Дефолтный менеджер добавлен в БД");
      }
      
      if (!employee) {
        await setDoc(doc(db, "users", "default-employee"), this.defaultUsers[1]);
        console.log("Дефолтный сотрудник добавлен в БД");
      }
    } catch (error) {
      console.error("Ошибка при инициализации дефолтных пользователей:", error);
    }
  }
};

export default firebaseUserService;

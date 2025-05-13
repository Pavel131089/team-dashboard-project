
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseConfig } from "./config";

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Доступ к Firestore (база данных)
export const db = getFirestore(app);

// Доступ к сервису аутентификации
export const auth = getAuth(app);

/**
 * Сервис для работы с аутентификацией Firebase
 */
export const firebaseAuthService = {
  /**
   * Регистрация нового пользователя
   */
  async registerUser(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error("Ошибка при регистрации:", error);
      return { 
        success: false, 
        error: error.code === 'auth/email-already-in-use' 
          ? 'Пользователь с таким email уже существует' 
          : 'Ошибка при регистрации' 
      };
    }
  },

  /**
   * Вход пользователя
   */
  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error("Ошибка при входе:", error);
      return { 
        success: false, 
        error: error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
          ? 'Неверный email или пароль'
          : 'Ошибка при входе' 
      };
    }
  },

  /**
   * Выход пользователя
   */
  async logoutUser() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      return { success: false, error: 'Ошибка при выходе из системы' };
    }
  },

  /**
   * Получение текущего пользователя
   */
  getCurrentUser() {
    return auth.currentUser;
  }
};

export default { db, auth, firebaseAuthService };

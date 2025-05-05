
import React from "react";
import { User } from "@/types/index";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import UserEmptyState from "./UserEmptyState";

interface UserListProps {
  users: User[];
  onDeleteUser: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onDeleteUser }) => {
  if (users.length === 0) {
    return <UserEmptyState />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ФИО</TableHead>
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
                variant="destructive" 
                size="sm"
                onClick={() => onDeleteUser(user.id)}
              >
                <Icon name="Trash2" className="mr-1 h-4 w-4" />
                Удалить
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserList;

export enum RoleEnum {
  ADMIN = 'ADMIN',
  SUPER_USER = 'SUPER_USER',
  PHOTOGRAPHER = 'PHOTOGRAPHER',
  EMPLOYEE = 'EMPLOYEE',
  // DEVELOPER = 'DEVELOPER',
  USER = 'USER',
  OWNER = 'OWNER',
}

export const userRolesArray = Object.values(RoleEnum)

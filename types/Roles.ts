export enum RoleEnum {
  ADMIN = 'ADMIN',
  SUPER_USER = 'SUPER_USER',
  OWNER = 'OWNER',
  PHOTOGRAPHER = 'PHOTOGRAPHER',
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
  DEVELOPER = 'DEVELOPER',
  USER = 'USER',
}

export const userRolesArray = Object.values(RoleEnum)

export enum RoleEnum {
  ADMIN = 'ADMIN',
  SUPER_USER = 'SUPER_USER',
  COMPANY = 'COMPANY',
  PHOTOGRAPHER = 'PHOTOGRAPHER',
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
  DEVELOPER = 'DEVELOPER',
  USER = 'USER',
}

export const userRolesArray = Object.values(RoleEnum)

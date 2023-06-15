import {
  ArchiveBoxIcon,
  BellAlertIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  ExclamationCircleIcon,
  HomeIcon,
  ListBulletIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import { RouteNames } from './routes'

export const ADMIN_MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: HomeIcon,
    linkName: 'admin',
    isAdmin: true,
  },
  {
    label: 'Tous les événements',
    icon: CalendarDaysIcon,
    linkName: 'admin-events',
    isAdmin: true,
  },
  {
    label: 'Utilisateurs',
    icon: UserGroupIcon,
    linkName: 'admin-user',
    isAdmin: true,
  },
  {
    label: 'Destinataires',
    icon: UsersIcon,
    linkName: 'admin-destinataires',
    isAdmin: true,
  },
  {
    label: 'Bugs et Problèmes',
    icon: ExclamationCircleIcon,
    linkName: 'admin-bug',
    isAdmin: true,
  },
  {
    label: 'Newsletter Statistiques',
    icon: ChartPieIcon,
    linkName: 'admin-newsletter',
    isAdmin: true,
  },
  {
    label: 'Créer un événement',
    icon: PlusIcon,
    linkName: RouteNames.CREATE_EVENT_STEP_1,
    isAdmin: true,
  },
  {
    label: 'Créer un destinataire',
    icon: PlusIcon,
    linkName: RouteNames.EMPLOYEE_CREATE,
    isAdmin: true,
  },
]

export const MENU_ITEMS = [
  {
    label: 'Mes événements',
    icon: HomeIcon,
    linkName: 'evenement',
    isAdmin: false,
  },
  {
    label: 'Événements Archivés',
    icon: ArchiveBoxIcon,
    linkName: 'evenement-archives',
    isAdmin: false,
  },
  {
    label: 'Destinataires',
    icon: UsersIcon,
    linkName: 'destinataire',
    isAdmin: false,
  },
  {
    label: 'Groupes de diffusion',
    icon: ListBulletIcon,
    linkName: 'groupe',
    isAdmin: false,
  },
  {
    label: 'Notifications',
    icon: BellAlertIcon,
    linkName: 'notifications',
    isAdmin: false,
  },
  {
    label: 'Créer un événement',
    icon: PlusIcon,
    linkName: RouteNames.CREATE_EVENT_STEP_1,
    isAdmin: false,
  },
  {
    label: 'Créer un destinataire',
    icon: PlusIcon,
    linkName: RouteNames.EMPLOYEE_CREATE,
    isAdmin: false,
  },
  {
    label: 'Créer un groupe de diffusion',
    icon: PlusIcon,
    linkName: 'groupe-creation',
    isAdmin: false,
  },
]

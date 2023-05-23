import {
  AdjustmentsVerticalIcon,
  ArchiveBoxIcon,
  BellAlertIcon,
  ChartPieIcon,
  ExclamationCircleIcon,
  HomeIcon,
  ListBulletIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import { RouteNames } from './routes'

export const MENU_ITEMS = [
  {
    label: 'Administration',
    icon: AdjustmentsVerticalIcon,
    linkName: 'Admin',
    isAdmin: true,
    children: [
      {
        label: 'Utilisateurs',
        icon: UserGroupIcon,
        linkName: 'user',
        isAdmin: true,
      },
      {
        label: 'Bugs et Problèmes',
        icon: ExclamationCircleIcon,
        linkName: 'bug',
        isAdmin: true,
      },
      {
        label: 'Newsletter Statistiques',
        icon: ChartPieIcon,
        linkName: 'newsletter',
        isAdmin: true,
      },
    ],
  },
  {
    label: 'Événements',
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
    children: [
      {
        label: 'Sélectionner des destinataires',
        icon: PlusIcon,
        linkName: RouteNames.GROUP_CREATE,
        isAdmin: false,
      },
      {
        label: 'À partir d\'un CSV',
        icon: PlusIcon,
        linkName: RouteNames.GROUP_CREATE_CSV,
        isAdmin: false,
      },

    ],
  },
]

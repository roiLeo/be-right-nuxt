import {
  BellAlertIcon,
  ChartPieIcon,
  ExclamationCircleIcon,
  HomeIcon,
  ListBulletIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'

export const MENU_ITEMS = [
  {
    label: 'Événements',
    icon: HomeIcon,
    linkName: 'evenement',
    isAdmin: true,
  },
  {
    label: 'Utilisateurs',
    icon: UserGroupIcon,
    linkName: 'user',
    isAdmin: true,
  },
  {
    label: 'Destinataires',
    icon: UsersIcon,
    linkName: 'destinataire',
    isAdmin: true,
  },
  // {
  //   label: 'Fichiers',
  //   icon: FolderOpenIcon,
  //   // linkName: 'files',
  //   isAdmin: true,
  // },
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
  {
    label: 'Créer un événement',
    icon: PlusIcon,
    linkName: 'evenement-create',
    isAdmin: true,
  },
  {
    label: 'Créer un destinataire',
    icon: PlusIcon,
    linkName: 'destinataire-create',
    isAdmin: true,
  },
  // {
  //   label: 'Créer un nouveau fichier',
  //   icon: FolderPlusIcon,
  //   // linkName: 'files.create',
  //   isAdmin: true,
  // },

  // user
  {
    label: 'Événements',
    icon: HomeIcon,
    linkName: 'evenement',
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
    linkName: 'evenement-create',
    isAdmin: false,
  },
  {
    label: 'Créer un destinataire',
    icon: PlusIcon,
    linkName: 'destinataire-create',
    isAdmin: false,
  },
  {
    label: 'Créer un groupe de diffusion',
    icon: PlusIcon,
    linkName: 'groupe-creation',
    isAdmin: false,
  },
  // {
  //   label: 'Créer un nouveau fichier',
  //   icon: FolderPlusIcon,
  //   // linkName: 'user.files.create-model',
  //   isAdmin: false,
  // },
]

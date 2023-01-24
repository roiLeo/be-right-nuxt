<template>
<div
  v-if="event"
  class="shadow-lg rounded-b-md"
>
  <header class="py-8 rounded-t-lg bg-gray-50">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-10">
          <h1 class="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {{ event.name }}
          </h1>
          <EventStatusTag :status="event.status" />
        </div>
        <div class="flex flex-col mt-1 sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-8">
          <div class="flex items-center mt-2 text-sm text-gray-500">
            <MapPinIconOutline
              class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            {{ eventAddress?.city }}
          </div>
          <div class="flex items-center mt-2 text-sm text-gray-500">
            <CalendarDaysIconOutline
              class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Se termine le {{ toFormat(event.end, 'DD MMMM YYYY') }}
          </div>
        </div>
      </div>
      <div
        class="flex flex-col items-center justify-center mt-5 space-y-4"
      >
        <div class="flex flex-col items-center justify-center mt-5 space-y-4 md:flex-row md:space-y-0 md:space-x-4 xl:mt-0 xl:ml-4">
          <BaseButton
            :href="{
              name: 'evenement-edit-id',
              params: { id: event?.id.toString() },
            }"
          >
            <template #icon>
              <PencilSquareIconOutline
                class="w-5 h-5"
                aria-hidden="true"
              />
            </template>
            Modifier
          </BaseButton>
          <BaseButton
            color="red"
            @click="deleteEvent"
          >
            <template #icon>
              <TrashIconOutline
                class="w-5 h-5"
                aria-hidden="true"
              />
            </template>
            Supprimer
          </BaseButton>
        </div>
        <!-- <EmployeeCreator :employee-creator="userStore.getOne(event.createdByUser)" /> -->
      </div>
    </div>
  </header>

  <main class="pt-8 pb-16 rounded-b-lg dark:bg-white">
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="px-4 sm:px-0">
        <h2 class="text-lg font-medium text-gray-900">
          Destinataires
        </h2>

        <!-- Tabs -->
        <TabGroup :default-index="0">
          <TabList
            class="flex items-center mt-2 -mb-px space-x-8 border-b border-gray-200"
            aria-label="Tabs"
          >
            <Tab
              v-slot="{ selected }"
              :disabled="employees.length === 0"
            >
              <div
                class="px-1 py-4 font-medium border-b-2 whitespace-nowrap"
                :class="[selected ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                         { 'cursor-not-allowed opacity-50': employees.length === 0 }]"
              >
                <span>Inscrits</span>
                <span
                  class="hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                  :class="[selected ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-900']"
                >{{
                  employees.length
                }}</span>
              </div>
            </Tab>
            <Tab
              v-slot="{ selected }"
              :disabled="files.length === 0"
            >
              <div
                class="px-1 py-4 font-medium border-b-2 whitespace-nowrap"
                :class="[selected ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                         { 'cursor-not-allowed opacity-50': files.length === 0 }]"
              >
                <span>Fichiers</span>
                <span
                  class="hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                  :class="[selected ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-900']"
                >{{
                  files.length
                }}</span>
              </div>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ul
                role="list"
                class="mt-5 border-t border-gray-200 divide-y divide-gray-200 sm:mt-0 sm:border-t-0"
              >
                <li
                  v-for="employee in employees"
                  :key="employee.id"
                >
                  <NuxtLink
                    :to="{
                      name: 'destinataire-show-id',
                      params: {
                        id: employee.id,
                      },
                    }"
                    class="block group"
                  >
                    <div class="flex items-center px-4 py-5 sm:py-6 sm:px-0">
                      <div class="flex items-center flex-1 min-w-0">
                        <div class="flex-1 min-w-0 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p class="text-sm font-medium text-purple-600 truncate">
                              {{ employee.firstName }}
                              {{ employee.lastName }}
                            </p>
                            <p class="flex items-center mt-2 text-sm text-gray-500">
                              <EnvelopeIconOutline
                                class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <span class="truncate">{{ employee.email }}</span>
                            </p>
                            <p class="flex items-center mt-2 text-sm text-gray-500">
                              <PhoneIconOutline
                                class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <span class="truncate">{{ employee.phone }}</span>
                            </p>
                          </div>
                          <div
                            v-if="getAnswerForEmployee(employee.id).value?.createdAt"
                            class="hidden md:block"
                          >
                            <p class="text-sm text-gray-900">
                              Ajouté le
                              <time>{{ toFormat(getAnswerForEmployee(employee.id).value?.createdAt!, 'D MMMM YYYY') }}</time>
                            </p>
                            <p
                              v-if="getAnswerForEmployee(employee.id).value?.hasSigned && getAnswerForEmployee(employee.id).value?.signetAt"
                              class="flex items-center mt-2 text-sm text-gray-500"
                            >
                              <CheckCircleIconOutline
                                class="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                                aria-hidden="true"
                              />
                              <span>Signé</span>
                            </p>
                            <p
                              v-else-if="!getAnswerForEmployee(employee.id).value?.hasSigned && getAnswerForEmployee(employee.id).value?.signetAt"
                              class="flex items-center mt-2 text-sm text-gray-500"
                            >
                              <XCircleIconOutline
                                class="flex-shrink-0 mr-1.5 h-5 w-5 text-red-400"
                                aria-hidden="true"
                              />
                              <span>Refusé</span>
                            </p>
                            <p
                              v-else
                              class="flex items-center mt-2 text-sm text-gray-500"
                            >
                              <!-- TODO send email to employee again -->
                              <BaseButton disabled>
                                <template #icon>
                                  <EnvelopeIconOutline
                                    class="text-gray-200"
                                    aria-hidden="true"
                                  />
                                </template>
                                Relancer
                              </BaseButton>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NuxtLink>
                </li>
              </ul>
            </TabPanel>
            <TabPanel>
              <ul
                role="list"
                class="mt-5 border-t border-gray-200 divide-y divide-gray-200 sm:mt-0 sm:border-t-0"
              >
                <li
                  v-for="file in files"
                  :key="file.id"
                  class="block group"
                >
                  <div class="flex items-center px-4 py-5 sm:py-6 sm:px-0">
                    <div class="flex items-center flex-1 min-w-0">
                      <div class="flex-1 min-w-0 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <p class="text-sm font-medium text-purple-600 truncate">
                            {{ file.name }}
                          </p>
                          <p class="flex items-center mt-2 text-sm text-gray-500">
                            <InformationCircleIconOutline
                              class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <span class="truncate">{{ file.description }}</span>
                          </p>
                        </div>
                        <div class="hidden md:block">
                          <div>
                            <p class="text-sm text-gray-900">
                              Créé le
                              {{ ' ' }}
                              <time :datetime="toFormat(file.createdAt, 'DD/MM/YYYY')">{{
                                toFormat(file.createdAt,
                                         'DD/MM/YYYY')
                              }}</time>
                            </p>
                          </div>
                          <FileTypeTag :type="file.type" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <button>
                        <!-- TODO add link to file detail -->
                        <ChevronRightIconOutline
                          class="w-5 h-5 text-gray-400 group-hover:text-gray-700"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  </main>
</div>
</template>

<script setup lang="ts">
import { ModalModeEnum, ModalNameEnum } from '@/types'
import { useAddressStore, useAnswerStore, useEmployeeStore, useEventStore, useFileStore, useUiStore, useUserStore } from '~~/store'

interface Props {
  eventId: number
}

const props = defineProps<Props>()

const eventStore = useEventStore()
const { toFormat } = dateHook()
const { isNotPersonnalFile } = fileHook()
const employeeStore = useEmployeeStore()
const fileStore = useFileStore()
const answerStore = useAnswerStore()
const addressStore = useAddressStore()
const { setUiModal } = useUiStore()

const event = computed(() => eventStore.getOne(props.eventId))

const eventAddress = computed(() => {
  if (event.value) {
    if (event.value.addressId) {
      return addressStore.getOne(event.value?.addressId as number)
    }
  }
  return null
})

const answers = computed(() => answerStore.getManyByEventId(props.eventId))

const employees = computed(() => {
  const employeesIds = answers.value.map(answer => answer.employeeId)
  return employeeStore.getWhereArray(emp => employeesIds.includes(emp.id))
})

const files = computed(() =>
  fileStore.getWhereArray(file => isNotPersonnalFile(file) && file.eventId === props.eventId),
)

const getAnswerForEmployee = (employeeId: number) => computed(() => {
  return answers.value.find(answer => answer.employeeId === employeeId)
})

function deleteEvent() {
  setUiModal({
    modalName: ModalNameEnum.EVENT_FORM,
    isActive: true,
    modalMode: ModalModeEnum.DELETE,
    data: {
      event: event.value,
    },
  })
}
</script>

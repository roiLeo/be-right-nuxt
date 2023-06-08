<template>
<div
  v-if="event"
  class="shadow-lg rounded-b-md"
>
  <EventDetailsHeader :event="event" />

  <main class="pt-8 pb-16 rounded-b-lg dark:bg-white">
    <div class="mx-auto space-y-4 lg:space-y-6 max-w-7xl sm:px-6 lg:px-8">
      <div
        v-if="event.description"
        class="space-y-2"
      >
        <h4 class="text-lg font-medium text-gray-900">
          Description:
        </h4>
        <p class="text-sm">
          {{ event.description }}
        </p>
      </div>
      <div class="px-4 sm:px-0">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">
            Destinataires
          </h2>

          <BaseButton
            :disabled="!answerStore.canAnswersBeDownload(event.id)"
            :title="!answerStore.canAnswersBeDownload(event.id) ? 'Aucune réponse n\'est pas encore disponible' : 'Télécharger toutes les réponses'"
            :href="`${$getApiUrl}answer/download/?ids=${answersQueryIds}`"
          >
            <template #icon>
              <ArrowDownTrayIconOutline
                aria-hidden="true"
              />
            </template>
            Tout Télécharger
          </BaseButton>
        </div>

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
            <!-- <Tab
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
            </Tab> -->
          </TabList>
          <TabPanels>
            <TabPanel>
              <EventDetailsTabEmployees
                :event-id="eventId"
                :employees="employees"
              />
            </TabPanel>
            <!-- <TabPanel>
              <EventDetailsTabFiles :files="files" />
            </TabPanel> -->
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  </main>
</div>
</template>

<script setup lang="ts">
import {
  useAnswerStore,
  useEmployeeStore,
  useEventStore,
  // useFileStore,
} from '~~/store'

interface Props {
  eventId: number
}

const props = defineProps<Props>()

const eventStore = useEventStore()
// const { isNotPersonnalFile } = fileHook()
const employeeStore = useEmployeeStore()
// const fileStore = useFileStore()
const answerStore = useAnswerStore()
const { isAnswerSigned } = answerHook()

const event = computed(() => eventStore.getOne(props.eventId))

const answers = computed(() => answerStore.getManyByEventId(props.eventId))
const answersQueryIds = computed(() => answers.value.map(answer => answer.id)?.join(','))

const employees = computed(() => {
  const employeesIds = answers.value
    .map(answer => answer.employeeId)
  return employeeStore.getWhereArray(emp => employeesIds.includes(emp.id)).sort((a, b) => {
    return isAnswerSigned(answers.value.find(answer => answer.employeeId === a.id)!) ? 1 : isAnswerSigned(answers.value.find(answer => answer.employeeId === b.id)!) ? 1 : -1
  })
})

// const files = computed(() =>
//   fileStore.getWhereArray(file => isNotPersonnalFile(file) && file.eventId === props.eventId),
// )
</script>

<template>
<BaseModal
  :is-active="isActive"
  @close="close"
>
  <div class="px-4 py-2 overflow-y-visible sm:flex sm:items-start">
    <div
      class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10"
    >
      <ExclamationTriangleIconOutline
        class="w-6 h-6 text-blue-600"
        aria-hidden="true"
      />
    </div>
    <div class="mt-3 space-y-2 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <DialogTitle
        as="h3"
        class="text-lg font-medium leading-6 text-gray-900"
      >
        Ajouter un destinataire à la liste
      </DialogTitle>
    </div>
  </div>
  <div class="flex items-center justify-center">
    <Combobox
      v-slot="{ open }"
      v-model="selected"
      name="employees"
      :multiple="true"
    >
      <div class="relative mt-1">
        <div
          class="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
        >
          <ComboboxInput
            class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0"
            :display-value="(emp: any) => getEmployeeFullname(emp)"
            @change="query = $event.target.value"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIconOutline
              class="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leave-from="opacity-100"
          leave-to="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions class="absolute z-20 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <div
              v-if="filteredEmployee.length === 0 && query !== ''"
              class="relative px-4 py-2 text-gray-700 cursor-default select-none"
            >
              Aucun trouvé
            </div>
            <li
              class="relative py-2 pl-10 pr-4 cursor-pointer select-none hover:bg-teal-600 hover:text-white"
              :class="{
                'text-gray-900': !areAllSelected,
              }"
              @click="toggleSelectAll"
            >
              <span
                class="block truncate"
                :class="{ 'font-medium': areAllSelected, 'font-normal': !areAllSelected }"
              >
                Tout sélectionner
              </span>
              <span
                v-if="areAllSelected"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600"
              >
                <CheckIconOutline
                  class="w-5 h-5"
                  aria-hidden="true"
                />
              </span>
            </li>

            <ComboboxOption
              v-for="employee in filterAlReadyInGroup(filteredEmployee)"
              :key="employee.id"
              v-slot="{ selected, active }"
              as="template"
              :value="employee"
            >
              <li
                class="relative py-2 pl-10 pr-4 cursor-default select-none"
                :class="{
                  'bg-teal-600 text-white': active,
                  'text-gray-900': !active,
                }"
              >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ getEmployeeFullname(employee) }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-teal-600': !active }"
                >
                  <CheckIconOutline
                    class="w-5 h-5"
                    aria-hidden="true"
                  />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>

        <div
          v-if="open"
          class="h-56"
        />

        <div class="mt-4">
          <p
            v-for="(value, index) in selected"
            :key="index"
            class="flex items-center h-8 px-2 py-2 mt-2 mr-2 space-x-2 bg-blue-200 rounded-md text-blue-dark"
          >
            <span>{{ getEmployeeFullname(value) }}</span>
            <button
              type="button"
              @click.prevent="onRemoveValue(index)"
            >
              <XCircleIconSolid class="w-4 h-4 hover:text-red-800" />
            </button>
          </p>
        </div>

        <div class="flex items-center justify-center mt-4 space-x-2">
          <BaseButton @click="close">
            Retour
          </BaseButton>
          <BaseButton
            :disabled="!noNull(selected) || !noUndefined(selected) || selected.length <= 0"
            @click="onSubmit"
          >
            Enregister
          </BaseButton>
        </div>
      </div>
    </Combobox>
  </div>
</BaseModal>
</template>

<script setup lang="ts">
import type { EmployeeType } from '~~/store'
import { useEmployeeStore, useGroupStore, useUiStore } from '~~/store'

interface Props {
  isActive: boolean
  groupId: number
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
}>()

const uiStore = useUiStore()
const employeeStore = useEmployeeStore()
const groupStore = useGroupStore()
const { resetUiModalState } = uiStore
const { getEmployeeFullname } = employeeHook()
const { patchOne } = groupHook()

const selected = ref<EmployeeType[]>([])
const query = ref('')
const router = useRouter()
const route = useRoute()

function filterAlReadyInGroup(employees: EmployeeType[]) {
  const employeesAlReadyInGroup = groupStore.getOne(props.groupId)?.employeeIds
  return employees.filter(emp => !employeesAlReadyInGroup.includes(emp.id))
}

const filteredEmployee = computed(() =>
  query.value === ''
    ? employeeStore.getAllArray
    : employeeStore.getAllArray.filter(person =>
      person.lastName
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, '')),
    ),
)

const areAllSelected = computed(() => filteredEmployee.value.length === selected.value.length)

function onRemoveValue(index: number) {
  selected.value.splice(index, 1)
}

function toggleSelectAll() {
  if (filteredEmployee.value.length === selected.value.length) {
    selected.value = []
  } else {
    selected.value = filteredEmployee.value
  }
}

function close() {
  resetUiModalState()
  emit('close')
}

async function onSubmit() {
  if (selected?.value.length > 0 && props.groupId) {
    const group = groupStore.getOne(props.groupId)
    await patchOne(props.groupId, {
      ...group,
      employeeIds: [
        ...group.employeeIds,
        ...selected.value.map(emp => emp.id),
      ],
    })

    close()

    if (route.name !== 'groupe-show-id') {
      router.push({
        name: 'groupe',
      })
    }
  }
}
</script>

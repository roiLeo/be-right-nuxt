<template>
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
                <time :datetime="$toFormat(file.createdAt, 'DD/MM/YYYY')">{{
                  $toFormat(file.createdAt,
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
</template>

<script setup lang="ts">
import type { FileType } from '~~/types'

interface Props {
  files: FileType[]
}

withDefaults(defineProps<Props>(), {
  files: () => [],
})
</script>

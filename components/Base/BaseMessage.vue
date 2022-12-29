<template>
<div
  class="flex px-10 py-6 border-2 rounded-lg"
  :class="colorClasses"
>
  <InformationCircleIconOutline
    v-if="type === 'default'"
    class="w-6 h-6 mr-4 text-blue-500"
  />
  <ExclamationTriangleIconOutline
    v-if="type === 'warning'"
    class="w-6 h-6 mr-4 text-orange-500"
  />
  <XCircleIconOutline
    v-if="type === 'danger'"
    class="w-6 h-6 mr-4 text-red-500"
  />
  <CheckCircleIconOutline
    v-if="type === 'success'"
    class="w-6 h-6 mr-4 text-green-500"
  />
  <slot />
</div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'warning' | 'danger' | 'success' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',

})

const colorClasses = computed(() => {
  switch (props.type) {
    case 'warning':
      return 'border-orange-500 bg-orange-100 text-orange-500'

    case 'danger':
      return 'border-red-500 bg-red-100 text-red-500'

    case 'success':
      return 'border-green-500 bg-green-100 text-green-500'

    default:
      return 'border-blue-500 bg-blue-100 text-blue-500'
  }
})
</script>

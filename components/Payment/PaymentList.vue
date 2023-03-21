<template>
<div class="inline-block min-w-full py-2 align-middle">
  <div class="overflow-hidden border-t border-gray-200">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-sm font-semibold text-left text-gray-900"
          >
            Date
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-sm font-semibold text-left text-gray-900"
          >
            Description
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-sm font-semibold text-left text-gray-900"
          >
            Montant
          </th>
          <th
            scope="col"
            class="relative px-6 py-3 text-sm font-medium text-left text-gray-500"
          >
            <span class="sr-only">View receipt</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="payment in payments"
          :key="payment.id"
        >
          <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
            <time :datetime="payment.datetime">{{ payment.date }}</time>
          </td>
          <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
            {{ payment.description }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
            {{ payment.amount }}
          </td>
          <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
            <a
              :href="payment.href"
              class="text-orange-600 hover:text-orange-900"
            >Voir le reçu</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script setup lang="ts">
interface Props {
  payments: Record<string, string>[]
}

withDefaults(defineProps<Props>(), {
  payments: () => [],
})
</script>

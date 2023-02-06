<template>
<div class="flex items-center mt-2">
  <template v-if="hasBeenAnswered">
    <p
      v-if="!answer.hasSigned"
      class="flex items-center mt-2 text-sm text-gray-500"
    >
      <XCircleIconOutline
        class="flex-shrink-0 mr-1.5 h-5 w-5 text-red-400"
        aria-hidden="true"
      />
      <span>Refusé le {{ $toFormat(answer.signedAt!, 'D MMMM YYYY') }}</span>
    </p>

    <p
      v-else
      class="flex items-center mt-2 text-sm text-gray-500"
    >
      <CheckCircleIconOutline
        class="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
        aria-hidden="true"
      />
      <span>Signé le {{ $toFormat(answer.signedAt!, 'D MMMM YYYY') }}</span>
    </p>

    <BaseButton
      disabled
      :color="answer.hasSigned ? 'green' : 'red'"
      class="ml-4"
    >
      <template #icon>
        <ArrowDownTrayIconOutline
          class="text-white"
          aria-hidden="true"
        />
      </template>
      Télécharger
    </BaseButton>
  </template>

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
</template>

<script setup lang="ts">
import type { AnswerType } from '~~/store'

interface Props {
  answer: AnswerType
}

const props = defineProps<Props>()

console.log(props.answer, '<==== props.answer')

const hasBeenAnswered = computed(() =>
  noNull(props.answer.hasSigned)
  && noUndefined(props.answer.hasSigned)
  && noNull(props.answer.signedAt)
  && noUndefined(props.answer.signedAt),
)
</script>

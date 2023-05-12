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
      v-if="$getApiUrl && answer.hasSigned"
      color="green"
      class="ml-4"
      :is-loading="uiStore.getUIIsLoading"
      title="Télécharger"
      :href="`${$getApiUrl}answer/download/?ids=${answer.id}`"
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
    v-else-if="canAnswerBeRaise(answer)"
    class="flex items-center mt-2 text-sm text-gray-500"
  >
    <BaseButton
      :disabled="uiStore.getUIIsLoading"
      :is-loading="uiStore.getUIIsLoading"
      title="Relancer"
      @click="raise"
    >
      <template #icon>
        <EnvelopeIconOutline
          class="text-gray-200"
          aria-hidden="true"
        />
      </template>
      Relancer
    </BaseButton>
  </p>

  <BaseMessage
    v-if="responseMessage"
    :type="isGreenMessage ? 'success' : 'danger'"
  >
    {{ responseMessage }}
  </BaseMessage>
</div>
</template>

<script setup lang="ts">
import BaseButton from '../Base/BaseButton.vue'
import BaseMessage from '../Base/BaseMessage.vue'
import type { AnswerType } from '~~/store'
import { useUiStore } from '~~/store'

interface Props {
  answer: AnswerType
}

const props = defineProps<Props>()

const hasBeenAnswered = computed(() =>
  noNull(props.answer.hasSigned)
  && noUndefined(props.answer.hasSigned)
  && noNull(props.answer.signedAt)
  && noUndefined(props.answer.signedAt),
)

const uiStore = useUiStore()
const { canAnswerBeRaise, raiseAnswer } = answerHook()
const responseMessage = ref<null | string>(null)
const isGreenMessage = ref(false)

async function raise() {
  const response = await raiseAnswer(props.answer.id)
  if (response) {
    const { message, isSuccess } = response
    responseMessage.value = message || null
    isGreenMessage.value = isSuccess
  }
}
</script>

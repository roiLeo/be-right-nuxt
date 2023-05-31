<template>
<div class="space-y-4">
  <VueSignaturePad
    ref="signaturePad"
    class="border border-red-500"
    width="100%"
    :height="height"
  />

  <div class="space-y-2 md:flex md:items-center md:justify-center md:space-x-4 md:space-y-0">
    <BaseButton
      :disabled="!signaturePad"
      :is-loading="uiStore.getUIIsLoading"
      color="red"
      @click="clear"
    >
      <template #icon>
        <ArrowUturnDownIconOutline />
      </template>
      Réinitialiser
    </BaseButton>

    <BaseButton
      :disabled="!signaturePad"
      :is-loading="uiStore.getUIIsLoading"
      @click="save"
    >
      <template #icon>
        <ArrowDownOnSquareIconOutline />
      </template>
      {{ saveButtonLabel }}
    </BaseButton>
  </div>
</div>
</template>

<script setup>
import { VueSignaturePad } from 'vue-signature-pad'
import { useUiStore } from '~~/store'
import BaseButton from '~~/components/Base/BaseButton.vue'

const props = defineProps({
  signature: String,
  height: {
    type: String,
    default: () => '500px',
  },
  saveButtonLabel: {
    type: String,
    default: 'Enregistrer',
  },
})

const emit = defineEmits(['save', 'delete'])
const uiStore = useUiStore()

const signaturePad = ref(null)

onMounted(() => {
  if (props.signature && signaturePad.value) {
    signaturePad.value.fromDataURL(props.signature)
  }
})

function clear() {
  signaturePad.value?.clearSignature()
  emit('delete')
}

function save() {
  if (signaturePad.value) {
    const { data } = signaturePad.value.saveSignature()
    emit('save', data)
  }
}
</script>

<script setup lang="ts">
import type { UiCardTone, UiCardVariant } from '~/types/ui'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    noPadding?: boolean
    tone?: UiCardTone
    variant?: UiCardVariant
    hoverable?: boolean
    as?: 'section' | 'article' | 'div'
  }>(),
  {
    tone: 'store',
    variant: 'elevated',
    hoverable: false,
    as: 'section',
  },
)

const cardClass = computed(() => {
  const base = ['rounded-2xl border transition', props.hoverable && 'hover:shadow-md']

  if (props.tone === 'admin') {
    base.push('border-admin-line bg-admin-card')
    if (props.variant === 'elevated') base.push('shadow-admin-card')
    if (props.variant === 'flat') base.push('border-transparent bg-admin-surface')
  } else {
    base.push('border-theme bg-theme-surface')
    if (props.variant === 'elevated') base.push('shadow-sm')
    if (props.variant === 'flat') base.push('border-transparent bg-theme-muted')
  }

  if (props.variant === 'outline') {
    base.push('shadow-none')
  }

  return base
})

const headerBorder = computed(() =>
  props.tone === 'admin' ? 'border-admin-line' : 'border-theme',
)

const titleClass = computed(() =>
  props.tone === 'admin' ? 'text-admin text-base font-semibold' : 'text-theme text-base font-semibold',
)

const descriptionClass = computed(() =>
  props.tone === 'admin' ? 'text-admin-muted mt-0.5 text-sm' : 'text-theme-muted mt-0.5 text-sm',
)
</script>

<template>
  <component :is="as" :class="cardClass">
    <div
      v-if="title || description || $slots.actions"
      class="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4 md:px-6"
      :class="headerBorder"
    >
      <div>
        <h2 v-if="title" :class="titleClass">{{ title }}</h2>
        <p v-if="description" :class="descriptionClass">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <div :class="noPadding ? '' : 'p-5 md:p-6'">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="border-t px-5 py-4 md:px-6"
      :class="headerBorder"
    >
      <slot name="footer" />
    </div>
  </component>
</template>

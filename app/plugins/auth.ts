export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['pinia', 'vue-query'],
  parallel: false,
  async setup() {
    await useStoreShellPrefetch()
  },
})

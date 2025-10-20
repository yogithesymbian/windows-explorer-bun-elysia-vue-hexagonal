import {
  create,
  NTree,
  NInput,
  NButton,
  NMessageProvider,
  NLoadingBarProvider,
  NDialogProvider
} from 'naive-ui'

export function createNaiveUI() {
  return create({
    components: [
      NTree,
      NInput,
      NButton,
      NMessageProvider,
      NLoadingBarProvider,
      NDialogProvider
    ]
  })
}

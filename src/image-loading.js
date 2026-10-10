const show = (msg, spinner = true) => {
  const overlay = document.getElementById('target-loading')
  document.getElementById('target-loading-text').textContent = msg
  overlay.classList.toggle('no-spinner', !spinner)
  overlay.classList.remove('hidden')
}
const hide = () => {
  document.getElementById('target-loading').classList.add('hidden')
}

const targetLoaderModule = () => ({
  name: 'target-loader',
  listeners: [
    { event: 'reality.imageloading',  process: () => show('Loading target…') },
    { event: 'reality.imagescanning', process: () => show('Point your camera at the image', false) },
    { event: 'reality.imagefound',    process: () => hide() },
    { event: 'reality.imagelost',     process: () => show('Point your camera at the image', false) },
  ],
})

const onxrloaded = () => {
  XR8.addCameraPipelineModule(targetLoaderModule())
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/remedies-demolition-2.json'),
      require('../image-targets/santa.json'),
      require('../image-targets/tile.json'),
      require('../image-targets/tiles.json'),
      require('../image-targets/map-liba-mas-sp.json'),
    ],
  })
  XR8.addCameraPipelineModule(LandingPage.pipelineModule())
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)


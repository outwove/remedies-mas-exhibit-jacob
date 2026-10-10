// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Gesture',
  stateMachine: ({world, eid}) => {
    let lastX = 0
    let lastY = 0
    let lastDist = 0
    let isDragging = false

    const getTouches = (event: any) => {
      if (event && event.data && event.data.touches) return event.data.touches
      if (event && event.touches) return event.touches
      return []
    }

    ecs.defineState('default')
      .initial()
      .listen(world.events.globalId, ecs.input.SCREEN_TOUCH_START, (e) => {
        const touches = getTouches(e)

        if (touches.length === 1) {
          isDragging = true
          lastX = touches[0].clientX
          lastY = touches[0].clientY
        } else if (touches.length === 2) {
          lastDist = Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
          )
        }
      })
      .listen(world.events.globalId, ecs.input.SCREEN_TOUCH_MOVE, (e) => {
        const touches = getTouches(e)

        // One-finger rotate
        if (isDragging && touches.length === 1) {
          const dx = touches[0].clientX - lastX
          const dy = touches[0].clientY - lastY
          lastX = touches[0].clientX
          lastY = touches[0].clientY

          world.transform.rotateLocal(
            eid,
            ecs.math.quat.pitchYawRollDegrees(ecs.math.vec3.xyz(dy * 0.5, dx * 0.5, 0))
          )
        }

        // Two-finger pinch scale
        if (touches.length === 2) {
          const dist = Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
          )
          if (lastDist > 0) {
            const scaleFactor = dist / lastDist

            ecs.Scale.mutate(world, eid, (cursor) => {
              cursor.x *= scaleFactor
              cursor.y *= scaleFactor
              cursor.z *= scaleFactor

              // Clamp the scale to prevent it from getting too small or large
              const minScale = 0.3
              const maxScale = 8.0
              cursor.x = Math.min(Math.max(cursor.x, minScale), maxScale)
              cursor.y = Math.min(Math.max(cursor.y, minScale), maxScale)
              cursor.z = Math.min(Math.max(cursor.z, minScale), maxScale)

              return false
            })
          }
          lastDist = dist
        }
      })
      .listen(world.events.globalId, ecs.input.SCREEN_TOUCH_END, () => {
        isDragging = false
      })
  },
})

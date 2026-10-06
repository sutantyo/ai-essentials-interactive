import type { NavOperations, ShortcutOptions } from '@slidev/types'
import { defineShortcutsSetup } from '@slidev/types'
import { useNav } from '@slidev/client'
import { TOPICS, useTopicSlides, visited } from '../topics'

// Sections are self-contained: the arrow keys never cross from one section into another.
// - Forward past a section's last slide (and its last click) goes back to the map.
// - Back from a section's first slide also goes back to the map.
// - Forward on the map goes to the next core section you haven't visited yet,
//   so the whole talk can still be given with just the → key.
// H goes to the map from anywhere.
export default defineShortcutsSetup((nav: NavOperations, base: ShortcutOptions[]) => {
  const { clicks, clicksStart, clicksTotal, currentSlideNo, currentSlideRoute } = useNav()
  const { ranges } = useTopicSlides()
  const go = nav.go as (no: number | string) => void

  const onHub = () => currentSlideRoute.value?.meta.slide?.frontmatter.routeAlias === 'hub'
  const section = () => ranges.value.find(r => currentSlideNo.value >= r.no && currentSlideNo.value <= r.end)

  function forward(step: () => void, wholeSlide: boolean) {
    return () => {
      if (onHub()) {
        const nextCore = TOPICS.find(t => t.kind === 'core' && !visited.has(t.id))
        if (nextCore) go(nextCore.alias)
        return
      }
      const s = section()
      const lastClick = wholeSlide || clicks.value >= clicksTotal.value
      if (s && currentSlideNo.value === s.end && lastClick) return go('hub')
      step()
    }
  }

  function backward(step: () => void, wholeSlide: boolean) {
    return () => {
      const s = section()
      const firstClick = wholeSlide || clicks.value <= clicksStart.value
      if (s && currentSlideNo.value === s.no && firstClick) return go('hub')
      step()
    }
  }

  const replace: Record<string, () => void> = {
    next_space: forward(nav.next, false),
    next_right: forward(nav.next, false),
    next_page_key: forward(nav.next, false),
    next_down: forward(nav.nextSlide, true),
    next_shift: forward(nav.nextSlide, true),
    prev_space: backward(nav.prev, false),
    prev_left: backward(nav.prev, false),
    prev_page_key: backward(nav.prev, false),
    prev_up: backward(nav.prevSlide, true),
    prev_shift: backward(nav.prevSlide, true),
  }

  return [
    ...base.map(s => (s.name && replace[s.name] ? { ...s, fn: replace[s.name] } : s)),
    { name: 'go_hub', key: 'h', fn: () => go('hub') },
  ]
})

window.__ModuleLoader__.load({
  id: 'dsh-processing-status',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useEffect, useRef, useState, useSyncExternalStore } = React

    const TIPS = [
      '整理一下衣角',
      '给窗边的绿植浇水',
      '把桌面收一收',
      '听一首轻音乐',
      '望向远处眨眨眼',
      '泡一杯温热的茶',
      '伸个懒腰',
      '给朋友发个问候',
    ]
    const TIPS_KEY = 'dsh.processing-status.tips.v1'
    const CLOSED_PREFIX = 'dsh.processing-status.closed.'
    const ROTATE_MS = 5000

    function readTips() {
      try {
        return window.localStorage.getItem(TIPS_KEY) !== 'off'
      } catch {
        return true
      }
    }

    let tipsEnabled = readTips()
    const listeners = new Set()

    function writeTips(next) {
      tipsEnabled = next
      try {
        window.localStorage.setItem(TIPS_KEY, next ? 'on' : 'off')
      } catch {
        /* The switch still works for this page when storage is unavailable. */
      }
      for (const listener of listeners) listener()
    }

    function subscribeTips(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }

    function getTipsSnapshot() {
      return tipsEnabled
    }

    function useTipsEnabled() {
      return useSyncExternalStore(subscribeTips, getTipsSnapshot, getTipsSnapshot)
    }

    function readClosed(sessionId) {
      try {
        return window.sessionStorage.getItem(CLOSED_PREFIX + encodeURIComponent(sessionId)) === '1'
      } catch {
        return false
      }
    }

    function writeClosed(sessionId) {
      try {
        window.sessionStorage.setItem(CLOSED_PREFIX + encodeURIComponent(sessionId), '1')
      } catch {
        /* Closing still applies to this mounted component. */
      }
    }

    function useElapsedSeconds(active) {
      const [seconds, setSeconds] = useState(0)

      useEffect(() => {
        if (!active) {
          setSeconds(0)
          return undefined
        }
        const startedAt = Date.now()
        setSeconds(0)
        const timer = window.setInterval(() => {
          setSeconds(Math.floor((Date.now() - startedAt) / 1000))
        }, 250)
        return () => window.clearInterval(timer)
      }, [active])

      return seconds
    }

    function useRotatingTip(active, enabled) {
      const [index, setIndex] = useState(0)
      const wasActive = useRef(false)

      useEffect(() => {
        if (active && !wasActive.current) {
          setIndex(0)
        }
        wasActive.current = active
      }, [active])

      useEffect(() => {
        if (!active || !enabled) return undefined
        const timer = window.setInterval(() => {
          setIndex((current) => (current + 1) % TIPS.length)
        }, ROTATE_MS)
        return () => window.clearInterval(timer)
      }, [active, enabled])

      return TIPS[index]
    }

    function el(tag, props, ...children) {
      return h(tag, props, ...children)
    }

    function StatusLine({ running, sessionId }) {
      const tipsEnabled = useTipsEnabled()
      const [closed, setClosed] = useState(() => readClosed(sessionId))
      const visible = running && !closed
      const seconds = useElapsedSeconds(visible)
      const tip = useRotatingTip(visible, tipsEnabled)

      useEffect(() => {
        setClosed(readClosed(sessionId))
      }, [sessionId])

      if (!visible) return null

      const close = () => {
        writeClosed(sessionId)
        setClosed(true)
      }

      return el(
        'div',
        { className: 'ws-dock', 'data-dsh-processing-status': '' },
        el(
          'div',
          { className: 'ws-line' },
          el(
            'span',
            { className: 'ws-state', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' },
            '处理中',
          ),
          el('span', { className: 'ws-time', 'aria-hidden': 'true' }, String(seconds) + 's'),
          tipsEnabled
            ? el('span', { className: 'ws-sep', 'aria-hidden': 'true' }, '｜')
            : null,
          tipsEnabled
            ? el('span', { className: 'ws-tip', title: tip }, tip)
            : null,
          el(
            'button',
            {
              type: 'button',
              className: 'ws-close',
              title: '关闭处理状态',
              'aria-label': '关闭处理状态',
              onClick: close,
            },
            '×',
          ),
        ),
      )
    }

    function TipsSetting() {
      const enabled = useTipsEnabled()
      return el(
        'div',
        { className: 'ws-setting' },
        el(
          'div',
          { className: 'ws-setting-copy' },
          el('strong', null, '趣味提示'),
          el('p', null, '处理时每 5 秒轮换一句轻松的小提示。'),
        ),
        el(
          'button',
          {
            type: 'button',
            role: 'switch',
            className: 'ws-switch' + (enabled ? ' is-on' : ''),
            'aria-checked': enabled,
            'aria-label': '趣味提示',
            onClick: () => writeTips(!enabled),
          },
          el('span', { className: 'ws-switch-thumb', 'aria-hidden': 'true' }),
        ),
      )
    }

    function StatusDock(props) {
      const { useSession, sessionId } = props
      const running = useSession((session) => Boolean(session && session.running))
      return el(StatusLine, { running, sessionId })
    }

    const CSS = `
      .ws-dock {
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        width: min(
          calc(100% - 2 * var(--dsh-composer-side-clearance, 16px)),
          var(--dsh-composer-card-max-width, 100%)
        );
        margin: 0 auto;
        padding: 0 14px 2px;
      }

      .ws-line {
        display: flex;
        align-items: center;
        gap: 6px;
        width: fit-content;
        max-width: 100%;
        padding: 2px 0;
        color: var(--dsw-alias-label-secondary);
        font-family: var(--dsw-font-family);
        font-size: 13px;
        line-height: 20px;
        white-space: nowrap;
        pointer-events: auto;
      }

      .ws-state,
      .ws-time,
      .ws-tip {
        color: var(--dsw-alias-label-secondary);
      }

      .ws-time {
        font-variant-numeric: tabular-nums;
      }

      .ws-sep {
        margin: 0 2px;
        color: var(--dsw-alias-label-secondary);
        opacity: 0.5;
      }

      .ws-tip {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .ws-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        margin-left: 1px;
        padding: 0;
        border: 0;
        border-radius: var(--dsw-radius-md);
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        font: inherit;
        font-size: 15px;
        line-height: 1;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transition: opacity 120ms ease, color 120ms ease;
      }

      .ws-line:hover .ws-close,
      .ws-close:focus-visible {
        opacity: 0.8;
        pointer-events: auto;
      }

      .ws-close:hover {
        color: var(--dsw-alias-label-primary);
      }

      .ws-close:focus-visible,
      .ws-switch:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 2px;
      }

      .ws-setting {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        min-height: 56px;
        padding: 12px 0;
      }

      .ws-setting-copy {
        min-width: 0;
      }

      .ws-setting-copy strong {
        display: block;
        color: var(--dsw-alias-label-primary);
        font-family: var(--dsw-font-family);
        font-size: 13px;
        font-weight: 500;
        line-height: 20px;
      }

      .ws-setting-copy p {
        margin: 3px 0 0;
        color: var(--dsw-alias-label-secondary);
        font-family: var(--dsw-font-family);
        font-size: 12px;
        line-height: 18px;
      }

      .ws-switch {
        position: relative;
        flex: none;
        width: 36px;
        height: 20px;
        padding: 0;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 999px;
        background: var(--dsw-alias-bg-layer-2);
        cursor: pointer;
        transition: background 160ms ease, border-color 160ms ease;
      }

      .ws-switch.is-on {
        border-color: transparent;
        background: var(--dsw-alias-brand-primary);
      }

      .ws-switch-thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--dsw-alias-bg-layer-1);
        transition: transform 160ms ease;
      }

      .ws-switch.is-on .ws-switch-thumb {
        transform: translateX(16px);
      }

      @media (hover: none) {
        .ws-close {
          opacity: 0.7;
          pointer-events: auto;
        }
      }

      @media (max-width: 640px) {
        .ws-dock {
          padding: 0 12px 2px;
        }

        .ws-line {
          max-width: 100%;
          gap: 4px;
          font-size: 12px;
        }
      }
    `

    const inject = ['slots']

    function apply(ctx) {
      ctx.effect(() => {
        if (typeof document === 'undefined') return undefined
        const style = document.createElement('style')
        style.setAttribute('data-plugin', 'dsh-processing-status')
        style.textContent = CSS
        document.head.appendChild(style)
        return () => style.remove()
      }, 'processing-status: styles')

      ctx.effect(() => {
        const disposers = []
        const add = (label, register) => {
          try {
            disposers.push(register())
          } catch (error) {
            console.warn('[processing-status] ' + label + ' registration failed:', error)
          }
        }

        add('settings row', () =>
          ctx.slots.inject('settings.general.item', () =>
            ctx.slots.register(
              {
                name: 'settings.general.item',
                id: 'processing-status-tips',
                order: 25,
                label: () => '趣味提示',
              },
              TipsSetting,
            ),
          ),
        )

        add('status line', () =>
          ctx.slots.inject('conversation.input.dock', () =>
            ctx.slots.register(
              {
                name: 'conversation.input.dock',
                id: 'processing-status',
                order: 30,
              },
              StatusDock,
            ),
          ),
        )

        return () => {
          for (const dispose of disposers.splice(0)) {
            try {
              dispose()
            } catch {
              /* A removed slot owner may already have released the registration. */
            }
          }
        }
      }, 'processing-status: ui')

      console.log('[processing-status] mounted')
    }

    return { inject, apply }
  },
})

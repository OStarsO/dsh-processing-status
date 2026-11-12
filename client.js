window.__ModuleLoader__.load({
  id: 'dsh-processing-status',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useEffect, useRef, useState, useSyncExternalStore } = React

    const TIPS = [
      // 身体与感官（12）
      '香蕉是草，不是树',
      '章鱼有三颗心，血是蓝的',
      '长颈鹿和你一样只有七节颈椎',
      '你身上的细菌数量和细胞数量相当',
      '把全身的DNA拉直，约两米长',
      '指纹在娘胎里就长好了',
      '红细胞没有细胞核',
      '心脏一天大约跳十万次',
      '左肺两叶，右肺三叶',
      '舌头上没有“味觉分区”',
      '辣是痛觉，不属于酸甜苦咸鲜',
      '胃的内壁几天就换一层',

      // 动物（14）
      '蜂鸟是唯一能倒着飞的鸟',
      '企鹅有膝盖，藏在羽毛底下',
      '河马跑起来比人快',
      '鳄鱼伸不出舌头',
      '同样重量，蜘蛛丝比钢丝结实',
      '蝴蝶用脚尝味道',
      '蜜蜂用跳舞告诉同伴花在哪',
      '乌鸦能记住人脸',
      '狗的鼻纹像指纹一样独一无二',
      '金鱼的记忆不止七秒',
      '猫尝不出甜味',
      '海豚睡觉只歇半边大脑',
      '鲸的祖先在陆地上生活',
      '蜗牛有上万颗牙，长在舌头上',

      // 植物与食物（14）
      '花生是豆科，果实长在地下',
      '草莓的籽才是真正的果实',
      '竹子是草，一天能长近一米',
      '胡萝卜原本是紫色和黄色的',
      '菠萝会“消化”你的舌头',
      '苹果籽嚼碎会释放微量氰化物',
      '香蕉的放射性比多数水果高',
      '蜂蜜几乎不会变质',
      '辣椒的辣度用斯科维尔单位量',
      '咖啡喝的是果实里的种子',
      '可可豆曾被当作货币',
      '藏红花按克卖，是最贵的香料',
      '巴西坚果天然富含硒',
      '洋葱让人流泪，是含硫气体遇上眼泪',

      // 地球与天文（16）
      '阳光走到地球要8分20秒',
      '月光到地球只要1.3秒',
      '金星的一天比它的一年还长',
      '太阳占了太阳系99.8%的质量',
      '木星能装下一千三百个地球',
      '你看到的星光，很多是几万年前的',
      '银河系中心有一个超大质量黑洞',
      '月球每年离地球远3.8厘米',
      '一勺中子星物质重达上亿吨',
      '珠峰不是离地心最远的点',
      '马里亚纳海沟最深约11公里',
      '死海其实是湖',
      '贝加尔湖装着全球约两成淡水',
      '冰岛没有蚊子',
      '撒哈拉沙漠几乎和中国一样大',
      '澳大利亚的宽度超过月球直径',

      // 器物与科技（25）
      '铅笔芯是石墨，不含铅',
      '铅笔的H和B指硬度和黑度',
      '橡皮擦比铅笔晚出现两百年',
      '便利贴的胶本是失败的强力胶',
      '微波炉的灵感来自融化的巧克力',
      '微波炉是从外往里热，不是由内向外',
      '尼龙是第一种全合成纤维',
      '不锈钢是实验中的意外发现',
      '铝曾经比黄金还贵',
      '钻石和铅笔芯都是碳',
      '石墨烯是用胶带撕出来的',
      '玻璃既不是晶体，也不是普通液体',
      '声音在钢里比在空气里快十几倍',
      '高压锅最早叫“消化器”',
      '华氏的零度是盐水的冰点',
      '现在的“米”是由光速定义的',
      'Wi-Fi的“Wi”没有任何含义',
      '蓝牙得名于一位丹麦国王',
      '蓝牙图标是两个北欧字母的合字',
      '二维码是日本为管汽车零件发明的',
      '红绿灯比汽车早出现',
      '三点式安全带专利被沃尔沃免费开放',
      '牛仔裤的铆钉是为了加固口袋',
      '领带起源于克罗地亚士兵的领巾',
      '高跟鞋最早是给骑兵穿的',

      // 历史与语言（13）
      '金字塔建成时，猛犸象还没灭绝',
      '牛津大学比阿兹特克帝国古老',
      '克利奥帕特拉离登月比离金字塔更近',
      '传真机比电话早发明33年',
      '拿破仑不矮，大约一米六八',
      '中世纪欧洲人并不都相信地球是平的',
      '哥伦布没有“证明”地球是圆的',
      '阿拉伯数字其实源自印度',
      '“她”这个字1920年代才普及',
      'China可能源自“秦”',
      'SOS不是三个词的缩写',
      'QWERTY布局是为了少卡键',
      'F和J的凸起是盲打的定位点',

      // 数学（6）
      '0.999…就等于1',
      '23个人里，一半概率有人同生日',
      '六个人里必有三人互相认识或不认识',
      '一张纸对折42次就能到月球',
      '52张牌的顺序比地球上的沙粒还多',
      '一摩尔是6.02×10²³个',
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

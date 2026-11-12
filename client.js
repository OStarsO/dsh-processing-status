window.__ModuleLoader__.load({
  id: 'dsh-processing-status',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useEffect, useRef, useState, useSyncExternalStore } = React

    const TIPS = [
      // 来历（8）
      'DSH 是 DeepSeek Harness 的缩写',
      '它的口号是：一切皆插件',
      '模型、工具、沙箱、连 UI 都是插件',
      'DSH 的内核是 Cordis',
      'Cordis 由 Shigma 开发，被 vendor 进了仓库',
      '有篇论文专门讲 Cordis 的设计',
      '仓库 star 已经 27 万+',
      'MIT 开源，但目前只是开发者预览',

      // 启动（10）
      'npx @deepseek-ai/dsh web 一条命令就能跑',
      'Web UI 默认在 127.0.0.1:3080',
      '它默认会顺手帮你打开浏览器',
      '加 --no-open 就只跑服务，不开窗',
      'SSH 启动时，它只打印地址',
      '--port 写在 profile 后面才生效',
      'dsh 不用全局安装，也不要账号',
      'headless 模式跑的是一次性任务',
      '默认工作目录＝你敲命令时所在的地方',
      '没选工作区之前，输入框是灰的',

      // 三层结构（12）
      'plugin 做事，bundle 打包，profile 组合',
      'bundle 靠 package.json 的 dsh.bundle.patch 声明',
      '忘写这个字段，启动就报 declares no dsh.bundle',
      'profile 都住在 ~/.dsh/profiles/ 下面',
      '第一次启动会自动把 profile 建出来',
      'profile 固定三份文件：package.json、patch、pnpm-workspace',
      '插件行只有四个字段：id、name、config、disabled',
      'config 是整体替换，不做深合并',
      '覆盖按 id 定位，不按行号',
      '行顺序不代表加载顺序',
      '加载是「服务到齐就激活」',
      '配置里能写 !!js 表达式，按平台开关插件',

      // patch 与热更新（10）
      'patch 一共五层，最后一层是启动器的 flag',
      '顺序是 bundles → profile → home → --patch → flag',
      '想让全机生效，就写 ~/.dsh/cordis.patch.yml',
      'dsh --dump-config 能看到最终合成的配置',
      '改 cordis.patch.yml，通常不用重启',
      'HMR 盯的是 patch 文件，不是源码',
      '改插件代码，还是得重新构建',
      '热更新前会先悄悄装上 hmr 插件',
      'dsh plugin 其实是把参数转发给 pnpm',
      '相对路径按你敲命令时的目录算',

      // 内核机制（12）
      '一个插件只要导出 name、inject、Config、apply',
      'inject 是硬依赖：服务不到齐就不启动',
      'ctx.get 是软依赖：拿不到就返回 undefined',
      '同名服务在同一作用域重复注册会抛错',
      'Service 的寿命＝所属 fiber 的寿命',
      '定时器、监听、watcher 都要过 ctx.effect 记账',
      '卸载时逆序回收，这就是热插拔的秘密',
      '配置由 Schemastery 在启动前校验完',
      '校验是同步的，异步 schema 直接 TypeError',
      '写了 default，插件就能假设 config 一定良构',
      'dsh plugin list 能看清都装了什么',
      '工具、命令、Skill 都只是 ctx.* 上的一行注册',

      // 工具与命令（12）
      '工具注册时必须声明输出 schema',
      '工具流水线：pre-execute → guards → 主体 → post',
      'guard 一旦拒绝，就是最终拒绝',
      '要声明 isConcurrencySafe 才允许并发',
      '取消是协作式的，靠 signal 自己让路',
      '主体开跑前后的取消，报的是两种错误码',
      '注册在 agent.ctx 的工具，只对这个 agent 可见',
      '同层工具重名会抛错，跨层则是遮蔽',
      '命令不经过模型，直接跑 handler',
      '命令名必须小写字母开头，不带斜杠',
      '/goal 除了设目标，还能 clear、edit、pause、resume',
      '已有未完成目标时，再 /goal 会被拒绝',

      // 上下文与压缩（6）
      'Skill 就是一个 SKILL.md',
      '系统提示词是插件一段段拼出来的',
      '插件可以只贡献一段提示词',
      '改 schema 或提示词，KV Cache 前缀就失效',
      '/compact 是压缩插件给的命令',
      '工具结果超过 8192 字符就会被裁剪',

      // 安全（12）
      '权限预设三档：只读、可写工作区、完全放行',
      '一档预设同时改沙箱和审批两个维度',
      'DSH_PERMISSION_MODE 决定模式，默认 workspace-write',
      '可写工作区的根，默认是 process.cwd()',
      '审批只有 allow、deny、ask，不能改写输入',
      '没部署审批时，「询问」会降级成「拒绝」',
      '完全放行档下，审批策略是 never',
      '沙箱按平台分家：bash 给 Unix，pwsh 给 Windows',
      'API key 不进进程环境，走凭据服务解析',
      '凭据每次调用都重新解析，从不缓存',
      '空字符串不算秘密，清空要用 unset',
      '文件读写要走 ctx.fs，用 node:fs 就是绕过沙箱',

      // Agent 与界面（10）
      '内置四个预设：standard、PTC、minimal、creative',
      'minimal 只有 bash 和编辑器，专门用来做基准',
      'PTC 把一轮工具调用写成一段 TypeScript',
      'preset 住在 config/agent-presets/ 目录下',
      '每个 preset 两份文件：preset.yml 和 agent.cordis.yml',
      '要每会话独立实例，就得开 isolate realm',
      'plan-mode、compaction、delegation 各占一个 realm',
      'token-meter 故意不开 realm，留在宿主层',
      '客户端 UI 靠 slot 一层层嵌：section → tab → item',
      '本插件占两个 slot：输入框上方、设置里的开关',

      // 生态（8）
      '插件索引靠 GitHub 的 dsh-plugin 话题自动收集',
      '官方站统计：2900 个插件、2100 位作者',
      '每周的 npm 下载量是 540 万',
      '除了官方站，还有 dsh.so 等第三方目录',
      '给仓库打上 dsh-plugin 话题才容易被收录',
      '这个插件是纯 ESM，不需要构建',
      '有插件把 DSH 接进了微信、QQ、飞书',
      '连「桌面端」本身都是当插件写的',

      // 通用冷知识（100）
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

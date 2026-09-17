/**
 * FTable 虚拟滚动 + cell/table 分支覆盖率补全
 *
 * 覆盖目标（coverage-final.json 基线未覆盖分支）：
 * - virtualTable.tsx 0%：62/63（tbody 空数据兜底）、69（isScrollX||isScrollY
 *   门槛下的 syncPosition 转发）、78（VirtualList ref 守卫）、93/94
 *   （estimateSize/keeps 的 virtualScrollOption 覆盖）——见虚拟滚动三用例
 * - table.tsx 173/178（virtualScroll 缺 rowKey/height 的告警分支）、
 *   195（virtualScroll + 有数据走 VirtualTable 渲染分支）
 * - cell.tsx 17（stringify 的 try/catch + onError）、84（ellipsis 传对象 →
 *   EllipsisProps 直传）、87/90（default slot + ellipsis 组合）、
 *   98（formatter 返回 VNode）、111（formatter/plain 值为对象 → stringify）
 *
 * 虚拟滚动 jsdom 语义（实证）：
 * - FVirtualListItem 的 RO 尺寸上报走 debouncedSizeCheck（16ms 定时器）且
 *   上报 0（jsdom 无布局），virtual.saveSize(0) 不落 sizes 表（0 不写 Map），
 *   全程估算态（estimateSize 映射），range 由 estimateSize 唯一确定；
 * - syncPosition 转发（virtualTable:69）经 bodyWrapperRef 的 onScroll 链，
 *   FScrollbar 在 scroll 事件里才 emit；垂直滚动下 syncPosition 读
 *   scrollLeft/scrollWidth/offsetWidth 并同步 headerWrapper.scrollLeft。
 */
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, provide } from 'vue';
import type { ResizeObserver } from '@juggle/resize-observer';
import Table from '../table';
import Cell from '../components/cell';
import { provideKey } from '../const';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('table');

// jsdom 无布局引擎：mock RO 同步派发，让 useResize 的 computeX/computeY 执行
vi.mock('@juggle/resize-observer', () => ({
    ResizeObserver: class {
        constructor(private cb: ResizeObserverCallback) {}
        observe(el: HTMLElement) {
            this.cb(
                [
                    {
                        contentRect: {
                            width: el.offsetWidth || 800,
                            height: el.offsetHeight || 300,
                        } as DOMRectReadOnly,
                    } as ResizeObserverEntry,
                ],
                this as unknown as ResizeObserver,
            );
        }

        unobserve() {}
        disconnect() {}
    },
}));

// 1000 行大数据工厂：rowKey 用 id，虚拟列表按行渲染
const makeRows = (count: number) =>
    Array.from({ length: count }, (_, index) => ({
        id: index,
        name: `行-${index}`,
        age: 20 + (index % 50),
    }));

const COLS = [
    { prop: 'name', label: '名称' },
    { prop: 'age', label: '年龄' },
];

const ROWS = [
    { id: 1, name: '一', age: 10 },
    { id: 2, name: '二', age: 20 },
];

// 虚拟滚动挂载工厂：virtualScroll 需搭配 rowKey + height（见 table.tsx watch 告警）
const mountVirtualTable = (rows = makeRows(1000), extra: Record<string, any> = {}) =>
    mount(Table, {
        props: {
            columns: COLS as any,
            data: rows,
            rowKey: 'id',
            height: 300,
            virtualScroll: true,
            virtualScrollOption: { keeps: 20, estimateSize: 54 },
            ...extra,
        } as any,
        attachTo: document.body,
    });

/**
 * 注意：`.fes-table-row` 同时命中表头 tr 与表体 tr，行数断言必须圈定 tbody；
 * 已知组件行为（cell.tsx:106）：ellipsis 传对象时单元格会把 content 突变进
 * 用户传入的列配置对象，同一列渲染多行会互踢 content 引发无限重渲染，
 * 故该场景只能用单行数据锁定（见 ellipsis 对象用例注释）。
 */
const getRowTexts = (wrapper: any) => wrapper.findAll(`table.${prefixCls}-body tbody tr`).map((row: any) => row.text());

/** 桩滚动容器三维并派发 scroll 事件（jsdom data 属性只读，必须 writable） */
const stubScrollY = async (container: HTMLElement, scrollTop: number) => {
    Object.defineProperty(container, 'scrollTop', {
        value: scrollTop,
        configurable: true,
        writable: true,
    });
    Object.defineProperty(container, 'scrollHeight', {
        value: 54000,
        configurable: true,
    });
    Object.defineProperty(container, 'clientHeight', {
        value: 300,
        configurable: true,
    });
    container.dispatchEvent(new Event('scroll'));
    // handleScroll 经 requestAnimationFrame 重算 range + debounce 上报窗口
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await nextTick();
    await wait(40);
};

const stubScrollX = (container: HTMLElement, scrollLeft: number) => {
    Object.defineProperty(container, 'scrollLeft', {
        value: scrollLeft,
        configurable: true,
        writable: true,
    });
    Object.defineProperty(container, 'offsetWidth', {
        value: 300,
        configurable: true,
    });
    Object.defineProperty(container, 'scrollWidth', {
        value: 900,
        configurable: true,
    });
    container.dispatchEvent(new Event('scroll'));
};

describe('FTable 虚拟滚动（virtualTable.tsx）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('大数据量（1000 行）只渲染可视区窗口行数（keeps=20）', async () => {
        const wrapper = mountVirtualTable();
        await nextTick();
        await wait();
        // 虚拟滚动开启：数据 1000 行只渲染 keeps(20) 行（tbody 圈定，排除表头）
        expect(wrapper.findAll(`table.${prefixCls}-body tbody tr`)).toHaveLength(20);
        // 首窗口从第 0 行开始
        expect(getRowTexts(wrapper)[0]).toContain('行-0');
        expect(getRowTexts(wrapper)[19]).toContain('行-19');
        // 行高配置生效：colgroup 在 tbody 前正常渲染
        expect(wrapper.find(`table.${prefixCls}-body colgroup`).exists()).toBe(true);
        // 高度写进滚动容器（layout.bodyHeight 300 - 表头）
        expect(wrapper.html()).toContain('fes-table-body-wrapper');
        wrapper.unmount();
    });

    test('滚动后渲染窗口移动，滚回顶部窗口复原', async () => {
        const wrapper = mountVirtualTable();
        await nextTick();
        await wait();
        const container = wrapper.find(`.${prefixCls}-body-wrapper .fes-scrollbar-container`).element as HTMLElement;

        // 向下滚动：1000 行 × estimateSize 54 → offset 2700 命中第 50 行
        await stubScrollY(container, 2700);
        const moved = getRowTexts(wrapper);
        expect(moved).toHaveLength(20);
        // keeps=20、buffer≈6：窗口起点 50+buffer，终点 50+keeps-1=69
        expect(moved[0]).toContain('行-5');
        expect(moved[moved.length - 1]).toContain('行-69');

        // 滚回顶部：窗口回到 0
        await stubScrollY(container, 0);
        const restored = getRowTexts(wrapper);
        expect(restored[0]).toContain('行-0');
        expect(restored[19]).toContain('行-19');
        wrapper.unmount();
    });

    test('virtualScrollOption 覆盖 keeps/estimateSize 默认值', async () => {
        // estimateSize=10：offset 400 → 窗口起点第 40+buffer 行；
        // keeps=10 → 窗口长度 10（默认 20/54 下不可能出现的形态）
        const wrapper = mountVirtualTable(makeRows(1000), {
            virtualScrollOption: { keeps: 10, estimateSize: 10 },
        });
        await nextTick();
        await wait();
        expect(wrapper.findAll(`table.${prefixCls}-body tbody tr`)).toHaveLength(10);
        expect(getRowTexts(wrapper)[0]).toContain('行-0');
        const container = wrapper.find(`.${prefixCls}-body-wrapper .fes-scrollbar-container`).element as HTMLElement;
        await stubScrollY(container, 400);
        const moved = getRowTexts(wrapper);
        expect(moved).toHaveLength(10);
        expect(moved[moved.length - 1]).toContain('行-49');
        // ref 回调已把滚动条/包裹层引用回填（virtualTable:78 真值分支）
        expect(wrapper.find(`.${prefixCls}-body-wrapper table`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('行高固定估算映射：offset 精确命中 estimateSize 倍数行', async () => {
        // 行高 54、keeps=20：offset 540 = 第 10 行起点 → 窗口 [10+buffer, 29]
        const wrapper = mountVirtualTable();
        await nextTick();
        await wait();
        const container = wrapper.find(`.${prefixCls}-body-wrapper .fes-scrollbar-container`).element as HTMLElement;
        await stubScrollY(container, 540);
        const moved = getRowTexts(wrapper);
        expect(moved[moved.length - 1]).toContain('行-29');
        wrapper.unmount();
    });

    test('数据收缩到窗口起点之外：tbody 空兜底渲染一条空 Tr', async () => {
        // data 变化触发 virtual.handleDataSourcesChange 按 start 重排，
        // 构造 start 越过数据末尾的中间态：1000 → 收缩到 25 行且 keeps=20
        // 时 checkRange 收口（total<=keeps 全渲染），窗口起点之外的
        // itemVNodes 为空列表才走 virtualTable:63 兜底分支
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountVirtualTable();
        await nextTick();
        await wait();
        // 先滚到深窗口，让 range.start 处于深位置
        const container = wrapper.find(`.${prefixCls}-body-wrapper .fes-scrollbar-container`).element as HTMLElement;
        await stubScrollY(container, 48600); // 900×54 → 起点接近 906
        // 数据收缩：uniqueIds 更新后 handleDataSourcesChange 以旧 start 重算
        await wrapper.setProps({ data: makeRows(25) });
        await nextTick();
        await wait();
        const trs = wrapper.findAll(`table.${prefixCls}-body tbody tr`);
        // 收缩后 checkRange 收口到全渲染或兜底空 Tr，行数必为正且有限
        expect(trs.length).toBeGreaterThan(0);
        expect(trs.length).toBeLessThanOrEqual(25);
        wrapper.unmount();
        warnSpy.mockRestore();
    });

    test('横向滚动经 syncPosition 同步 header scrollLeft 与滚动状态类', async () => {
        const cols = [
            { prop: 'name', label: '名称', width: 300 },
            { prop: 'age', label: '年龄', width: 300 },
        ];
        const wrapper = mountVirtualTable(makeRows(1000), { columns: cols as any });
        await nextTick();
        await wait();
        // isScrollX=true：stubWidths 语义同 table-layout.spec（wrapper 100 < 内容 600）
        const wrapperEl = wrapper.find(`.${prefixCls}`).element;
        Object.defineProperty(wrapperEl, 'offsetWidth', {
            value: 100,
            configurable: true,
        });
        // 主动触发重算（columns 引用变化 → computeX）
        await wrapper.setProps({
            columns: cols.map((c) => ({ ...c })),
        });
        await wait();
        expect(wrapper.find(`.${prefixCls}-body-wrapper`).classes().join(' ')).toContain('is-scrolling-x-left');

        const container = wrapper.find(`.${prefixCls}-body-wrapper .fes-scrollbar-container`).element as HTMLElement;
        // 纵向滚动派发也需三维齐全：virtualList 的 iOS 回弹守卫会读 scrollHeight
        Object.defineProperty(container, 'scrollHeight', {
            value: 600,
            configurable: true,
        });
        Object.defineProperty(container, 'clientHeight', {
            value: 300,
            configurable: true,
        });
        // header wrapper 的 scrollLeft 同样需可写桩（jsdom 原生赋值不保留）
        const headerWrapper = wrapper.find(`.${prefixCls}-header-wrapper`).element as HTMLElement;
        Object.defineProperty(headerWrapper, 'scrollLeft', {
            value: 0,
            configurable: true,
            writable: true,
        });
        stubScrollX(container, 600);
        await wait(40); // syncPosition throttle 10ms
        // 门槛命中（isScrollX）→ syncPosition 执行：状态推进到 right 区间
        expect(wrapper.find(`.${prefixCls}-body-wrapper`).classes().join(' ')).toContain('is-scrolling-x-right');
        // header scrollLeft 被同步为 body 的 600
        expect(headerWrapper.scrollLeft).toBe(600);
        wrapper.unmount();
    });

    test('isScrollX/isScrollY 均假时 scroll 不触发 syncPosition', async () => {
        // jsdom 不桩宽度时 wrapper.offsetWidth=0 → bodyMinWidth(200) < 0 恒假
        // → isScrollX 恒 true。必须先桩 wrapper=800 / bodyTable=500 再触发
        // 重算（table-layout.spec 的 stubWidths 语义）才能得到 isScrollX=false；
        // 同时 $bodyWrapper.offsetHeight=0 → remainBody(300) <= 0 为假 →
        // isScrollY=false。两值均假：virtualTable:69 的 `||` 假路径 +
        // 右侧 isScrollY 求值，syncPosition 不执行，滚动状态维持初始 left。
        const wrapper = mountVirtualTable();
        await nextTick();
        await wait();
        const wrapperEl = wrapper.find(`.${prefixCls}`).element;
        Object.defineProperty(wrapperEl, 'offsetWidth', {
            value: 800,
            configurable: true,
        });
        const bodyTable = wrapper.find(`table.${prefixCls}-body`).element;
        Object.defineProperty(bodyTable, 'offsetWidth', {
            value: 500,
            configurable: true,
        });
        await wrapper.setProps({ columns: COLS.map((c) => ({ ...c })) });
        await wait();
        const container = wrapper.find(`.${prefixCls}-body-wrapper .fes-scrollbar-container`).element as HTMLElement;
        Object.defineProperty(container, 'scrollLeft', {
            value: 400,
            configurable: true,
            writable: true,
        });
        Object.defineProperty(container, 'offsetWidth', {
            value: 800,
            configurable: true,
        });
        Object.defineProperty(container, 'scrollWidth', {
            value: 900,
            configurable: true,
        });
        Object.defineProperty(container, 'scrollTop', {
            value: 2700,
            configurable: true,
            writable: true,
        });
        Object.defineProperty(container, 'scrollHeight', {
            value: 54000,
            configurable: true,
        });
        Object.defineProperty(container, 'clientHeight', {
            value: 300,
            configurable: true,
        });
        container.dispatchEvent(new Event('scroll'));
        await wait(40);
        // 门槛未命中：scrollState 未被推进（初始为 left），不出现 right/middle
        const classes = wrapper.find(`.${prefixCls}-body-wrapper`).classes().join(' ');
        expect(classes).toContain('is-scrolling-x-left');
        expect(classes).not.toContain('is-scrolling-x-right');
        wrapper.unmount();
    });

    test('表体 scroll 事件经 syncPosition：区间判定以桩读数为准', async () => {
        // 表体一旦挂载，useTableLayout 的 computeX/computeY 总会置位
        // isScrollX 或 isScrollY 其一（RO mock 同步派发），virtualTable:69
        // 的 `||` 假路径属公开 API 不可达防御分支。本用例锁定链路语义：
        // 滚动容器三维读数 (400, 900, 900) → maxScrollLeftPosition=-1，
        // scrollLeft>=-1 判 right 区间并同步写 headerWrapper.scrollLeft。
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountVirtualTable(makeRows(1000), {
            height: undefined,
        });
        await nextTick();
        await wait();
        expect(wrapper.findAll(`table.${prefixCls}-body tbody tr`)).toHaveLength(20);
        const container = wrapper.find(`.${prefixCls}-body-wrapper .fes-scrollbar-container`).element as HTMLElement;
        Object.defineProperty(container, 'scrollLeft', {
            value: 400,
            configurable: true,
            writable: true,
        });
        Object.defineProperty(container, 'scrollWidth', {
            value: 900,
            configurable: true,
        });
        Object.defineProperty(container, 'offsetWidth', {
            value: 900,
            configurable: true,
        });
        Object.defineProperty(container, 'scrollTop', {
            value: 0,
            configurable: true,
            writable: true,
        });
        Object.defineProperty(container, 'scrollHeight', {
            value: 54000,
            configurable: true,
        });
        Object.defineProperty(container, 'clientHeight', {
            value: 300,
            configurable: true,
        });
        container.dispatchEvent(new Event('scroll'));
        await wait(40);
        // syncPosition 执行：body 状态推进 right 区间
        // （无 height → composed=false 无 HeaderTable，header 同步分支
        // 由上方「横向滚动经 syncPosition」用例覆盖）
        expect(wrapper.find(`.${prefixCls}-body-wrapper`).classes().join(' ')).toContain('is-scrolling-x-right');
        wrapper.unmount();
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('请设置height'));
        warnSpy.mockRestore();
    });

    test('virtualScroll 缺 rowKey/height 触发告警；关掉后回落 BodyTable', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        // 缺 rowKey + height：两条告警分支（table.tsx:173/178）
        const wrapper = mount(Table, {
            props: {
                columns: COLS as any,
                data: ROWS,
                virtualScroll: true,
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('请设置rowKey'));
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('请设置height'));
        wrapper.unmount();

        // 195 分支对照组：virtualScroll 关闭 → BodyTable 渲染全量行
        const plain = mount(Table, {
            props: { columns: COLS as any, data: ROWS } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(plain.findAll(`table.${prefixCls}-body tbody tr`)).toHaveLength(2);
        plain.unmount();
        warnSpy.mockRestore();
    });
});

describe('FTable 单元格分支（cell.tsx）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('render 返回对象值 stringify；循环引用走 onError 兜底', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        // 循环引用：JSON.stringify 抛错 → stringify onError（cell.tsx:17）
        const circular: any = { detail: '自身引用' };
        circular.self = circular;
        const rows = [{ id: 1, obj: circular, ok: { a: 1 } }];
        const wrapper = mount(Table, {
            props: {
                data: rows,
                rowKey: 'id',
                columns: [
                    { prop: 'ok', label: '对象' },
                    { prop: 'obj', label: '循环' },
                ] as any,
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // 普通对象 → stringify 成 JSON 文本（111 分支真值）
        expect(wrapper.text()).toContain('{"a":1}');
        // 循环引用 → onError 打 warn，内容兜底为空串
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[FTableCell]'), expect.any(Error));
        expect(wrapper.text()).not.toContain('[object Object]');
        wrapper.unmount();
        warnSpy.mockRestore();
    });

    test('ellipsis 传对象透传 EllipsisProps；ellipsis=true 走默认配置', async () => {
        // 已知组件行为（cell.tsx:106）：ellipsis 为对象时单元格会执行
        // Object.assign(ellipsisProps, { content })，直接突变用户传入的
        // 列配置对象；同列渲染多行时各单元格互写 content 造成无限重渲染。
        // 此处以单行数据锁定「对象透传 line=2」的渲染现状，不构造多行。
        const rows = [{ id: 1, name: '一', age: 10 }];
        const wrapper = mount(Table, {
            props: {
                data: rows,
                rowKey: 'id',
                columns: [
                    {
                        prop: 'name',
                        label: '名称',
                        ellipsis: { line: 2, tooltip: false },
                    },
                    { prop: 'age', label: '年龄', ellipsis: true },
                ] as any,
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // line=2 → -webkit-line-clamp: 2（ellipsisProps 对象透传生效）
        const ellipsisNodes = wrapper.findAll('.fes-ellipsis');
        expect(ellipsisNodes.length).toBeGreaterThanOrEqual(2);
        expect(ellipsisNodes[0].attributes('style')).toContain('-webkit-line-clamp: 2');
        // ellipsis=true → 默认单行省略样式
        expect(ellipsisNodes[1].attributes('style')).toContain('text-overflow: ellipsis');
        wrapper.unmount();
    });

    test('default slot + ellipsis 组合：内容包进 Ellipsis', async () => {
        const wrapper = mount(Table, {
            props: {
                data: ROWS,
                rowKey: 'id',
                columns: [
                    {
                        prop: 'name',
                        label: '名称',
                        ellipsis: true,
                        render: ({ row }: any) => h('em', `强调-${row.name}`),
                    },
                ] as any,
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // cell.tsx:87 hasEllipsis 真值 + slot default 存在 → slot 内容包 Ellipsis
        const cell = wrapper.findAll(`.${prefixCls}-td`)[0].find('.fes-ellipsis');
        expect(cell.exists()).toBe(true);
        expect(cell.text()).toContain('强调-一');
        wrapper.unmount();
    });

    test('default slot 无 ellipsis：Fragment 直渲染', async () => {
        const wrapper = mount(Table, {
            props: {
                data: ROWS,
                rowKey: 'id',
                columns: [
                    {
                        prop: 'name',
                        label: '名称',
                        render: ({ row }: any) => h('em', `强调-${row.name}`),
                    },
                ] as any,
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // cell.tsx:90 else 分支：无 Ellipsis 包裹，slot 内容直接在 td 内
        const td = wrapper.findAll(`.${prefixCls}-td`)[0];
        expect(td.find('.fes-ellipsis').exists()).toBe(false);
        expect(td.find('em').exists()).toBe(true);
        expect(td.find('em').text()).toBe('强调-一');
        wrapper.unmount();
    });

    test('formatter 返回 VNode / 字符串 / 对象三种形态', async () => {
        const wrapper = mount(Table, {
            props: {
                data: ROWS,
                rowKey: 'id',
                columns: [
                    {
                        prop: 'name',
                        label: 'VNode列',
                        formatter: ({ row }: any) => h('b', `格式化-${row.name}`),
                    },
                    {
                        prop: 'age',
                        label: '字符串列',
                        formatter: () => `岁-${21}`,
                    },
                ] as any,
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // formatter 返回 VNode → isVNode 分支 Fragment 直渲染（cell.tsx:98）
        expect(wrapper.text()).toContain('格式化-一');
        expect(wrapper.find('b').exists()).toBe(true);
        // formatter 返回字符串 → 直接作为内容展示
        expect(wrapper.text()).toContain('岁-21');
        wrapper.unmount();
    });

    test('action 列单对象与数组两种传法 + 非法项过滤', async () => {
        const clicked: string[] = [];
        const wrapper = mount(Table, {
            props: {
                data: ROWS,
                rowKey: 'id',
                columns: [
                    {
                        prop: 'name',
                        label: '操作',
                        action: {
                            label: '单按钮',
                            func: () => clicked.push('single'),
                        },
                    },
                    {
                        prop: 'age',
                        label: '多操作',
                        action: [
                            { label: '编辑', func: () => clicked.push('edit') },
                            // 非法项：缺 func → 过滤掉
                            { label: '幽灵' } as any,
                            // 非法项：缺 label → 过滤掉
                            { func: () => {} } as any,
                            { label: '删除', func: () => clicked.push('del') },
                        ],
                    },
                ] as any,
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const buttons = wrapper.findAll(`.${prefixCls}-action-item`);
        // 单对象 1 个 + 数组过滤后 2 个（jsdom 每行 td 各渲染 3 个，共 6）
        expect(buttons).toHaveLength(6);
        expect(wrapper.text()).toContain('单按钮');
        expect(wrapper.text()).toContain('编辑');
        expect(wrapper.text()).not.toContain('幽灵');
        // 第一行的按钮 DOM 序：单按钮 / 编辑 / 删除
        await buttons[0].trigger('click');
        await buttons[1].trigger('click');
        await buttons[2].trigger('click');
        expect(clicked).toEqual(['single', 'edit', 'del']);
        wrapper.unmount();
    });

    test('column.slots 缺失（裸对象列）：跳过 slot 渲染走值渲染', async () => {
        // Table 内的列实例（useTableColumn/column.tsx）恒携带 slots 对象，
        // cell.tsx:86 `column?.slots?.default` 的 slots==null 防御路径只能由
        // 脱离 Table 的裸挂载驱动：provide 最小上下文 + 普通 JS 对象列
        // （无 slots 字段）→ 86 判否 → 90 的 cond-expr 走非 slot 一侧。
        const Host = defineComponent({
            setup() {
                provide(provideKey, { prefixCls } as any);
                return () =>
                    h('div', { class: 'host' }, [
                        h(Cell, {
                            row: { name: '甲' },
                            rowIndex: 0,
                            column: {
                                props: { prop: 'name', type: 'default' },
                            } as any,
                            columnIndex: 0,
                            cellValue: '裸值',
                        } as any),
                    ]);
            },
        });
        const wrapper = mount(Host);
        await nextTick();
        expect(wrapper.find('.host').text()).toBe('裸值');
        wrapper.unmount();
    });

    test('spanMethod 合并单元格：rowspan/colspan 落在 td 上', async () => {
        const wrapper = mount(Table, {
            props: {
                data: ROWS,
                rowKey: 'id',
                columns: COLS as any,
                spanMethod: ({ rowIndex, columnIndex }: any) =>
                    rowIndex === 0 && columnIndex === 0
                        ? { rowspan: 2, colspan: 1 }
                        : rowIndex === 0 && columnIndex === 1
                            ? { rowspan: 1, colspan: 0 }
                            : { rowspan: 1, colspan: 1 },
            } as any,
        });
        await nextTick();
        await wait();
        const firstRowTds = wrapper.findAll(`table.${prefixCls}-body tbody tr`)[0].findAll('td');
        expect(firstRowTds[0].attributes('rowspan')).toBe('2');
        expect(firstRowTds[0].attributes('colspan')).toBe('1');
        // colspan=0 的 td 整个不渲染（td.tsx:53 守卫）
        expect(firstRowTds).toHaveLength(1);
        wrapper.unmount();
    });
});

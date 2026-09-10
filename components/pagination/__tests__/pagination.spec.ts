import { nextTick } from 'vue';
import { vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from '../pagination';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('pagination');
const prefixClsEllipsis = getPrefixCls('ellipsis');

// ---------------- pagination currentPage props -------------------

test('pagination props currentPage', async () => {
    let currentPage = 2;
    const wrapper = mount(Pagination, {
        props: {
            currentPage,
            totalCount: 50,
        },
    });
    expect(wrapper.find('.is-active').text()).toBe(`${currentPage}`);
    currentPage += 1;
    wrapper.setProps({ currentPage });
    await nextTick();
    expect(wrapper.find('.is-active').text()).toBe(`${currentPage}`);

    currentPage = 'ass';
    wrapper.setProps({ currentPage });
    await nextTick();
    expect(wrapper.find('.is-active').exists()).toBe(false);

    currentPage = -1;
    wrapper.setProps({ currentPage });
    await nextTick();
    expect(wrapper.find('.is-active').exists()).toBe(false);

    currentPage = 22;
    wrapper.setProps({ currentPage });
    await nextTick();
    expect(wrapper.find('.is-active').exists()).toBe(false);
});

// ---------------- pagination totalCount props -------------------

test('pagination props totalCount', async () => {
    let totalCount = 2;
    const wrapper = mount(Pagination, {
        props: {
            showTotal: true,
            totalCount,
        },
    });
    expect(wrapper.find(`.${prefixCls}-total`).text()).toBe(
        `共 ${totalCount} 条`,
    );
    totalCount += 1;
    wrapper.setProps({ totalCount });
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-total`).text()).toBe(
        `共 ${totalCount} 条`,
    );
});

// ---------------- pagination showQuickJumper showSizeChanger showTotal small simple props -------------------

[
    { prop: 'showQuickJumper', className: `.${prefixCls}-jumper` },
    { prop: 'showSizeChanger', className: `.${prefixCls}-size` },
    { prop: 'showTotal', className: `.${prefixCls}-total` },
    { prop: 'small', className: `.${prefixCls}-small` },
    { prop: 'simple', className: `.${prefixCls}-simpler` },
].forEach((item) => {
    test(`pagination props ${item.prop}`, async () => {
        const wrapper = mount(Pagination);
        expect(wrapper.find(item.className).exists()).toBe(false);
        wrapper.setProps({ [item.prop]: true });
        await nextTick();
        expect(wrapper.find(item.className).exists()).toBe(true);
    });
});

function getWrapper(currentPage) {
    return mount(Pagination, {
        props: {
            currentPage,
            totalCount: 20,
        },
    });
}

function getWideWrapper(currentPage) {
    return mount(Pagination, {
        props: {
            currentPage,
            totalCount: 200,
        },
    });
}

// ---------------- pagination pager current button click -------------------

test('pagination pager button click', async () => {
    const currentPage = 1;
    const wrapper = getWrapper(currentPage);
    const btn = wrapper.findAll(`.${prefixCls}-pager > div`)[2];
    expect(btn.classes('is-active')).toBe(false);
    btn.trigger('click');
    await nextTick();
    expect(btn.classes('is-active')).toBe(true);
    expect(wrapper.emitted()['update:currentPage'].length).toBe(1);
});

// ---------------- pagination pager last button click -------------------

test('pagination pager last button click', async () => {
    let currentPage = 1;
    const wrapper = getWrapper(currentPage);
    const lastBtn = wrapper.find(`.${prefixCls}-pager > div:first-child`);
    expect(lastBtn.classes('is-disabled')).toBe(true);

    lastBtn.trigger('click');
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe(
        `${currentPage}`,
    );

    currentPage += 1;
    wrapper.setProps({ currentPage });
    await nextTick();
    expect(lastBtn.classes('is-disabled')).toBe(false);
    lastBtn.trigger('click');
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe(
        `${currentPage - 1}`,
    );
    expect(wrapper.emitted()['update:currentPage'].length).toBe(1);
});

// ---------------- pagination pager next button click -------------------

test('pagination pager next button click', async () => {
    let currentPage = 1;
    const wrapper = getWrapper(currentPage);
    const nextBtn = wrapper.find(`.${prefixCls}-pager > div:last-child`);
    expect(nextBtn.classes('is-disabled')).toBe(false);
    nextBtn.trigger('click');
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe(
        `${currentPage + 1}`,
    );
    expect(wrapper.emitted()['update:currentPage'].length).toBe(1);
    currentPage = 20;
    wrapper.setProps({ currentPage });
    await nextTick();
    expect(nextBtn.classes('is-disabled')).toBe(true);
    nextBtn.trigger('click');
    await nextTick();
    expect(wrapper.emitted()['update:currentPage'].length).toBe(2);

    currentPage = 1;
    wrapper.setProps({
        currentPage,
        totalCount: 0,
    });
    await nextTick();
    nextBtn.trigger('click');
    await nextTick();
    expect(nextBtn.classes('is-disabled')).toBe(true);
    expect(wrapper.emitted()['update:currentPage'].length).toBe(2);
});

// ---------------- pagination pager last double jump button click -------------------

test('pagination pager next button click', async () => {
    let currentPage = 1;
    const wrapper = getWideWrapper(currentPage);
    expect(
        wrapper
            .findAll(`.${prefixCls}-pager > div`)[2]
            .classes('is-double-jump'),
    ).toBe(false);
    currentPage = 10;
    wrapper.setProps({ currentPage });
    await nextTick();
    expect(
        wrapper
            .findAll(`.${prefixCls}-pager > div`)[2]
            .classes('is-double-jump'),
    ).toBe(true);
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe(
        `${currentPage}`,
    );
    wrapper.findAll(`.${prefixCls}-pager > div`)[2].trigger('click');
    expect(wrapper.emitted()['update:currentPage'].length).toBe(1);
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe(
        `${currentPage - 5}`,
    );
    expect(wrapper.emitted()['update:currentPage'].length).toBe(1);
});

// ---------------- pagination pager next double jump button click -------------------

test('pagination pager next button click', async () => {
    const currentPage = 1;
    const wrapper = getWideWrapper(currentPage);
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe(
        `${currentPage}`,
    );
    wrapper
        .findAll(`.${prefixCls}-pager > div`)[wrapper.findAll(`.${prefixCls}-pager > div`).length - 3]
        .trigger(
            'click',
        );
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe(
        `${currentPage + 5}`,
    );
    expect(wrapper.emitted()['update:currentPage'].length).toBe(1);
});

// ---------------- pagination simple btn click -------------------

test('pagination simple btn click', async () => {
    let currentPage = 1;
    const totalCount = 50; // totalPage = 5
    const wrapper = mount(Pagination, {
        props: {
            currentPage,
            totalCount,
            simple: true,
        },
    });
    const lis = wrapper.findAll(`.${prefixCls}-simpler > div`);
    const lastBtn = lis[0];
    const nextBtn = lis[lis.length - 1];
    const activeInput = wrapper.find(`.${prefixCls}-simpler input`);
    const activeValue = () =>
        (activeInput.element as HTMLInputElement).value;

    expect(activeValue()).toBe(`${currentPage}`);
    expect(lastBtn.classes('is-disabled')).toBe(true);
    expect(nextBtn.classes('is-disabled')).toBe(false);

    lastBtn.trigger('click');
    await nextTick();
    expect(activeValue()).toBe(`${currentPage}`);
    expect(lastBtn.classes('is-disabled')).toBe(true);
    expect(nextBtn.classes('is-disabled')).toBe(false);

    nextBtn.trigger('click');
    await nextTick();
    expect(activeValue()).toBe(`${currentPage + 1}`);
    expect(lastBtn.classes('is-disabled')).toBe(false);
    expect(nextBtn.classes('is-disabled')).toBe(false);
    expect(wrapper.emitted('update:currentPage').length).toBe(1);

    currentPage = 5; // 末页
    wrapper.setProps({
        currentPage,
    });
    await nextTick();
    expect(activeValue()).toBe(`${currentPage}`);
    expect(lastBtn.classes('is-disabled')).toBe(false);
    expect(nextBtn.classes('is-disabled')).toBe(true);
    // 末页点 next：clamp 到末页，值未变，不 emit
    nextBtn.trigger('click');
    await nextTick();
    expect(wrapper.emitted('update:currentPage').length).toBe(1);
    expect(activeValue()).toBe(`${currentPage}`);
    expect(nextBtn.classes('is-disabled')).toBe(true);

    lastBtn.trigger('click');
    await nextTick();
    expect(activeValue()).toBe(`${currentPage - 1}`);
    expect(lastBtn.classes('is-disabled')).toBe(false);
    expect(nextBtn.classes('is-disabled')).toBe(false);
    expect(wrapper.emitted('update:currentPage').length).toBe(2);

    currentPage = 1;
    wrapper.setProps({
        currentPage,
        totalCount: 0,
    });
    await nextTick();
    nextBtn.trigger('click');
    await nextTick();
    expect(activeValue()).toBe(`${currentPage}`);
    expect(lastBtn.classes('is-disabled')).toBe(true);
    expect(nextBtn.classes('is-disabled')).toBe(true);
    expect(wrapper.emitted('update:currentPage').length).toBe(2);
});

// ---------------- pagination jumper -------------------

test('pagination jumper', async () => {
    vi.useFakeTimers();
    const currentPage = 1;
    const totalCount = 200; // totalPage = 20
    const wrapper = mount(Pagination, {
        props: {
            currentPage,
            totalCount,
            showQuickJumper: true,
        },
    });
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe('1');
    const inp = wrapper.find(`.${prefixCls}-jumper input`);
    const flush = () => vi.advanceTimersByTimeAsync(1);

    // 3 -> 合法，跳到第 3 页
    inp.setValue(3);
    await inp.trigger('change');
    await flush();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe('3');
    expect(wrapper.emitted('update:currentPage').length).toBe(1);

    // 23 -> 越界，clamp 到末页 20
    inp.setValue(23);
    await inp.trigger('change');
    await flush();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe('20');
    expect(wrapper.emitted('update:currentPage').length).toBe(2);

    // 0 -> clamp 到第 1 页
    inp.setValue(0);
    await inp.trigger('change');
    await flush();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe('1');
    expect(wrapper.emitted('update:currentPage').length).toBe(3);

    // 'abs' -> 非数字，不跳转
    inp.setValue('abs');
    await inp.trigger('change');
    await flush();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe('1');
    expect(wrapper.emitted('update:currentPage').length).toBe(3);
    vi.useRealTimers();
});

// ---------------- pagination sizes -------------------

test('pagination jumper', async () => {
    const pageSizeOption = [10, 20, 30];
    let pageSize = 50;
    const wrapper = mount(Pagination, {
        props: {
            pageSize,
            pageSizeOption,
            showSizeChanger: true,
        },
        attachTo: 'body',
    });

    await nextTick();
    expect(
        wrapper.find(`.${prefixCls}-size .${prefixClsEllipsis}`).text(),
    ).toBe(`${pageSize}条/页`);

    pageSize = 100;
    wrapper.setProps({
        pageSize,
    });
    await nextTick();
    expect(
        wrapper.find(`.${prefixCls}-size .${prefixClsEllipsis}`).text(),
    ).toBe(`${pageSize}条/页`);
});

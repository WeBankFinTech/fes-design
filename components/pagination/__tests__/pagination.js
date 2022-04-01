import { nextTick } from 'vue';
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
            totalCount: 20,
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
        `共${totalCount}条`,
    );
    totalCount += 1;
    wrapper.setProps({ totalCount });
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-total`).text()).toBe(
        `共${totalCount}条`,
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

// ---------------- pagination pager current button click -------------------

test('pagination pager button click', async () => {
    const currentPage = 1;
    const wrapper = getWrapper(currentPage);
    const btn = wrapper.findAll(`.${prefixCls}-pager > div`)[3];
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
    expect(wrapper.emitted()['update:currentPage'].length).toBe(2);
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
    expect(wrapper.emitted()['update:currentPage'].length).toBe(3);
});

// ---------------- pagination pager last double jump button click -------------------

test('pagination pager next button click', async () => {
    let currentPage = 1;
    const wrapper = getWrapper(currentPage);
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
    expect(wrapper.emitted()['update:currentPage'].length).toBe(2);
});

// ---------------- pagination pager next double jump button click -------------------

test('pagination pager next button click', async () => {
    const currentPage = 1;
    const wrapper = getWrapper(currentPage);
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe(
        `${currentPage}`,
    );
    wrapper
        .findAll(`.${prefixCls}-pager > div`)
        [wrapper.findAll(`.${prefixCls}-pager > div`).length - 3].trigger(
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
    let totalCount = 20;
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
    const activeBtn = lis[1];

    expect(activeBtn.text()).toBe(`${currentPage}`);
    expect(lastBtn.classes('is-disabled')).toBe(true);
    expect(nextBtn.classes('is-disabled')).toBe(false);

    lastBtn.trigger('click');
    await nextTick();
    expect(activeBtn.text()).toBe(`${currentPage}`);
    expect(lastBtn.classes('is-disabled')).toBe(true);
    expect(nextBtn.classes('is-disabled')).toBe(false);

    nextBtn.trigger('click');
    await nextTick();
    expect(activeBtn.text()).toBe(`${currentPage + 1}`);
    expect(lastBtn.classes('is-disabled')).toBe(false);
    expect(nextBtn.classes('is-disabled')).toBe(false);
    expect(wrapper.emitted()['update:currentPage'].length).toBe(1);

    currentPage = totalCount;
    wrapper.setProps({
        currentPage,
    });
    await nextTick();
    expect(wrapper.emitted()['update:currentPage'].length).toBe(2);
    expect(activeBtn.text()).toBe(`${totalCount}`);
    expect(lastBtn.classes('is-disabled')).toBe(false);
    expect(nextBtn.classes('is-disabled')).toBe(true);

    nextBtn.trigger('click');
    await nextTick();
    expect(wrapper.emitted()['update:currentPage'].length).toBe(2);
    expect(activeBtn.text()).toBe(`${totalCount}`);
    expect(lastBtn.classes('is-disabled')).toBe(false);
    expect(nextBtn.classes('is-disabled')).toBe(true);

    lastBtn.trigger('click');
    await nextTick();
    expect(activeBtn.text()).toBe(`${currentPage - 1}`);
    expect(lastBtn.classes('is-disabled')).toBe(false);
    expect(nextBtn.classes('is-disabled')).toBe(false);
    expect(wrapper.emitted()['update:currentPage'].length).toBe(3);

    currentPage = 1;
    totalCount = 0;
    wrapper.setProps({
        currentPage,
        totalCount,
    });
    await nextTick();
    nextBtn.trigger('click');
    await nextTick();
    expect(activeBtn.text()).toBe(`${currentPage}`);
    expect(lastBtn.classes('is-disabled')).toBe(true);
    expect(nextBtn.classes('is-disabled')).toBe(true);
    expect(wrapper.emitted()['update:currentPage'].length).toBe(4);
});

// ---------------- pagination jumper -------------------

test('pagination jumper', async () => {
    const currentPage = 1;
    const totalCount = 20;
    const wrapper = mount(Pagination, {
        props: {
            currentPage,
            totalCount,
            showQuickJumper: true,
        },
    });
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe('1');
    let jumperVal = 3;
    const inp = wrapper.find(`.${prefixCls}-jumper input`);
    inp.setValue(jumperVal);
    inp.trigger('blur');
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe(
        `${jumperVal}`,
    );
    expect(wrapper.emitted()['update:currentPage'].length).toBe(1);
    jumperVal += totalCount;
    inp.setValue(jumperVal);
    inp.trigger('blur');
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe(
        `${totalCount}`,
    );
    expect(wrapper.emitted()['update:currentPage'].length).toBe(2);
    jumperVal = 0;
    inp.setValue(jumperVal);
    inp.trigger('blur');
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe('1');
    expect(wrapper.emitted()['update:currentPage'].length).toBe(3);

    jumperVal = 'abs';
    inp.setValue(jumperVal);
    inp.trigger('blur');
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-pager .is-active`).text()).toBe('1');
    expect(wrapper.emitted()['update:currentPage'].length).toBe(3);
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
    ).toBe(`${pageSize} 条/页`);

    pageSize = 100;
    wrapper.setProps({
        pageSize,
    });
    await nextTick();
    expect(
        wrapper.find(`.${prefixCls}-size .${prefixClsEllipsis}`).text(),
    ).toBe(`${pageSize} 条/页`);
});

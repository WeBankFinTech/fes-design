import { mount } from '@vue/test-utils';
import Test from '../Test.tsx';

test('render default', async () => {
    const wrapper = mount(Test);

    console.log(wrapper.html());

    expect(wrapper.find('.test').isVisible()).toBe(false);
});

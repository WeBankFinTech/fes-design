import { computed, defineComponent } from 'vue';
import { isNumber } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import { progressProps } from './props';
import { PROGRESS_TYPE, prefixCls } from './const';
import LineProgress from './components/LineProgress';
import CircleProgress from './components/CircleProgress';

export default defineComponent({
    name: 'FProgress',
    props: progressProps,
    setup(props, { slots }) {
        useTheme();

        // 展示的百分比，防止用户传入过高的percent或者小于0的百分比，这里做层处理
        const percent = computed(() => {
            let percent = props.percent;

            if (!isNumber(percent)) {
                percent = 0;
            } else if (percent > 100) {
                percent = 100;
                console.warn(
                    'Percentage should be entered as a value less than or equal to 100 and greater than or equal to 0.',
                );
            } else if (percent < 0) {
                percent = 0;
                console.warn(
                    'Percentage should be entered as a value less than or equal to 100 and greater than or equal to 0.',
                );
            }
            return percent;
        });

        return () => (
            <div class={prefixCls}>
                {props.type === PROGRESS_TYPE.LINE ? (
                    <LineProgress
                        percent={percent.value}
                        height={props.height}
                        color={props.color}
                        showInnerPercent={props.showInnerPercent}
                        showOutPercent={props.showOutPercent}
                        v-slots={{
                            text: slots.text,
                        }}
                    ></LineProgress>
                ) : (
                    <CircleProgress
                        percent={percent.value}
                        width={props.width}
                        color={props.color}
                        circleSize={props.circleSize}
                        showCircleText={props.showCircleText}
                        v-slots={{
                            text: slots.text,
                        }}
                    ></CircleProgress>
                )}
            </div>
        );
    },
});

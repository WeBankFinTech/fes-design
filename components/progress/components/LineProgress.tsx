import { computed, defineComponent } from 'vue';
import { lineProgressProps } from '../props';

export default defineComponent({
    props: lineProgressProps,
    setup(props, { slots }) {
        // 获取进度条每段的样式
        const getProgressStyle = (percent: number, color: string) => {
            return {
                borderRadius: `${props.height / 2}px`,
                background: color,
                width: `${percent}%`,
                height: `${props.height}px`,
            };
        };

        // 进度条外圈样式
        const lineProgressBarStyle = computed(() => {
            return {
                height: `${props.height}px`,
                borderRadius: `${props.height / 2}px`,
            };
        });

        // 百分比文本展示内容样式，宽度自适应
        const valueStyle = computed(() => {
            return {
                height: `${props.height}px`,
                lineHeight: `${props.height}px`,
            };
        });

        const renderProgress = () => {
            return (
                <div
                    class="progress-item"
                    style={getProgressStyle(props.percent, props.color)}
                >
                    {/* 内部展示,高度大于12px 再进行展示 */}
                    {renderInnerText(props.percent)}
                </div>
            );
        };

        // 渲染条状的进度条
        const renderLineProgress = () => {
            return (
                <div class="line-progress-container">
                    <div
                        class="line-progress-bar"
                        style={lineProgressBarStyle.value}
                    >
                        <div class="progress">{renderProgress()}</div>
                    </div>
                    {/* 外部展示 */}
                    {props.showOutPercent ? renderText() : null}
                </div>
            );
        };

        // 渲染文案（条形情况下 代替外显百分比）
        const renderText = () => {
            // 如果有文案插槽，就渲染，前提是要开启外显百分比
            return slots.text ? (
                <div class="out-value">{slots.text()}</div>
            ) : (
                <div
                    class="out-value"
                    style={valueStyle.value}
                >{`${props.percent}%`}</div>
            );
        };

        // 渲染内部展示的内容
        const renderInnerText = (percent: number) => {
            // 开启showInnerPercent，宽度大于25px或者 高度大于12px，才展示
            const show = props.showInnerPercent && props.height >= 12;
            return show ? (
                <div
                    class="inner-value"
                    style={valueStyle.value}
                >{`${percent}%`}</div>
            ) : null;
        };

        return () => renderLineProgress();
    },
});

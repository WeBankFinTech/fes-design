import { defineComponent } from 'vue';
import { circleProgressProps } from '../props';

export default defineComponent({
    props: circleProgressProps,
    setup(props, { slots }) {
        // 渲染环形进度条
        const renderCircleProgress = () => {
            const radius = props.circleSize / 2; // 半径
            const strokeWidth = props.width; // 线宽
            const normalizedRadius = radius - strokeWidth / 2;
            // 2πr 周长
            const circumference = 2 * Math.PI * normalizedRadius;
            const strokeDashoffset =
                circumference - (props.percent / 100) * circumference; // 线的偏移量
            return (
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    class="circle-progress"
                >
                    <circle
                        class="background"
                        stroke-width={strokeWidth}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        class="progress"
                        stroke-width={strokeWidth}
                        stroke-dasharray={circumference + ' ' + circumference}
                        style={{
                            strokeDashoffset,
                            stroke: props.color,
                        }}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* 在svg中渲染html插槽 */}
                    {props.showCircleText &&
                        (slots.text ? (
                            <foreignObject
                                x="0"
                                y="0"
                                width={radius * 2}
                                height={radius * 2}
                            >
                                <div class="slot-content">{slots.text()}</div>
                            </foreignObject>
                        ) : (
                            <text x="50%" y="50%" class="progress-text">
                                {`${props.percent}%`}
                            </text>
                        ))}
                </svg>
            );
        };

        return () => renderCircleProgress();
    },
});

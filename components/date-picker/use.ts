import { contrastDate, isBeyondRangeTime } from './helper';

export function useDisable(props: {
    minDate?: Date;
    maxDate?: Date;
    maxRange?: string;
    disabledDate?: (date: Date) => boolean;
}) {
    const innerDisabledDate = (date: Date, format: string, flagDate?: Date) => {
        const min =
            props.minDate && contrastDate(date, props.minDate, format) === -1;
        const max =
            props.maxDate && contrastDate(date, props.maxDate, format) === 1;

        let isBeyondRange = false;
        if (props.maxRange && flagDate) {
            isBeyondRange = isBeyondRangeTime({
                currentDate: date,
                maxRange: props.maxRange,
                flagDate,
                format,
            });
        }

        return min || max || isBeyondRange || props.disabledDate?.(date);
    };

    return {
        innerDisabledDate,
    };
}

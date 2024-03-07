export const getProgressDimension = (dimension: string, percent: number) => {
    const size = `${percent}%`;
    return {
        [dimension]: size,
    };
};

export const getLineProgressBarStyle = (dimension: string, size: number) => {
    return {
        [dimension]: `${size}px`,
        borderRadius: `${size / 2}px`,
    };
};

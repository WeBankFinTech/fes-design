export default (val) => {
    if (!val) return null;

    return val instanceof HTMLElement ? val : val.$el;
};

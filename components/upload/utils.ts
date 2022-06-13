/**
 * This is a rather simple version. I may fix it later to make it more accurate.
 * I've looked at https://github.com/broofa/mime, however it doesn't has a esm
 * version, so I can't simply use it.
 */
export function matchType(
    name: string,
    mimeType: string,
    accept: string[],
): boolean {
    name = name.toLowerCase();
    mimeType = mimeType.toLocaleLowerCase();
    const acceptAtoms = accept
        .map((acceptAtom) => acceptAtom.trim())
        .filter(Boolean);
    return acceptAtoms.some((acceptAtom) => {
        if (acceptAtom.startsWith('.')) {
            // suffix
            if (name.endsWith(acceptAtom)) return true;
        } else if (acceptAtom.includes('/')) {
            // mime type
            const [type, subtype] = mimeType.split('/');
            const [acceptType, acceptSubtype] = acceptAtom.split('/');
            if (
                acceptType === '*' ||
                (type && acceptType && acceptType === type)
            ) {
                if (
                    acceptSubtype === '*' ||
                    (subtype && acceptSubtype && acceptSubtype === subtype)
                ) {
                    return true;
                }
            }
        } else {
            // invalid type
            return true;
        }
        return false;
    });
}

export default function download({
    href,
    name,
}: {
    href: string;
    name?: string;
}) {
    const a = document.createElement('a');
    a.download = name ?? `${Date.now()}`;
    a.href = href;
    a.target = '_blank';
    a.style.display = 'none';
    document.body.append(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
    }, 0);
}

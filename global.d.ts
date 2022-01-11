export {};

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            [elem: string]: any;
        }
    }
}

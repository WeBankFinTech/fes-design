export type Type = 'default' | 'success' | 'info' | 'warning' | 'danger';

export type Size = 'small' | 'middle' | 'large';

export interface Gradient {
    from: string;
    to: string;
    deg: number | string;
}

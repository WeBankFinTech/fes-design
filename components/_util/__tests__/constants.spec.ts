import { describe, expect, test } from 'vitest';
import {
    CANCEL_EVENT,
    CHANGE_EVENT,
    CLICK_EVENT,
    CLOSE_EVENT,
    ERROR_EVENT,
    LOAD_EVENT,
    OK_EVENT,
    UPDATE_MODEL_EVENT,
} from '../constants';

describe('constants 事件名约定', () => {
    test('事件名为稳定字符串字面量', () => {
        expect(UPDATE_MODEL_EVENT).toBe('update:modelValue');
        expect(CHANGE_EVENT).toBe('change');
        expect(CLICK_EVENT).toBe('click');
        expect(CLOSE_EVENT).toBe('close');
        expect(OK_EVENT).toBe('ok');
        expect(CANCEL_EVENT).toBe('cancel');
        expect(ERROR_EVENT).toBe('error');
        expect(LOAD_EVENT).toBe('load');
    });
});

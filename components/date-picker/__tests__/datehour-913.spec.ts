import { describe, expect, it } from 'vitest';
import { PickerType, pickerFactory, DateHourMinutePicker } from '../pickerHandler';

describe('datehour picker', () => {
    it('should have datehour in PickerType', () => {
        expect(PickerType.datehour).toBe('datehour');
    });

    it('DateHourMinutePicker should have correct format', () => {
        const picker = new DateHourMinutePicker();
        expect(picker.format).toBe('yyyy-MM-dd HH:mm');
        expect(picker.name).toBe(PickerType.datehour);
        expect(picker.hasTime).toBe(true);
    });

    it('pickerFactory should create DateHourMinutePicker for datehour type', () => {
        const picker = pickerFactory(PickerType.datehour);
        expect(picker).toBeInstanceOf(DateHourMinutePicker);
        expect(picker.format).toBe('yyyy-MM-dd HH:mm');
    });
});
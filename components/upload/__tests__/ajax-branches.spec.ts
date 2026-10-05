import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import upload from '../ajax';

/**
 * upload/ajax.ts 全状态矩阵（基线 28/38，死分支）：
 * - L6[0]/L7  getError：xhr.response 存在（response.error || response）
 * - L22[1]    getBody：responseText 为空但 response 存在
 * - L23[0]    getBody：responseText 与 response 都为空 → 返回空
 * - L35[0]    XMLHttpRequest 未定义 → 直接 return
 * - L42[1]    xhr.upload 不存在 → 不绑进度
 * - L53[1]    option.data 不存在
 * - L74[1]    transformResponse 抛异常且无 message → 兜底文案
 * - L96[1]    option.headers 不存在 → {}
 *
 * vi.stubGlobal('XMLHttpRequest') 提供可控 fake，手动触发
 * onload/onerror/upload.onprogress 全部分支。
 */

class MockXHR {
    static instances: MockXHR[] = [];

    upload: any;

    status = 0;

    response: any = '';

    responseText = '';

    withCredentials = false;

    timeout = 0;

    open = vi.fn();

    send = vi.fn();

    abort = vi.fn();

    setRequestHeader = vi.fn();

    onload: any = null;

    onerror: any = null;

    constructor(outputUpload = true) {
        this.upload = outputUpload ? { onprogress: null } : undefined;
        MockXHR.instances.push(this);
    }
}

const wait = () => new Promise((r) => setTimeout(r, 10));

function makeOption(overrides: Record<string, any> = {}) {
    const file = new File(['内容'], 'demo.txt', { type: 'text/plain' });
    return {
        action: '/api/upload',
        fileName: 'file',
        file,
        onProgress: vi.fn(),
        onSuccess: vi.fn(),
        onError: vi.fn(),
        ...overrides,
    };
}

beforeEach(() => {
    MockXHR.instances = [];
    vi.stubGlobal('XMLHttpRequest', MockXHR as any);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

function lastXhr(): MockXHR {
    const xhr = MockXHR.instances[MockXHR.instances.length - 1];
    expect(xhr).toBeTruthy();
    return xhr;
}

// 启动一次真实 upload() 调用，返回 option 与本次 fake 实例
function startUpload(overrides: Record<string, any> = {}) {
    const option = makeOption(overrides);
    upload(option);
    return { option, xhr: lastXhr() };
}

describe('upload ajax 全状态矩阵', () => {
    test('200 + JSON responseText：parse 后 onSuccess 收到对象', async () => {
        const { option, xhr } = startUpload();
        xhr.status = 200;
        xhr.responseText = '{"code":0,"data":[1,2]}';
        xhr.onload();
        await wait();
        expect(option.onSuccess).toHaveBeenCalledWith({
            code: 0,
            data: [1, 2],
        });
        expect(option.onError).not.toHaveBeenCalled();
    });

    test('200 + 非 JSON responseText：原样字符串透传 onSuccess', async () => {
        const { option, xhr } = startUpload();
        xhr.status = 200;
        xhr.responseText = 'plain-text-result';
        xhr.onload();
        await wait();
        expect(option.onSuccess).toHaveBeenCalledWith('plain-text-result');
    });

    test('200 + responseText 为空但 response 存在：用 xhr.response（L22 右支）', async () => {
        const { option, xhr } = startUpload();
        xhr.status = 200;
        xhr.responseText = '';
        xhr.response = '{"ok":true}';
        xhr.onload();
        await wait();
        expect(option.onSuccess).toHaveBeenCalledWith({ ok: true });
    });

    test('200 + response 与 responseText 都为空：onSuccess 收到空串（L23 早退）', async () => {
        const { option, xhr } = startUpload();
        xhr.status = 200;
        xhr.response = '';
        xhr.responseText = '';
        xhr.onload();
        await wait();
        expect(option.onSuccess).toHaveBeenCalledWith('');
        expect(option.onError).not.toHaveBeenCalled();
    });

    test('非 2xx（404）：onError 携带 status/method/url 与 responseText 文案', async () => {
        const { option, xhr } = startUpload();
        xhr.status = 404;
        xhr.responseText = 'not found';
        xhr.onload();
        await wait();
        expect(option.onSuccess).not.toHaveBeenCalled();
        const err = option.onError.mock.calls[0][0];
        expect(err.status).toBe(404);
        expect(err.method).toBe('post');
        expect(err.url).toBe('/api/upload');
        expect(String(err.message)).toContain('not found');
    });

    test('非 2xx + response 存在：getError 优先 response.error（L6/L7 左支）', async () => {
        const { option, xhr } = startUpload();
        xhr.status = 500;
        xhr.responseText = '';
        xhr.response = { error: '服务端错误' };
        xhr.onload();
        await wait();
        const err = option.onError.mock.calls[0][0];
        expect(err.status).toBe(500);
        expect(String(err.message)).toBe('服务端错误');
    });

    test('非 2xx + response 无 error 字段：整串 response 兜底（L7 右支）', async () => {
        const { option, xhr } = startUpload();
        xhr.status = 403;
        xhr.responseText = '';
        xhr.response = 'forbidden raw';
        xhr.onload();
        await wait();
        const err = option.onError.mock.calls[0][0];
        expect(err.status).toBe(403);
        expect(String(err.message)).toBe('forbidden raw');
    });

    test('网络错误 onerror：onError 携带错误信息', async () => {
        const { option, xhr } = startUpload();
        xhr.status = 0;
        xhr.responseText = 'network down';
        xhr.onerror();
        await wait();
        expect(option.onSuccess).not.toHaveBeenCalled();
        const err = option.onError.mock.calls[0][0];
        expect(err.status).toBe(0);
        expect(String(err.message)).toContain('network down');
    });

    test('XMLHttpRequest 未定义：upload 直接 return 不抛错（L35）', async () => {
        vi.stubGlobal('XMLHttpRequest', undefined);
        const option = makeOption();
        const result = upload(option);
        expect(result).toBeUndefined();
        expect(option.onSuccess).not.toHaveBeenCalled();
        expect(option.onError).not.toHaveBeenCalled();
        expect(MockXHR.instances).toHaveLength(0);
    });

    test('xhr.upload 缺失：不绑定进度，仍正常发送（L42）', async () => {
        // 无 upload 属性的 fake XHR
        class NoUploadXHR extends MockXHR {
            constructor() {
                super(false);
            }
        }
        vi.stubGlobal('XMLHttpRequest', NoUploadXHR as any);
        const option = makeOption();
        upload(option);
        const xhr = lastXhr();
        expect(xhr.upload).toBeUndefined();
        // 正常链路不受影响：open/send 仍执行
        expect(xhr.open).toHaveBeenCalledWith('post', '/api/upload', true);
        expect(xhr.send).toHaveBeenCalled();
        expect(option.onProgress).not.toHaveBeenCalled();

        // 成功回调仍可用
        xhr.status = 200;
        xhr.responseText = '{}';
        xhr.onload();
        await wait();
        expect(option.onSuccess).toHaveBeenCalled();
    });

    test('上传进度 total>0：percent 计算为 0-100 并回调；total=0 不除零', async () => {
        const { option, xhr } = startUpload();
        xhr.status = 200;
        xhr.responseText = '{}';

        xhr.upload.onprogress({ loaded: 25, total: 100, percent: 0 } as any);
        expect(option.onProgress).toHaveBeenCalledTimes(1);
        expect((option.onProgress.mock.calls[0][0] as any).percent).toBe(25);

        xhr.upload.onprogress({ loaded: 50, total: 100 } as any);
        expect((option.onProgress.mock.calls[1][0] as any).percent).toBe(50);

        // total=0：不计算 percent，仍回调
        xhr.upload.onprogress({ loaded: 10, total: 0 } as any);
        expect(option.onProgress).toHaveBeenCalledTimes(3);
        expect((option.onProgress.mock.calls[2][0] as any).percent).toBeUndefined();

        xhr.onload();
        await wait();
        expect(option.onSuccess).toHaveBeenCalled();
    });

    test('option.data 存在：FormData 追加自定义字段（L53 左支）', async () => {
        // 先启动一次拿 xhr，再单独验证 data 追加
        const option = makeOption({
            data: { userId: 'u1', scene: 'x' },
        });
        const append = vi.spyOn(FormData.prototype, 'append');
        upload(option);
        const xhr = lastXhr();
        xhr.status = 200;
        xhr.responseText = '{}';
        xhr.onload();
        await wait();
        expect(option.onSuccess).toHaveBeenCalled();
        // FormData.append 被调用（file + 两个 data 字段，共 3 次）
        expect(append.mock.calls.length).toBe(3);
        expect(append.mock.calls[0][0]).toBe('userId');
        expect(append.mock.calls[1][0]).toBe('scene');
        expect(append.mock.calls[2][0]).toBe('file');
        append.mockRestore();
    });

    test('无 option.data：FormData 只含文件字段（L53 右支）', async () => {
        const append = vi.spyOn(FormData.prototype, 'append');
        const option = makeOption();
        upload(option);
        expect(append).toHaveBeenCalledTimes(1);
        expect(append.mock.calls[0][0]).toBe('file');
        append.mockRestore();
    });

    test('withCredentials + timeout + headers 透传；null header 跳过', async () => {
        const { xhr } = startUpload({
            withCredentials: true,
            timeout: 30000,
            headers: {
                'X-Token': 'abc',
                'X-Null': null,
                'X-Empty': '',
            },
        });
        expect(xhr.withCredentials).toBe(true);
        expect(xhr.timeout).toBe(30000);
        expect(xhr.setRequestHeader).toHaveBeenCalledWith('X-Token', 'abc');
        expect(xhr.setRequestHeader).toHaveBeenCalledWith('X-Empty', '');
        // null 值 header 被跳过（hasOwn && !== null 守卫）
        expect(xhr.setRequestHeader).not.toHaveBeenCalledWith('X-Null', null);
    });

    test('无 headers：option.headers || {} 兜底（L96 右支）', async () => {
        const { xhr } = startUpload();
        expect(xhr.setRequestHeader).not.toHaveBeenCalled();
    });

    test('transformResponse 成功：onSuccess 收到变换结果（L69 左支）', async () => {
        const { option, xhr } = startUpload({
            transformResponse: (xhr: XMLHttpRequest) =>
                ({ wrapped: xhr.responseText }) as any,
        });
        xhr.status = 200;
        xhr.responseText = 'raw';
        xhr.onload();
        await wait();
        expect(option.onSuccess).toHaveBeenCalledWith({ wrapped: 'raw' });
    });

    test('transformResponse 抛异常：onError 收到异常 message（L72 分支）', async () => {
        const { option, xhr } = startUpload({
            transformResponse: () => {
                throw new Error('解析挂了');
            },
        });
        xhr.status = 200;
        xhr.responseText = 'raw';
        xhr.onload();
        await wait();
        expect(option.onSuccess).not.toHaveBeenCalled();
        const err = option.onError.mock.calls[0][0];
        expect(err.status).toBe(200);
        expect(String(err.message)).toBe('解析挂了');
    });

    test('transformResponse 抛无 message 异常：兜底 fail 文案（L74 右支）', async () => {
        // 抛一个无 message 字段的普通对象（模拟 transformResponse 抛非
        // Error 值）→ e?.message 为 undefined（falsy）→ `|| fail to post...`
        // 兜底文案生效
        const { option, xhr } = startUpload({
            transformResponse: () => {
                // 非 Error 值：无 message 字段 → 兜底文案
                const unknown = { code: 'TRANSFORM_FAILED' };
                throw unknown;
            },
        });
        xhr.status = 200;
        xhr.responseText = 'raw';
        xhr.onload();
        await wait();
        const err = option.onError.mock.calls[0][0];
        expect(err.status).toBe(200);
        expect(String(err.message)).toContain('fail to post /api/upload 200');
    });

    test('返回 xhr 实例供调用方中止（abort 语义）', async () => {
        const option = makeOption();
        const returned = upload(option);
        expect(returned).toBe(lastXhr());
        (returned as any).abort();
        expect(lastXhr().abort).toHaveBeenCalled();
    });

    test('open 使用 post + action + async=true', async () => {
        const { xhr } = startUpload();
        expect(xhr.open).toHaveBeenCalledWith('post', '/api/upload', true);
    });
});

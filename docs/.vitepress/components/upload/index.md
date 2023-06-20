# Upload 上传文件

通过此组件从系统中选择文件，并且上传到配置的服务器。

## 组件注册

```js
import { FUpload } from '@fesjs/fes-design';

app.use(FUpload);
```

## 代码演示

### 通用用法

--COMMON

### 初始列表

--INITLIST

### 自定义上传的触发器

--DEFAULT

### 拖拽上传

当自定义上传触发器使用`FUploadDragger`时开启拖拽上传。

--DRAG

### 自定义文件列表的显示

--FILELIST

### 禁用

--DISABLED

### 预览上传文件

--previewUpload

### 自定义 http request

--customerUpload

--CODE

## Upload Props

| 属性                           | 说明                                                                                                  | 类型                                                                    | 默认值  |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------- |
| accept                         | 接受上传的文件类型                                                                                    | array                                                                   | []      |
| action                         | 上传的地址                                                                                            | string                                                                  | -       |
| beforeUpload                   | 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传           | (file: File) => boolean \| Promise\<boolean\>                           | -       |
| beforeRemove                   | 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除 | (file: FileItem, fileList: FileItem[]) => boolean \| Promise\<boolean\> | -       |
| disabled                       | 是否禁用                                                                                              | boolean                                                                 | `false` |
| data                           | 上传接口附带的数据                                                                                    | object                                                                  | `{}`    |
| fileList(v-model)              | 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]。                      | FileItem[]                                                              | `[]`    |
| headers                        | 上传接口中请求附带的请求头                                                                            | object                                                                  | `{}`    |
| listType（第一期只支持`text`） | 文件列表的类型，可选值有`text` / `picture-card`                                                       | string                                                                  | `text`  |
| multiple                       | 是否支持多选文件                                                                                      | boolean                                                                 | `false` |
| multipleLimit                  | 最大允许上传个数                                                                                      | number                                                                  | -       |
| name                           | 上传的文件字段名                                                                                      | string                                                                  | `file`  |
| showFileList                   | 是否显示已上传文件列表                                                                                | boolean                                                                 | `true`  |
| withCredentials                | 支持发送 cookie 凭证信息                                                                              | boolean                                                                 | `false` |
| timeout                        | 上传请求的超时时间 （毫秒）                                                                           | number                                                                  | -       |
| transformResponse              | 处理上传请求的响应内容，当抛出错误时判断为上传失败                                                    | (xhr: XMLHttpRequest)=> any                                             | -       |
| httpRequest                    | 自定义文件上传方法                                                                                    | (options: RequestOptions) => XMLHttpRequest;                            | -       |

## Upload Events

| 事件名称 | 说明                                                           | 回调参数                                                                     |
| -------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| change   | 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 | ({file: FileItem, fileList: FileItem[]}) => void                             |
| remove   | 文件列表移除文件时的钩子                                       | ({file: FileItem, fileList: FileItem[]}) => void                             |
| success  | 文件上传成功时的钩子                                           | ({response: any, file: FileItem, fileList: FileItem[]}) => void              |
| error    | 文件上传失败时的钩子                                           | ({error: UploadError, file: FileItem, fileList: FileItem[]}) => void         |
| exceed   | 文件上传超出限制时的钩子                                       | ({files: FileList, fileList: FileItem[]}) => void                            |
| progress | 文件上传进度的钩子                                             | ({event: UploadProgressEvent, file: FileItem, fileList: FileItem[]}) => void |

## Upload Slots

| 名称     | 说明                                         |
| -------- | -------------------------------------------- |
| default  | 触发文件选择框的内容, 参数为 { uploadFiles } |
| tip      | 提示说明文字                                 |
| fileList | 自定义文件的展示, 参数为 { uploadFiles }     |
| file     | 自定义上传后的文件展示, 参数为 { file }      |

## UploadDragger Props

| 属性              | 说明                                                           | 类型                    | 默认值 |
| ----------------- | -------------------------------------------------------------- | ----------------------- | ------ |
| onFileTypeInvalid | 拖拽文件类型不满足`accept`时的钩子函数，若未定义则使用内置提示 | (files: File[]) => void | -      |

## 类型

### FileItem

```ts
interface FileItem {
    uid: number | string;
    name: string;
    size?: number;
    url?: string;
    status?: string;
    percentage?: number;
    response?: any;
    raw?: File;
    [prop: string]: any;
}
```

### UploadProgressEvent

```ts
interface UploadProgressEvent extends ProgressEvent {
    percent?: number;
}
```

### UploadError

```ts
interface UploadError extends Error {
    status?: number;
    method?: string;
    url?: string;
}
```

### RequestOptions

```ts
interface RequestOptions {
    headers: Record<string, string>; // 值为 props.headers,
    withCredentials: string; // 值为 props.withCredentials,
    data: Record<string, any>; //  值为 props.data,
    file: File; // 用户选中的文件
    fileName: string; // 值为 props.name,
    action: string; // 值为 props.action,
    timeout: number; // 值为 props.timeout,
    transformResponse: Function; // 值为 props.transformResponse,
    onProgress: (e: ProgressEvent) => void;
    onSuccess: (res: any) => void;
    onError: (err: Error) => void;
}
```

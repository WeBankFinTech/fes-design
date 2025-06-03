/**
 * virtual list core calculating center
 */

enum DIRECTION_TYPE {
    FRONT = 'FRONT', // scroll up or left
    BEHIND = 'BEHIND', // scroll down or right
}
enum CALC_TYPE {
    INIT = 'INIT',
    FIXED = 'FIXED',
    DYNAMIC = 'DYNAMIC',
}

interface Range {
    start: number;
    end: number;
    padFront: number;
    padBehind: number;
}
interface VirtualParams {
    slotHeaderSize?: number;
    slotFooterSize?: number;
    keeps?: number;
    estimateSize?: number;
    buffer?: number;
    uniqueIds?: (string | number)[];
}

const LEADING_BUFFER = 0;

export default class Virtual {
    param: VirtualParams;
    sizes: Map<number | string, number>;
    firstRangeTotalSize: number;
    firstRangeAverageSize: number;
    fixedSizeValue: number;
    calcType: CALC_TYPE;
    offset: number;
    direction: DIRECTION_TYPE;
    range: Range;
    callUpdate: (range: Range) => void;
    private _scrollRAF: number | null = null;
    // 简化缓存策略
    private _scrollPositionCache: Map<number, number> = new Map();
    private _incrementalCache: Map<number, number> = new Map();
    // 减少缓存大小以提升快速滚动性能
    private readonly _maxCacheSize = 100;
    // 上次滚动方向，用于优化缓存策略
    private _lastScrollDirection: DIRECTION_TYPE | null = null;
    // 批量更新相关
    private _pendingUpdates: Set<string | number> = new Set();
    private _updateRAF: number | null = null;

    constructor(param: VirtualParams, callUpdate: (range: Range) => void) {
        this.init(param, callUpdate);
    }

    init(param: VirtualParams = {}, callUpdate: (range: Range) => void = null) {
        this.param = param;
        this.callUpdate = callUpdate;

        // size data - 移除响应式包装以提升性能
        // 虚拟列表的尺寸数据主要用于内部计算，不需要响应式追踪
        this.sizes = new Map();
        this.firstRangeTotalSize = 0;
        this.firstRangeAverageSize = 0;
        this.fixedSizeValue = 0;
        this.calcType = CALC_TYPE.INIT;

        // scroll data
        this.offset = 0;

        // range data
        this.range = Object.create(null);

        // 清空所有缓存
        this._scrollPositionCache = new Map();
        this._incrementalCache = new Map();
        this._lastScrollDirection = null;

        // 清除滚动动画帧引用
        if (this._scrollRAF) {
            cancelAnimationFrame(this._scrollRAF);
            this._scrollRAF = null;
        }

        // 清除批量更新计时器
        if (this._updateRAF) {
            cancelAnimationFrame(this._updateRAF);
            this._updateRAF = null;
        }

        // 清空批量更新队列
        this._pendingUpdates.clear();

        if (this.param && this.callUpdate) {
            this.checkRange(0, this.param.keeps - 1);
        }
    }

    destroy() {
        // 重置内部状态数据
        this.init();
    }

    // return current render range
    getRange() {
        const range = Object.create(null);
        range.start = this.range.start;
        range.end = this.range.end;
        range.padFront = this.range.padFront;
        range.padBehind = this.range.padBehind;
        return range;
    }

    isBehind() {
        return this.direction === DIRECTION_TYPE.BEHIND;
    }

    isFront() {
        return this.direction === DIRECTION_TYPE.FRONT;
    }

    // return start index offset
    getOffset(start: number) {
        return (
            (start < 1 ? 0 : this.getIndexOffset(start))
            + this.param.slotHeaderSize
        );
    }

    updateParam(key: keyof VirtualParams, value: any) {
        if (this.param && Object.keys(this.param).includes(key)) {
            // if uniqueIds change, find out deleted id and remove from size map
            if (key === 'uniqueIds') {
                const oldIds = this.param.uniqueIds || [];
                const newIds = value;

                // 找出被删除的项目ID
                const deletedIds = oldIds.filter((id: string | number) => !newIds.includes(id));

                // 只清理被删除项目的缓存，保留相同key的缓存
                deletedIds.forEach((id: string | number) => {
                    this.sizes.delete(id);
                    // 清理相关的位置缓存
                    this._invalidatePositionCacheForDeletedId(id, oldIds);
                });

                // 避免调用 _cleanupSizes()，减少不必要的缓存清理
                // 只有在缓存过多时才进行清理
                if (this.sizes.size > this._maxCacheSize * 3) {
                    this._cleanupSizes();
                }
            }
            this.param[key] = value;
        }
    }

    // save each size map by id - 优化版本，支持批量更新
    saveSize(id: number | string, size: number) {
        const oldSize = this.sizes.get(id);
        this.sizes.set(id, size);

        // 只有尺寸真正变化时才标记需要更新
        if (oldSize !== undefined && oldSize !== size) {
            this._pendingUpdates.add(id);
            this._scheduleUpdate();
        }

        // we assume size type is fixed at the beginning and remember first size value
        // if there is no size value different from this at next comming saving
        // we think it's a fixed size list, otherwise is dynamic size list
        if (this.calcType === CALC_TYPE.INIT) {
            this.fixedSizeValue = size;
            this.calcType = CALC_TYPE.FIXED;
        } else if (this.calcType === CALC_TYPE.FIXED && this.fixedSizeValue !== size) {
            this.calcType = CALC_TYPE.DYNAMIC;
            // it's no use at all
            delete this.fixedSizeValue;
        }

        // calculate the average size only in the first range
        if (this.calcType !== CALC_TYPE.FIXED && typeof this.firstRangeTotalSize !== 'undefined') {
            if (this.sizes.size < Math.min(this.param.keeps, this.param.uniqueIds.length)) {
                this.firstRangeTotalSize = [...this.sizes.values()].reduce(
                    (acc, val) => acc + val,
                    0,
                );
                this.firstRangeAverageSize = Math.round(
                    this.firstRangeTotalSize / this.sizes.size,
                );
            } else {
                // it's done using
                delete this.firstRangeTotalSize;
            }
        }
    }

    // 批量更新调度器 - 避免频繁的单次更新
    private _scheduleUpdate() {
        if (this._updateRAF) {
            return;
        }

        this._updateRAF = requestAnimationFrame(() => {
            if (this._pendingUpdates.size > 0) {
                // 批量处理所有待更新的项目
                const updatedIds = Array.from(this._pendingUpdates);
                this._batchInvalidateRelatedCaches(updatedIds);
                this._pendingUpdates.clear();
            }
            this._updateRAF = null;
        });
    }

    // 当某个项目被删除时，清理相关的位置缓存
    private _invalidatePositionCacheForDeletedId(deletedId: string | number, oldIds: (string | number)[]) {
        // 找到被删除项目在旧数组中的索引
        const deletedIndex = oldIds.indexOf(deletedId);
        if (deletedIndex === -1) {
            return;
        }

        // 清理该索引及之后的所有位置缓存，因为删除操作会影响后续项目的位置
        const keysToDelete: number[] = [];
        for (const [cachedIndex] of this._scrollPositionCache) {
            if (cachedIndex >= deletedIndex) {
                keysToDelete.push(cachedIndex);
            }
        }

        // 批量删除缓存项
        keysToDelete.forEach((key) => {
            this._scrollPositionCache.delete(key);
        });
    }

    // 批量清理相关缓存 - 性能优化版本
    private _batchInvalidateRelatedCaches(changedIds: (string | number)[]) {
        if (!this.param || !this.param.uniqueIds) {
            return;
        }

        // 找到所有变化项目的最小索引
        let minChangedIndex = Infinity;
        for (const id of changedIds) {
            const index = this.param.uniqueIds.indexOf(id);
            if (index !== -1 && index < minChangedIndex) {
                minChangedIndex = index;
            }
        }

        if (minChangedIndex === Infinity) {
            return;
        }

        // 批量清理该索引之后的所有位置缓存
        const keysToDelete: number[] = [];
        for (const [cachedIndex] of this._scrollPositionCache) {
            if (cachedIndex > minChangedIndex) {
                keysToDelete.push(cachedIndex);
            }
        }

        // 批量删除缓存项
        keysToDelete.forEach((key) => {
            this._scrollPositionCache.delete(key);
        });

        // 更新增量缓存
        for (const id of changedIds) {
            const index = this.param.uniqueIds.indexOf(id);
            if (index !== -1) {
                const size = this.sizes.get(id) || this.getEstimateSize();
                this._updateIncrementalCache(index, size);
            }
        }
    }

    // 简化的尺寸缓存清理 - 优先保留视口附近的尺寸信息
    private _cleanupSizes() {
        if (this.sizes.size > this._maxCacheSize * 2) { // 降低触发阈值
            const currentRangeStart = this.range.start;
            const currentRangeEnd = this.range.end;
            const buffer = this.param.buffer || 0;
            const uniqueIds = this.param.uniqueIds || [];

            const newSizes = new Map<string | number, number>();
            let keptCount = 0;
            const maxKeptSize = Math.floor(this._maxCacheSize * 1.5); // 保留的最大数量

            // 优先保留当前视口和缓冲区内的项目尺寸
            for (let i = Math.max(0, currentRangeStart - buffer); i <= Math.min(uniqueIds.length - 1, currentRangeEnd + buffer); i++) {
                const key = uniqueIds[i];
                if (this.sizes.has(key)) {
                    newSizes.set(key, this.sizes.get(key)!);
                    keptCount++;
                }
            }

            // 如果数量仍然不足，从现有缓存中补充（优先保留靠近视口的）
            if (keptCount < maxKeptSize) {
                const remainingEntries = Array.from(this.sizes.entries())
                    .filter(([key]) => !newSizes.has(key))
                    .map(([key, size]) => {
                        const index = uniqueIds.indexOf(key);
                        let distance = Infinity;
                        if (index !== -1) {
                            if (index < currentRangeStart) {
                                distance = currentRangeStart - index;
                            } else if (index > currentRangeEnd) {
                                distance = index - currentRangeEnd;
                            } else {
                                distance = 0;
                            }
                        }
                        return { key, size, distance };
                    })
                    .sort((a, b) => a.distance - b.distance); // 按距离排序，近的在前

                for (const item of remainingEntries) {
                    if (keptCount >= maxKeptSize) {
                        break;
                    }
                    if (!newSizes.has(item.key)) {
                        newSizes.set(item.key, item.size);
                        keptCount++;
                    }
                }
            }
            this.sizes = newSizes;
        }
    }

    // in some special situation (e.g. length change) we need to update in a row
    // try goiong to render next range by a leading buffer according to current direction
    handleDataSourcesChange() {
        let start = this.range.start;

        if (this.isFront()) {
            start = start - LEADING_BUFFER;
        } else if (this.isBehind()) {
            start = start + LEADING_BUFFER;
        }

        start = Math.max(start, 0);

        this.updateRange(this.range.start, this.getEndByStart(start));
    }

    // when slot size change, we also need force update
    handleSlotSizeChange() {
        this.handleDataSourcesChange();
    }

    // calculating range on scroll - 优化快速滚动性能
    handleScroll(offset: number) {
        const newDirection = offset < this.offset ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND;
        const offsetDelta = Math.abs(offset - this.offset);
        const estimateSize = this.param.estimateSize;

        // 计算滚动速度（像素/帧）
        const isVeryFastScroll = offsetDelta > estimateSize * 10; // 超过10个项目高度

        this.direction = newDirection;
        this.offset = offset;

        if (!this.param) {
            return;
        }

        if (this._scrollRAF) {
            cancelAnimationFrame(this._scrollRAF);
            this._scrollRAF = null;
        }

        // 超快速滚动：立即执行，跳过复杂的缓存操作
        if (isVeryFastScroll) {
            this._performScrollCalculation(true);
            return;
        }

        this._performScrollCalculation(false);
    }

    // 执行滚动计算的核心方法 - 支持快速滚动优化
    private _performScrollCalculation(skipCacheOptimization: boolean = false) {
        // 快速滚动模式：立即执行，跳过requestAnimationFrame
        if (skipCacheOptimization) {
            // 跳过复杂的缓存优化操作
            this._lastScrollDirection = this.direction;

            if (this.direction === DIRECTION_TYPE.FRONT) {
                this.handleFront(true); // 传递快速滚动模式
            } else if (this.direction === DIRECTION_TYPE.BEHIND) {
                this.handleBehind(true); // 传递快速滚动模式
            }
            return;
        }

        // 普通模式：使用requestAnimationFrame优化滚动性能
        if (this._scrollRAF) {
            cancelAnimationFrame(this._scrollRAF);
        }

        this._scrollRAF = requestAnimationFrame(() => {
            // 方向改变时清理部分缓存以优化内存
            if (this._lastScrollDirection && this._lastScrollDirection !== this.direction) {
                this._optimizeCache();
            }
            this._lastScrollDirection = this.direction;

            if (this.direction === DIRECTION_TYPE.FRONT) {
                this.handleFront(false); // 普通模式
            } else if (this.direction === DIRECTION_TYPE.BEHIND) {
                this.handleBehind(false); // 普通模式
            }
        });
    }

    handleFront(fastScrollMode: boolean = false) {
        const overs = this.getScrollOvers(fastScrollMode);
        // should not change range if start doesn't exceed overs
        if (overs > this.range.start) {
            return;
        }

        // move up start by a buffer length, and make sure its safety
        const start = Math.max(overs - this.param.buffer, 0);
        this.checkRange(start, this.getEndByStart(start));
    }

    handleBehind(fastScrollMode: boolean = false) {
        const overs = this.getScrollOvers(fastScrollMode);
        // range should not change if scroll overs within buffer
        if (overs < this.range.start + this.param.buffer) {
            return;
        }

        this.checkRange(overs, this.getEndByStart(overs));
    }

    // return the pass overs according to current scroll offset
    getScrollOvers(fastScrollMode: boolean = false) {
        // if slot header exist, we need subtract its size
        const offset = this.offset - this.param.slotHeaderSize;
        if (offset <= 0) {
            return 0;
        }
        // if is fixed type, that can be easily
        if (this.isFixedType()) {
            return Math.floor(offset / this.fixedSizeValue);
        }

        // 快速滚动模式：使用估算计算，避免二分查找的复杂性
        if (fastScrollMode) {
            const estimateSize = this.getEstimateSize();
            return Math.floor(offset / estimateSize);
        }

        let low = 0;
        let middle = 0;
        let middleOffset = 0;
        let high = this.param.uniqueIds.length;

        while (low <= high) {
            middle = low + Math.floor((high - low) / 2);
            // 在二分查找中，普通模式下不使用快速滚动优化，确保精确计算
            middleOffset = this.getIndexOffset(middle, false);

            if (middleOffset === offset) {
                return middle;
            }
            if (middleOffset < offset) {
                low = middle + 1;
            } else if (middleOffset > offset) {
                high = middle - 1;
            }
        }

        return low > 0 ? --low : 0;
    }

    // 滚动位置计算方法 - 优化版本，支持快速滚动模式
    getIndexOffset(givenIndex: number, fastScrollMode: boolean = false) {
        if (!givenIndex) {
            return 0;
        }

        // 快速滚动模式：使用简化计算，跳过复杂缓存操作
        if (fastScrollMode) {
            // 检查基础缓存
            const cachedOffset = this._scrollPositionCache.get(givenIndex);
            if (cachedOffset !== undefined) {
                return cachedOffset;
            }

            // 使用估算尺寸快速计算，避免复杂的优化策略
            const estimateSize = this.getEstimateSize();
            const fastOffset = givenIndex * estimateSize;

            // 简单缓存（不触发缓存管理）
            this._scrollPositionCache.set(givenIndex, fastOffset);
            return fastOffset;
        }

        // 普通模式：完整的优化计算
        // 检查缓存
        const cachedOffset = this._scrollPositionCache.get(givenIndex);
        if (cachedOffset !== undefined) {
            return cachedOffset;
        }

        // 尝试使用增量计算优化性能
        const optimizedOffset = this._calculateOffsetOptimized(givenIndex);
        if (optimizedOffset !== null) {
            return optimizedOffset;
        }

        // 回退到直接计算
        let offset = 0;
        for (let index = 0; index < givenIndex; index++) {
            const indexSize = this.sizes.get(this.param.uniqueIds[index]);
            offset += typeof indexSize === 'number' ? indexSize : this.getEstimateSize();
        }

        // 缓存结果
        this._scrollPositionCache.set(givenIndex, offset);
        this._manageCacheSize();

        return offset;
    }

    // 优化的偏移量计算方法
    private _calculateOffsetOptimized(targetIndex: number): number | null {
        // 1. 优先尝试相邻索引快速计算（O(1)）
        const adjacentResult = this._calculateWithIncrementalCache(targetIndex);
        if (adjacentResult !== null) {
            return adjacentResult;
        }

        // 2. 查找最近的已缓存索引
        let nearestCachedIndex = -1;
        let nearestCachedOffset = 0;
        let minDistance = Infinity;

        for (const [cachedIndex, cachedOffset] of this._scrollPositionCache) {
            const distance = Math.abs(targetIndex - cachedIndex);
            if (distance < minDistance && cachedIndex < targetIndex) {
                minDistance = distance;
                nearestCachedIndex = cachedIndex;
                nearestCachedOffset = cachedOffset;
            }
        }

        // 3. 根据距离选择策略
        if (nearestCachedIndex >= 0) {
            // 距离较近时使用链式计算（避免过多的单步计算）
            if (minDistance <= 10) { // 可配置的阈值
                return this._calculateUsingIncrementalChain(targetIndex);
            } else if (minDistance < targetIndex / 2) { // 距离较远时使用传统方法（避免过长的链式计算）
                let offset = nearestCachedOffset;
                for (let index = nearestCachedIndex + 1; index <= targetIndex; index++) {
                    const indexSize = this.sizes.get(this.param.uniqueIds[index]);
                    const currentSize = typeof indexSize === 'number' ? indexSize : this.getEstimateSize();
                    offset += currentSize;

                    // 批量更新增量缓存（减少频繁调用）
                    this._updateIncrementalCache(index, currentSize);
                }

                // 缓存结果
                this._scrollPositionCache.set(targetIndex, offset);
                return offset;
            }
        }

        return null;
    }

    // 使用增量缓存进行快速计算（相邻索引优化）
    private _calculateWithIncrementalCache(targetIndex: number): number | null {
        // 检查是否有相邻索引的缓存可以利用
        const prevIndex = targetIndex - 1;
        const nextIndex = targetIndex + 1;

        // 尝试从前一个索引计算：offset[i] = offset[i-1] + size[i]
        const prevOffset = this._scrollPositionCache.get(prevIndex);
        if (prevOffset !== undefined) {
            const currentSize = this._getIndexSize(targetIndex);
            if (currentSize !== null) {
                const targetOffset = prevOffset + currentSize;
                this._scrollPositionCache.set(targetIndex, targetOffset);
                this._updateIncrementalCache(targetIndex, currentSize);
                return targetOffset;
            }
        }

        // 尝试从后一个索引反推：offset[i] = offset[i+1] - size[i]
        const nextOffset = this._scrollPositionCache.get(nextIndex);
        if (nextOffset !== undefined) {
            const currentSize = this._getIndexSize(targetIndex); // 修正：使用当前索引的尺寸
            if (currentSize !== null) {
                const targetOffset = nextOffset - currentSize; // 修正：减去当前索引的尺寸
                this._scrollPositionCache.set(targetIndex, targetOffset);
                this._updateIncrementalCache(targetIndex, currentSize);
                return targetOffset;
            }
        }

        // 相邻索引都不可用，返回null让上层方法处理
        return null;
    }

    // 使用增量缓存链进行计算（中等距离跳转优化）
    private _calculateUsingIncrementalChain(targetIndex: number): number | null {
        // 查找最近的基准点
        let baseIndex = -1;
        let baseOffset = 0;

        for (const [cachedIndex, cachedOffset] of this._scrollPositionCache) {
            if (cachedIndex < targetIndex && cachedIndex > baseIndex) {
                baseIndex = cachedIndex;
                baseOffset = cachedOffset;
            }
        }

        if (baseIndex === -1) {
            return null;
        }

        // 检查距离是否合理（避免过长的链式计算）
        const distance = targetIndex - baseIndex;
        if (distance > 50) { // 距离过远，不适合链式计算
            return null;
        }

        // 从基准点开始逐步累加到目标索引
        let tempOffset = baseOffset;

        // 修正：从 baseIndex + 1 开始，到 targetIndex 结束
        for (let i = baseIndex + 1; i <= targetIndex; i++) {
            // 优先使用增量缓存
            const incrementalSize = this._incrementalCache.get(i);
            if (incrementalSize !== undefined) {
                tempOffset += incrementalSize;
            } else {
                // 如果增量缓存中断，尝试获取实际尺寸
                const actualSize = this._getIndexSize(i); // 修正：使用正确的索引
                if (actualSize !== null) {
                    tempOffset += actualSize;
                    this._updateIncrementalCache(i, actualSize);
                } else {
                    // 无法获取尺寸，链式计算失败
                    return null;
                }
            }
        }

        // 缓存计算结果
        this._scrollPositionCache.set(targetIndex, tempOffset);
        return tempOffset;
    }

    // 获取指定索引的尺寸
    private _getIndexSize(index: number): number | null {
        if (!this.param || !this.param.uniqueIds || index >= this.param.uniqueIds.length) {
            return null;
        }

        const indexSize = this.sizes.get(this.param.uniqueIds[index]);
        return typeof indexSize === 'number' ? indexSize : this.getEstimateSize();
    }

    // 更新增量缓存 - 优化清理策略
    private _updateIncrementalCache(index: number, size: number) {
        // 存储当前索引的尺寸到增量缓存
        this._incrementalCache.set(index, size);

        // 限制增量缓存大小
        if (this._incrementalCache.size > this._maxCacheSize) {
            const currentRangeStart = this.range.start;
            const currentRangeEnd = this.range.end;
            const entries = Array.from(this._incrementalCache.entries());

            const entriesWithDistance = entries.map(([idx, sz]) => {
                let distance = Infinity;
                if (idx < currentRangeStart) {
                    distance = currentRangeStart - idx;
                } else if (idx > currentRangeEnd) {
                    distance = idx - currentRangeEnd;
                } else {
                    distance = 0; // 在视口内
                }
                return { index: idx, size: sz, distance };
            });

            // 按距离排序，距离大的在前（优先删除）
            entriesWithDistance.sort((a, b) => b.distance - a.distance);

            const numToDelete = this._incrementalCache.size - Math.floor(this._maxCacheSize * 0.8);
            const newCache = new Map<number, number>();

            const itemsToKeep = entriesWithDistance.slice(numToDelete);
            itemsToKeep.sort((a, b) => a.index - b.index); // 按索引顺序重新插入
            itemsToKeep.forEach((item) => newCache.set(item.index, item.size));
            this._incrementalCache = newCache;
        }
    }

    // 管理缓存大小 - 优化版本，优先保留视口附近的缓存
    private _manageCacheSize() {
        if (this._scrollPositionCache.size > this._maxCacheSize) {
            const currentRangeStart = this.range.start;
            const currentRangeEnd = this.range.end;
            const entries = Array.from(this._scrollPositionCache.entries());

            // 计算每个缓存项与当前视口的距离
            const entriesWithDistance = entries.map(([index, offset]) => {
                let distance = Infinity;
                if (index < currentRangeStart) {
                    distance = currentRangeStart - index;
                } else if (index > currentRangeEnd) {
                    distance = index - currentRangeEnd;
                } else {
                    distance = 0; // 在视口内
                }
                return { index, offset, distance };
            });

            // 按距离排序，距离大的在前（优先删除）
            entriesWithDistance.sort((a, b) => b.distance - a.distance);

            const numToDelete = this._scrollPositionCache.size - Math.floor(this._maxCacheSize * 0.8); // 保留80%
            const newCache = new Map<number, number>();

            // 保留距离近的缓存项
            const itemsToKeep = entriesWithDistance.slice(numToDelete);
            itemsToKeep.sort((a, b) => a.index - b.index); // 按索引顺序重新插入，有利于后续查找
            itemsToKeep.forEach((item) => newCache.set(item.index, item.offset));
            this._scrollPositionCache = newCache;
        }
    }

    // 优化缓存策略 - 更智能地清理
    private _optimizeCache() {
        const bufferSize = this.param.buffer || 0;
        const currentRangeStart = this.range.start;
        const currentRangeEnd = this.range.end;

        // 定义一个更宽泛的保留区域，包括当前视口和双向缓冲区
        const extendedKeepRange = {
            start: Math.max(0, currentRangeStart - bufferSize * 2),
            end: Math.min(this.param.uniqueIds.length - 1, currentRangeEnd + bufferSize * 2),
        };

        // 清理 _scrollPositionCache
        if (this._scrollPositionCache.size > this._maxCacheSize / 2) {
            const newScrollCache = new Map<number, number>();
            for (const [index, offset] of this._scrollPositionCache) {
                // 保留扩展保留区域内的缓存
                if (index >= extendedKeepRange.start && index <= extendedKeepRange.end) {
                    newScrollCache.set(index, offset);
                } else {
                    // 对于扩展区域之外的，如果滚动方向改变，则更积极清理反向的缓存
                    if (this.direction === DIRECTION_TYPE.FRONT && index > currentRangeEnd + bufferSize) {
                        // 向上滚动，清理远端下方的缓存
                        continue;
                    }
                    if (this.direction === DIRECTION_TYPE.BEHIND && index < currentRangeStart - bufferSize) {
                        // 向下滚动，清理远端上方的缓存
                        continue;
                    }
                    // 如果缓存项仍在扩展保留区附近，但不在严格的保留区内，可以考虑保留一部分
                    // 这里为了简化，我们只保留 extendedKeepRange 内的
                }
            }
            this._scrollPositionCache = newScrollCache;
        }

        // 清理 _incrementalCache
        if (this._incrementalCache.size > this._maxCacheSize / 2) {
            const newIncrementalCache = new Map<number, number>();
            for (const [index, size] of this._incrementalCache) {
                if (index >= extendedKeepRange.start && index <= extendedKeepRange.end) {
                    newIncrementalCache.set(index, size);
                }
            }
            this._incrementalCache = newIncrementalCache;
        }

        // 定期清理尺寸缓存
        this._cleanupSizes();
    }

    // is fixed size type
    isFixedType() {
        return this.calcType === CALC_TYPE.FIXED;
    }

    // return the real last index
    getLastIndex() {
        return this.param.uniqueIds.length - 1;
    }

    // in some conditions range is broke, we need correct it
    // and then decide whether need update to next range
    checkRange(start: number, end: number) {
        const keeps = this.param.keeps;
        const total = this.param.uniqueIds.length;
        // datas less than keeps, render all
        if (total <= keeps) {
            start = 0;
            end = this.getLastIndex();
        } else if (end - start < keeps - 1) {
            // if range length is less than keeps, corrent it base on end
            start = end - keeps + 1;
        }

        if (this.range.start !== start) {
            this.updateRange(start, end);
        }
    }

    // setting to a new range and rerender
    updateRange(start: number, end: number) {
        this.range.start = start;
        this.range.end = end;
        this.range.padFront = this.getPadFront();
        this.range.padBehind = this.getPadBehind();

        this.callUpdate(this.getRange());
    }

    // return end base on start
    getEndByStart(start: number) {
        const theoryEnd = start + this.param.keeps - 1;
        const truelyEnd = Math.min(theoryEnd, this.getLastIndex());
        return truelyEnd;
    }

    // return total front offset
    getPadFront() {
        if (this.isFixedType()) {
            return this.fixedSizeValue * this.range.start;
        }
        return this.getIndexOffset(this.range.start);
    }

    // return total behind offset
    getPadBehind() {
        const end = this.range.end;
        const lastIndex = this.getLastIndex();

        if (this.isFixedType()) {
            return (lastIndex - end) * this.fixedSizeValue;
        }

        // if not, use a estimated value
        return (lastIndex - end) * this.getEstimateSize();
    }

    // get the item estimate size
    getEstimateSize() {
        return this.isFixedType()
            ? this.fixedSizeValue
            : this.firstRangeAverageSize || this.param.estimateSize;
    }

    getTotalSize() {
        return [...this.sizes.values()].reduce((acc, val) => acc + val, 0);
    }

    // 清理所有缓存，用于数据变化后强制重新计算
    // 特别适用于scrollToBottom等需要准确计算的场景
    clearAllCaches() {
        this._scrollPositionCache.clear();
        this._incrementalCache.clear();
    }
}

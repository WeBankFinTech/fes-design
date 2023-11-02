<template>
    <FCalendar
        :style="{ height: '500px' }"
        :shortcuts="[
            {
                label: '今天',
                time: Date.now(),
            },
            {
                label: '疯狂星期四',
                time: () => {
                    const today = new Date();
                    const crazyDay = new Date();
                    crazyDay.setDate(today.getDate() + (4 - today.getDay()));
                    return crazyDay.getTime();
                },
            },
        ]"
    />
</template>

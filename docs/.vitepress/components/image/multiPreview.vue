<template>
    <FPreviewGroup>
        <div class="group-wrapper">
            <FImage
                style="width: 200px; height: 200px"
                fit="contain"
                src="/images/1.jpeg"
                preview
                download
            ></FImage>
            <FImage
                style="width: 200px; height: 200px"
                fit="contain"
                src="/images/2.jpeg"
                preview
            ></FImage>
            <FImage
                style="width: 200px; height: 200px"
                fit="contain"
                src="/images/3.jpeg"
                preview
            ></FImage>
            <FImage
                style="width: 200px; height: 200px"
                fit="contain"
                src="/images/4.jpeg"
                preview
            ></FImage>
        </div>
    </FPreviewGroup>
</template>
<script>
export default {};
</script>
<style>
.group-wrapper {
    display: flex;
}
</style>

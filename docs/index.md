---
home: true
aside: false
footer: false
returnToTop: false
---


<ClientOnly>
  <section id="hero">
    <div class="descrition">
      <img class="logo-img" :src="withBase('./images/fes-logo.svg')">
      <h3>微众银行中后台设计 Fes Design</h3>
    </div>
    <p class="actions">
      <a class="get-started" :href="withBase('/zh/components/button.html')">快速开始</a>
    </p>
  </section>
</ClientOnly>

<script setup>
import { withBase } from 'vitepress'
</script>

<style>
.logo {
    display: inline-block;
    vertical-align: middle !important;
    padding-bottom: 2px;
}
</style>

<style scoped>
.descrition {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.descrition .logo-img {
    width: 362px;
    height: 233px;
}
.descrition h3 {
    font-size: 36px;
}
.actions {
    margin: 0;
    text-align: center;
}
.actions a {
  font-size: 18px;
  display: inline-block;
  background-color: #5384ff;
  padding: 10px 24px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.5s, color 0.5s;
  text-decoration: none;
}

.actions .get-started {
  font-weight: 600;
  color: #fff;
  /* background: linear-gradient(135deg, #5384ff, #f5222d); */
  background: #5384ff;
}


.dark .descrition {
    color: #fff;
}
</style>

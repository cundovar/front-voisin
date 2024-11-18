<template>
    <div>
        <div class="layout-container">

            <Header />
            <main class="content">
                <NuxtPage />
      
            </main>
            <Footer />
            <FooterNav/>
          </div>

        
</div>
  </template>
  <style>
.content {
  flex: 1;
}

.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}


</style>
  <script>
  import Footer from './components/Footer.vue';
import FooterNav from './components/FooterNav.vue';
import Header from './components/Header.vue'

  
  export default {
    components: {
      Header,
      Footer,
      FooterNav
    }
  }
  </script>
  
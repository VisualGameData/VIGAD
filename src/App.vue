<template>
  <div class="logo-box">
    <img class="logo vite" src="./assets/vite.svg" />
    <img class="logo electron" src="./assets/electron.svg" />
    <img class="logo vue" src="./assets/vue.svg" />
  </div>
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <div class="static-public">
    Place static files into the <code>/public</code> folder
    <img style="width: 77px" :src="'./node.png'" />
  </div>

  <router-link to="/">Home</router-link>
  <router-link to="/error">Error</router-link>
  <router-link to="/page-not-found">Page Not Found</router-link>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<style lang="scss">
@import './styles/variables.scss';

// transforms the variables into css variables
:root {
  @each $colorname, $palette in $palettes {
    @each $key, $value in $palette {
      $keyname: '--palette-' + $colorname + '-' + $key;
      #{$keyname}: #{$value};
    }
  }
}

*,
:after,
:before {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body,
html {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Arial, sans-serif;
}

body {
  position: relative;
  min-height: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  background-color: var(--palette-background-primary);
}

// boilerplait from creation

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: 0.75s;
  }
  .vite {
    &:hover {
      filter: drop-shadow(0 0 2em #747bff);
    }
  }
  .electron {
    &:hover {
      filter: drop-shadow(0 0 2em #9feaf9);
    }
  }
  .vue {
    &:hover {
      filter: drop-shadow(0 0 2em #249b73);
    }
  }
}

.static-public {
  display: flex;
  align-items: center;
  justify-content: center;
  code {
    background-color: #eee;
    padding: 2px 4px;
    margin: 0 4px;
    border-radius: 4px;
    color: #304455;
  }
}
</style>

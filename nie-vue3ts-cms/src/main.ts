import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import './assets/css/index.less'
//引入element-ui样式（主要用于ElMessage.warning）
//下面两行都能实现warning，但是第二种从哪儿找到有些难
//import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/el-message.css'
//element-ui-icon小图标的全局注册，
//也可以在global / register - icons.ts中封装进去更好看，但对我来说有些难，没有用
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(pinia)
app.mount('#app')

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { Quasar } from 'quasar';

const app = createApp(App)

app.use(Quasar, {
    // Quasar plugins go here
  });

app.use(router)
app.mount("#app")

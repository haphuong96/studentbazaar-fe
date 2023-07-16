import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // define: {
  //   global: {} // this line to fix aws cognito issue. refference to: https://github.com/aws-amplify/amplify-js/issues/678
  // },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // ref https://github.com/vueComponent/ant-design-vue/blob/main/components/style/themes/default.less
          "primary-color": "#07A0B8",
          "btn-border-radius-base": "10px",
          "btn-border-radius-sm": "6px"
        },
        javascriptEnabled: true
      },
      scss: {
        additionalData: `@import "@/styles/main.scss";`
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});

import { defineConfig, presetWind, presetIcons } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      brand: '#f56a47',
    },
  },
  presets: [presetWind(), presetIcons()],
}) 
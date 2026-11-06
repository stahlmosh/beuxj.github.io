import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Adds the share image and canonical address to index.html, but only when VITE_SITE_URL is set
 * (e.g. in a .env file: VITE_SITE_URL=https://yourdomain.com). Share previews need a full address.
 */
function siteMeta(siteUrl: string): Plugin {
  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      const url = siteUrl.replace(/\/$/, '')
      if (!url) return html
      return html
        .replace('content="summary"', 'content="summary_large_image"')
        .replace(
          '</head>',
          `    <link rel="canonical" href="${url}/" />\n    <meta property="og:url" content="${url}/" />\n    <meta property="og:image" content="${url}/og-image.png" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta name="twitter:image" content="${url}/og-image.png" />\n  </head>`,
        )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  return { plugins: [react(), tailwindcss(), siteMeta(env.VITE_SITE_URL ?? '')] }
})

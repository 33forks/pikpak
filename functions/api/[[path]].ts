const baseUrlMap = {
  user: 'https://user.mypikpak.com',
  drive: 'https://api-drive.mypikpak.com',
  notion: 'https://api.notion.com',
  depot: 'https://pikpak-depot.z10.workers.dev',
}

export const onRequest = [
  async ({ request }: { request: Request }) => {
    const srcUrl = new URL(request.url)
    const srcRequest = srcUrl.pathname + srcUrl.search
    const [ domain, uri ] = srcRequest.match(/^\/api\/([^/]+)(.*)$/) || []
    if (!domain || !uri) {
      return new Response(`404 not found\r\ndomain: ${domain}\r\nuri: ${uri}\r\nrequest url: ${request.url}`, { status: 404 })
    }
    const baseUrl = baseUrlMap[domain]
    if (!baseUrl) {
      return new Response(`404 base url not found\r\ndomain: ${domain}\r\nuri: ${uri}\r\nrequest url: ${request.url}`, { status: 404 })
    }
    const baseUrlOrigin = new URL(baseUrl).origin
    const newUrl = new URL(uri, baseUrl)
    if (baseUrlOrigin !== newUrl.origin) {
      return new Response(`400 bad request`, { status: 400 })
    }
    const newRequest = new Request(newUrl, request)
    return fetch(newRequest)
  }
]

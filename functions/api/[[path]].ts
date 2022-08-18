const baseUrlMap = {
  user: 'https://user.mypikpak.com',
  drive: 'https://api-drive.mypikpak.com',
  notion: 'https://api.notion.com',
  depot: 'https://pikpak-depot.z10.workers.dev',
}

export const onRequest = [
  async ({ request }: { request: Request }) => {
    const srcUrl = request.url
    const [ domain, uri ] = srcUrl.match(/^\/api\/([^/]+)(.*)$/) || []
    if (!domain || !uri) {
      return new Response(`404 not found\r\ndomain: ${domain}\r\nuri: ${uri}`, { status: 404 })
    }
    const baseUrl = baseUrlMap[domain]
    if (!baseUrl) {
      return new Response(`404 base url not found\r\ndomain: ${domain}\r\nuri: ${uri}`, { status: 404 })
    }
    const newUrl = new URL(uri, baseUrl)
    const newRequest = new Request(newUrl, request)
    return fetch(newRequest)
  }
]

import { BlogodyAPI } from '@blogody/api-client'

interface BlogodyExportProps {
  key: string
}

// https://github.com/johnloy/esm-commonjs-interop-manual
// http://choly.ca/post/typescript-json/

export class BlogodyExport {
  private api: BlogodyAPI

  constructor({ key }: BlogodyExportProps) {
    const api = new BlogodyAPI({ key })
    this.api = api
  }

  async exportData(): Promise<any | null> {
    const api = this.api

    const settings = await api.settings()
    const tags = await api.authors()
    const authors = await api.authors()
    const posts = await api.posts()
    const pages = await api.posts()

    const blogody = {
      version: '1.0.0',
      project: 'TestProject',
      timestamp: new Date().toISOString(),
    }

    const data = { blogody, settings, tags, authors, posts, pages }
    return data
  }
}

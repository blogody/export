import { BlogodyAPI, Settings, Tag, Author, Post, Page } from '@blogody/api-client'
import { unified } from 'unified'
import html from 'rehype-parse'
import rehype2remark from 'rehype-remark'
import markdown from 'remark-stringify'
import { promises as fs } from 'fs'

const processor = unified().use(html).use(rehype2remark).use(markdown)

interface ExportProps {
  format?: 'html' | 'markdown'
}

interface Blogody {
  version: string
  project: string
  timestamp: string
}

interface ExportPost extends Post {
  markdown?: string
}

interface ExportPage extends Page {
  markdown?: string
}

interface ExportResult {
  blogody: Blogody
  settings: Settings | null
  tags: Tag[]
  authors: Author[]
  posts: ExportPost[]
  pages: ExportPage[]
}

const exportProject =
  (api: BlogodyAPI) =>
  async (props?: ExportProps): Promise<ExportResult | null> => {
    const format = props?.format ?? 'html'
    const settings = await api.settings()
    const tags = await api.authors()
    const authors = await api.authors()

    const url = settings?.url?.split('.')[0]
    const project = url?.replace('https://', '') || 'project'

    const blogody: Blogody = {
      version: '1.0.0',
      project,
      timestamp: new Date().toISOString(),
    }

    const posts = await api.posts()
    const pages = await api.posts()

    if (format === 'html') return { blogody, settings, tags, authors, posts, pages }
    if (format !== 'markdown') return null

    const mdPosts = posts.map((post) => {
      const markdown = processor.processSync(post.html).toString()
      return { ...post, html: '', markdown }
    })

    const mdPages = pages.map((page) => {
      const markdown = processor.processSync(page.html).toString()
      return { ...page, html: '', markdown }
    })

    return { blogody, settings, tags, authors, posts: mdPosts, pages: mdPages }
  }

interface writeFileProps {
  jsonData: ExportResult
}

const writeProject = async ({ jsonData }: writeFileProps): Promise<void> => {
  const timestamp = new Date().toISOString().replace('T', '-').replace(/:/g, '-').split('.')[0]
  const fileName = `${jsonData.blogody.project}.blogody.${timestamp}.json`
  const filePath = `./${fileName}`

  let handle
  try {
    handle = await fs.open(filePath, 'w')
    const json = JSON.stringify(jsonData)
    await handle.writeFile(json)
  } finally {
    await handle?.close()
  }
}

const writeProjectPosts = async ({ jsonData }: writeFileProps): Promise<void> => {
  jsonData.posts.map((post) => {
    const format = post.markdown ? 'md' : 'html'
    const fileName = `${post.slug}.${format}`
    const filePath = `./${fileName}`

    fs.open(filePath, 'w').then((handle) => {
      const content = post.markdown ? post.markdown : post.html
      handle.writeFile(content).finally(() => {
        handle.close()
      })
    })
  })
}

const writeProjectPages = async ({ jsonData }: writeFileProps): Promise<void> => {
  jsonData.pages.map((page) => {
    const format = page.markdown ? 'md' : 'html'
    const fileName = `${page.slug}.${format}`
    const filePath = `./${fileName}`

    fs.open(filePath, 'w').then((handle) => {
      const content = page.markdown ? page.markdown : page.html
      handle.writeFile(content).finally(() => {
        handle.close()
      })
    })
  })
}

interface BlogodyExportProps {
  key: string
}

export class BlogodyExport {
  private api: BlogodyAPI

  constructor({ key }: BlogodyExportProps) {
    const api = new BlogodyAPI({ key })
    this.api = api
  }

  async export(props?: ExportProps): Promise<ExportResult | null> {
    return exportProject(this.api)(props)
  }

  async writeFile({ jsonData }: writeFileProps): Promise<void> {
    await writeProject({ jsonData })
  }

  async writePosts({ jsonData }: writeFileProps): Promise<void> {
    await writeProjectPosts({ jsonData })
  }

  async writePages({ jsonData }: writeFileProps): Promise<void> {
    await writeProjectPages({ jsonData })
  }
}

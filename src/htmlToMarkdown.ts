import { unified } from 'unified'
import html from 'rehype-parse'
import rehype2remark from 'rehype-remark'
import markdown from 'remark-stringify'

const processor = unified().use(html).use(rehype2remark).use(markdown)

export const htmlToMarkdown = async (html: string): Promise<string> => {
  const result = await processor.process(html)
  return result.toString()
}

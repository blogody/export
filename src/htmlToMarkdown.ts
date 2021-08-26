import rehype from 'rehype'
import markdown from 'remark-stringify'

export const htmlToMarkdown = async (htmlContent: string): Promise<string> => {
  const result = await rehype().use(markdown).process(htmlContent)
  return result.toString()
}

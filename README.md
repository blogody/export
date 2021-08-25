# Blogody Export

Export all your [Blogody](https://www.blogody.com) data with this isomorphic JavaScript/TypeScript package. You can export everything into a JSON text file and choose between HTML or Markdown output for your post and page data. Articles can also be written into individual files which makes it easier to import into other systems.

## News Article

More background information can be found in this [news article](https://www.blogody.com/news/how-to-export-your-blogody-blogs).

## 🚀 Quick start

1.  **Install the exporter**

    ```shell
    yarn add @blogody/export
    ```

2.  **Use the exporter in your js/ts projects**

    ```javascript
    import { BlogodyExport } from '@blogody/export'

    const api = new BlogodyExport({ key: 'YOUR BLOGODY API ACCESS KEY' })

    // make API calls
    const data = await api.export({ format: 'markdown' })

    // Other transforms can go here, e.g. strip settings (Do not strip the blogody section!)
    const fileData = { ...data, settings: undefined }

    // write everything to a JSON text file
    await api.writeFile({ jsonData: fileData })

    // write articles to separate files
    await api.writePosts({ jsonData: fileData })
    ```

Currently supported formats are : `HTML` and `Markdown`.

## 🔑 Blogody API Keys

Go to your Blogody account and create a new key under Settings > Developers.

# Copyright & License

Copyright (c) 2021 Blogody - Released under the [MIT license](LICENSE).

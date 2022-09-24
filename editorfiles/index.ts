import ReactDOM, { unstable_batchedUpdates } from 'react-dom'
import { useCallback, useState, useEffect, useRef } from 'react'
import Editor, { MultiRefType } from './Editor'

interface filelist {
  [key: string]: string
}

const filesName = [
  '/fn.js',
  '/app.js',
  '/cc.js',
  '/index.ts',
  '/test.css',
  '/src/index.js',
  '/style.less',
  '/styles/index.less',
  '/src/components/title/index.js',
  '/src/components/title/index.less',
]

const App = () => {
  const [value, setValue] = useState('')
  const [path, setPath] = useState('')
  const [files, setFiles] = useState<filelist>({})
  const editorRef = useRef<MultiRefType>(null)

  useEffect(() => {
    const promises = filesName.map(
      async v => await (await fetch(`/editorfiles${v}`)).text()
    )
    Promise.all(promises).then(filesContent => {
      const res: filelist = {}
      filesContent.forEach((content, index) => {
        res[filesName[index]] = content
      })
      unstable_batchedUpdates(() => {
        setFiles(res)
        // setPath(filesName[0]);
        // setValue(filesContent[0]);
      })
    })
  }, [])

  const handlePathChange = useCallback((key: string, value: string) => {
    setPath(key)
    setValue(value)
    console.log(key, value)
  }, [])

  const handleChange = useCallback(
    e => {
      setValue(e)
      setFiles(pre => ({
        ...pre,
        [path]: e,
      }))
    },
    [path]
  )

  const handleFileChange = (key: string, value: string) => {
    setFiles(pre => ({
      ...pre,
      [key]: value,
    }))
  }

  return (
    <div>
      <div onClick={() => console.log(editorRef.current)}>ref api</div>
      {Object.keys(files).length > 0 && (
        <div style={{ width: '800px', height: '600px' }}>
          <Editor
            ref={editorRef}
            // defaultPath="/fn.js"
            defaultFiles={files}
            // value={value}
            // path={path}
            // onPathChange={handlePathChange}
            // onValueChange={handleChange}
            // onFileChange={handleFileChange}
            options={{
              fontSize: 14,
              automaticLayout: true,
            }}
          />
        </div>
      )}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

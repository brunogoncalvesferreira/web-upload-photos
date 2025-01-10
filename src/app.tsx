import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { api } from './lib/axios'

interface Props {
  id: string
  name: string
  path: string
}

export function App() {
  const [photos, setPhotos] = useState<Props[]>([])

  const [file, setFile] = useState<File | null>(null)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    setFile(selectedFile as File)
  }

  const handleDownload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const data = new FormData() 

      data.append('file', file as File)

      if(!file) {
        return alert('Selecione um arquivo')
      }

      await api.post('/upload/files', data).then(() => {

          alert('Download realizado com sucesso!')
          setFile(null)
          handleGetPhotos()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetPhotos = async () => {
    try {
      const response = await api.get('/photos')
      const data =   await response.data
      setPhotos(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetPhotos()
  }, [])

  return (
    <main className="flex md:flex-row flex-col md:gap-20 gap-10 min-h-screen md:p-24 p-4">
      <Card className='bg-zinc-800 border-0 h-fit'>
        <CardHeader>
          <CardTitle className='text-2xl text-zinc-100'>Upload de Fotos</CardTitle>
          <CardDescription className='text-zinc-400'>
            Selecione uma foto e clique em "Fazer Download"
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleDownload}>
            <Input 
              className='text-zinc-100 file:text-zinc-100'
              type='file'
              onChange={handleFileChange}
              name='file'
            />

            <Button className='w-full rounded-md mt-2 bg-lime-400 font-bold text-zinc-900 hover:bg-lime-500 transition-colors'>
              Fazer Download
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <img 
            className={file ? 'w-full h-40 object-cover rounded-md' : 'hidden'}
            src={file ? URL.createObjectURL(file) : 'Foto selecionada'} 
          />
        </CardFooter>
      </Card>

      <Card className='bg-zinc-800 border-0 h-fit w-full'>
        <CardHeader>
          <CardTitle className='text-2xl text-zinc-100'>Fotos</CardTitle>
          <CardDescription className='text-zinc-400'>
            Aqui estão todas as suas fotos que foram enviadas
          </CardDescription>
        </CardHeader>

        <CardContent className='grid md:grid-cols-4 grid-cols-1 gap-2 w-full'>
          {photos.map(photo => {
            return (
              <img 
                className='w-full h-40 object-cover rounded-md'
                key={photo.id}
                src={`${api.defaults.baseURL}/files/${photo.path}`} 
              />
            )
          })}
        </CardContent>
      </Card>
    </main>
  )
}

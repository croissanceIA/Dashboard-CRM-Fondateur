'use client'

import { useState } from 'react'
import { Upload, Card, App } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import Papa from 'papaparse'
import { processCSVData } from '@/lib/dataProcessing'
import { validateCSVData } from '@/lib/validation'
import { Deal } from '@/lib/types'
import { MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES } from '@/lib/constants'

const { Dragger } = Upload

interface CSVUploaderProps {
  onDataLoaded: (deals: Deal[]) => void
}

export function CSVUploader({ onDataLoaded }: CSVUploaderProps) {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    showUploadList: false,
    beforeUpload: (file) => {
      const isCsv = ALLOWED_FILE_TYPES.some(type => file.type === type || file.name.endsWith('.csv'))
      if (!isCsv) {
        message.error('Vous ne pouvez uploader que des fichiers CSV!')
        return false
      }

      const isValidSize = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB
      if (!isValidSize) {
        message.error(`Le fichier doit être inférieur à ${MAX_FILE_SIZE_MB}MB!`)
        return false
      }

      handleFileUpload(file)
      return false
    }
  }

  const handleFileUpload = (file: File) => {
    setLoading(true)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const validation = validateCSVData(results.data)

          if (!validation.valid) {
            message.error(`Erreur de validation : ${validation.errors.join(', ')}`)
            setLoading(false)
            return
          }

          const deals = processCSVData(results.data)

          if (deals.length === 0) {
            message.warning('Aucun deal valide trouvé dans le fichier CSV')
            setLoading(false)
            return
          }

          message.success(`${deals.length} deals chargés avec succès!`)
          onDataLoaded(deals)
          setLoading(false)
        } catch (error) {
          console.error('Erreur lors du traitement du CSV:', error)
          message.error('Erreur lors du traitement du fichier CSV')
          setLoading(false)
        }
      },
      error: (error) => {
        // Ignorer l'erreur si l'utilisateur a annulé la sélection
        if (error.message?.includes('NotReadableError') || error.name === 'NotReadableError') {
          setLoading(false)
          return
        }
        console.error('Erreur de parsing CSV:', error)
        message.error('Impossible de lire le fichier CSV')
        setLoading(false)
      }
    })
  }

  return (
    <Card>
      <Dragger {...uploadProps} disabled={loading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
        </p>
        <p className="ant-upload-text">
          Cliquez ou glissez-déposez votre fichier CSV ici
        </p>
        <p className="ant-upload-hint">
          Fichier CSV uniquement. Taille maximale : {MAX_FILE_SIZE_MB}MB
        </p>
        {loading && <p style={{ color: '#1890ff', marginTop: 8 }}>Traitement en cours...</p>}
      </Dragger>
    </Card>
  )
}

import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import {
  Layout,
  PageBlock,
  PageHeader,
  Table,
  Button,
  Spinner,
} from 'vtex.styleguide'

import type { Category, Relation } from './services/api'
import { fetchRelations, saveRelations, fetchCatalogTree } from './services/api'
import { RelationModal } from './components/RelationModal'

import './styles.global.css'

const RelationsAdmin: FC = () => {
  const [relations, setRelations] = useState<Relation[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [relsRes, cats] = await Promise.all([
        fetchRelations(),
        fetchCatalogTree(),
      ])

      setRelations(relsRes.relations || [])
      setCategories(cats || [])
    } catch (err) {
      console.error('Failed to load initial data', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSaveRelation = async (newRelation: Relation) => {
    setIsSaving(true)
    try {
      // Data preservation strategy: append to existing array
      const updatedRelations = [...relations, newRelation]

      await saveRelations(updatedRelations)
      setRelations(updatedRelations)
    } catch (err) {
      console.error('Failed to save relation', err)
      alert(
        'Error al guardar la relación. Revisa la consola para más detalles.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteRelation = async (index: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta relación?')) return

    setIsSaving(true)
    try {
      const updatedRelations = [...relations]

      updatedRelations.splice(index, 1)
      await saveRelations(updatedRelations)
      setRelations(updatedRelations)
    } catch (err) {
      console.error('Failed to delete relation', err)
      alert('Error al eliminar la relación.')
    } finally {
      setIsSaving(false)
    }
  }

  const tableSchema = {
    properties: {
      source: {
        title: 'Categoría Origen',
        cellRenderer: ({ cellData, rowData }: any) => {
          // Soporte para formato nuevo (source.name) o formato viejo (rowData.name)
          const name = cellData ? cellData.name : rowData.name

          return <strong>{name || 'Desconocido'}</strong>
        },
      },
      targets: {
        title: 'Recomendaciones',
        cellRenderer: ({ cellData }: any) => {
          return cellData.map((t: any) => t.name).join(', ')
        },
      },
      actions: {
        title: 'Acciones',
        width: 100,
        cellRenderer: ({ rowData }: any) => {
          const index = relations.indexOf(rowData)

          return (
            <Button
              variation="danger"
              size="small"
              onClick={() => handleDeleteRelation(index)}
            >
              Eliminar
            </Button>
          )
        },
      },
    },
  }

  return (
    <Layout
      pageHeader={
        <PageHeader
          title="Crosselling Admin - Market Basket"
          subtitle="Administra las recomendaciones que aparecen en el minicart según la categoría."
        >
          <Button variation="primary" onClick={() => setIsModalOpen(true)}>
            Nueva Relación
          </Button>
        </PageHeader>
      }
    >
      <PageBlock variation="full">
        {isLoading ? (
          <div className="flex justify-center mt6">
            <Spinner />
          </div>
        ) : (
          <Table
            fullWidth
            schema={tableSchema}
            items={relations}
            emptyStateLabel="Aún no hay relaciones de recomendaciones creadas."
          />
        )}
      </PageBlock>

      <RelationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRelation}
        categories={categories}
        isLoading={isSaving}
      />
    </Layout>
  )
}

export default RelationsAdmin

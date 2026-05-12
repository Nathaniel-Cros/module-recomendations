import type { FC } from 'react'
import React, { useState, useMemo } from 'react'
import { Modal, Button, Dropdown, Tag } from 'vtex.styleguide'

import type { Category, Relation, RelationNode } from '../services/api'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (relation: Relation) => void
  categories: Category[]
  isLoading?: boolean
}

const flattenCategories = (
  cats: Category[] | Record<string, Category>,
  parentPath = ''
): RelationNode[] => {
  let flat: RelationNode[] = []

  // Safely convert to array if the backend returned an object with numeric keys
  const categoriesArray = Array.isArray(cats)
    ? cats
    : cats
    ? Object.values(cats)
    : []

  categoriesArray.forEach(c => {
    const currentPath = `${parentPath}${c.id}/`

    flat.push({ id: currentPath, name: c.name })
    if (c.children && c.children.length > 0) {
      flat = flat.concat(flattenCategories(c.children, currentPath))
    }
  })

  return flat
}

export const RelationModal: FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  isLoading,
}) => {
  const [sourceId, setSourceId] = useState<string>('')
  const [currentTargetId, setCurrentTargetId] = useState<string>('')
  const [targets, setTargets] = useState<RelationNode[]>([])

  const flatCategories = useMemo(() => flattenCategories(categories), [
    categories,
  ])

  const dropdownOptions = useMemo(() => {
    return flatCategories.map(c => ({ value: String(c.id), label: c.name }))
  }, [flatCategories])

  const handleAddTarget = () => {
    if (!currentTargetId) return
    const cat = flatCategories.find(c => String(c.id) === currentTargetId)

    if (cat && !targets.find(t => String(t.id) === String(cat.id))) {
      setTargets([...targets, cat])
    }

    setCurrentTargetId('')
  }

  const handleRemoveTarget = (id: string) => {
    setTargets(targets.filter(t => t.id !== id))
  }

  const handleSave = () => {
    const sourceCat = flatCategories.find(c => String(c.id) === sourceId)

    if (sourceCat && targets.length > 0) {
      onSave({
        source: sourceCat,
        targets,
      })
      // Reset form
      setSourceId('')
      setTargets([])
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Agregar Nueva Relación"
      responsiveFullScreen
      bottomBar={
        <div className="flex flex-row items-center bg-base w-100 justify-end">
          <span className="mr4">
            <Button variation="tertiary" onClick={onClose}>
              Cancelar
            </Button>
          </span>
          <Button
            variation="primary"
            onClick={handleSave}
            disabled={!sourceId || targets.length === 0 || isLoading}
            isLoading={isLoading}
          >
            Guardar
          </Button>
        </div>
      }
      onClose={onClose}
    >
      <div className="flex flex-column mb6">
        <h4 className="t-heading-4 mb4">Categoría Origen</h4>
        <Dropdown
          label="Selecciona la categoría que detonará la recomendación"
          options={dropdownOptions}
          value={sourceId}
          onChange={(e: any) => setSourceId(e.target.value)}
        />
      </div>

      <div className="flex flex-column mb4">
        <h4 className="t-heading-4 mb4">
          Categorías Destino (Recomendaciones)
        </h4>
        <div className="flex flex-row items-end mb4">
          <div className="flex-grow-1 mr4">
            <Dropdown
              label="Selecciona categorías a recomendar"
              options={dropdownOptions}
              value={currentTargetId}
              onChange={(e: any) => setCurrentTargetId(e.target.value)}
            />
          </div>
          <Button
            variation="secondary"
            onClick={handleAddTarget}
            disabled={!currentTargetId}
          >
            Agregar
          </Button>
        </div>

        <div className="flex flex-wrap">
          {targets.map(t => (
            <span key={t.id} className="mr3 mb3">
              <Tag type="warning" onClick={() => handleRemoveTarget(t.id)}>
                {t.name} (x)
              </Tag>
            </span>
          ))}
          {targets.length === 0 && (
            <span className="t-small c-muted-2">
              Aún no hay categorías destino agregadas.
            </span>
          )}
        </div>
      </div>
    </Modal>
  )
}

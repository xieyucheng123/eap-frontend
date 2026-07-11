import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

// ============================================================================
// Value Stream CRUD
// ============================================================================

const CREATE_VALUE_STREAM = gql`
  mutation CreateValueStream($data: ValueStreamsInsertInput!) {
    valueStreamsCreateOne(data: $data) { id name }
  }
`

const UPDATE_VALUE_STREAM = gql`
  mutation UpdateValueStream($data: ValueStreamsUpdateInput!, $filter: ValueStreamsFilterInput!) {
    valueStreamsUpdate(data: $data, filter: $filter) { id name }
  }
`

const DELETE_VALUE_STREAM = gql`
  mutation DeleteValueStream($filter: ValueStreamsFilterInput!) {
    valueStreamsDelete(filter: $filter)
  }
`

const GET_VALUE_STREAMS = gql`
  query GetValueStreamsForCrud {
    valueStreams {
      nodes { id name description businessVersion status importance }
      paginationInfo { total }
    }
  }
`

interface ValueStream {
  id: string
  name: string
  description: string
  businessVersion: string
  status: string
  importance: string
}

function nowRFC3339() {
  return new Date().toISOString()
}

function newUUID() {
  return crypto.randomUUID()
}

export function ValueStreamCrudDialog({ open, onOpenChange, editing }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing: ValueStream | null
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [version, setVersion] = useState('v1.0')
  const [status, setStatus] = useState('active')
  const [importance, setImportance] = useState('high')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [createMut] = useMutation(CREATE_VALUE_STREAM)
  const [updateMut] = useMutation(UPDATE_VALUE_STREAM)

  useEffect(() => {
    if (open) {
      setError(null)
      if (editing) {
        setName(editing.name)
        setDescription(editing.description)
        setVersion(editing.businessVersion)
        setStatus(editing.status)
        setImportance(editing.importance)
      } else {
        setName('')
        setDescription('')
        setVersion('v1.0')
        setStatus('active')
        setImportance('high')
      }
    }
  }, [open, editing])

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      if (editing) {
        await updateMut({
          variables: {
            data: { name, description, businessVersion: version, status, importance },
            filter: { id: { eq: editing.id } },
          },
          refetchQueries: [{ query: GET_VALUE_STREAMS }],
        })
      } else {
        const now = nowRFC3339()
        await createMut({
          variables: {
            data: {
              id: newUUID(),
              name, description,
              businessVersion: version,
              status, importance,
              stakeholders: [], performanceMetrics: {},
              createdAt: now, updatedAt: now,
            },
          },
          refetchQueries: [{ query: GET_VALUE_STREAMS }],
        })
      }
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? '编辑价值流' : '新建价值流'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <div className="space-y-2">
            <Label>名称</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="价值流名称" />
          </div>
          <div className="space-y-2">
            <Label>描述</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="价值流描述" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>版本</Label>
              <Input value={version} onChange={e => setVersion(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="active">active</option>
                <option value="archived">archived</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>重要性</Label>
            <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={importance} onChange={e => setImportance(e.target.value)}>
              <option value="high">high</option>
              <option value="medium">medium</option>
              <option value="low">low</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleSubmit} disabled={loading || !name}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? '保存' : '创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ValueStreamDeleteDialog({ item, onConfirm }: {
  item: ValueStream | null
  onConfirm: () => void
}) {
  const [deleteMut] = useMutation(DELETE_VALUE_STREAM)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!item) return
    setLoading(true)
    try {
      await deleteMut({
        variables: { filter: { id: { eq: item.id } } },
        refetchQueries: [{ query: GET_VALUE_STREAMS }],
      })
      onConfirm()
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={!!item} onOpenChange={() => onConfirm()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
        </DialogHeader>
        <p className="py-4 text-sm text-muted-foreground">
          确定要删除价值流「{item?.name}」吗？此操作不可撤销。
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onConfirm}>取消</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '删除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { GET_VALUE_STREAMS }
export type { ValueStream }

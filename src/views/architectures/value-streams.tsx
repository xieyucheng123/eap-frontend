import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const GET_VALUE_STREAMS = gql`
  query GetValueStreams($page: Int, $size: Int) {
    valueStreams(page: { page: $page, size: $size }) {
      nodes {
        id
        name
        description
        businessVersion
        status
      }
      totalCount
    }
  }
`

export default function ValueStreams() {
  const [page, setPage] = useState(0)
  const pageSize = 10

  const { data, loading, error } = useQuery(GET_VALUE_STREAMS, {
    variables: { page, size: pageSize },
  })

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'draft': return 'secondary'
      case 'retired': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">价值流</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新建价值流
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>价值流列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-center py-8 text-muted-foreground">加载中...</div>}
          {error && <div className="text-center py-8 text-destructive">加载失败: {error.message}</div>}
          {data && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名称</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.valueStreams.nodes.map((vs: any) => (
                    <TableRow key={vs.id}>
                      <TableCell className="font-medium">{vs.name}</TableCell>
                      <TableCell className="text-muted-foreground">{vs.description}</TableCell>
                      <TableCell>{vs.businessVersion}</TableCell>
                      <TableCell>
                        <Badge variant={statusColor(vs.status) as any}>{vs.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/architectures/value-streams/${vs.id}`}>
                          <Button variant="ghost" size="sm">查看</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  共 {data.valueStreams.totalCount} 条
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    {page + 1} / {Math.ceil(data.valueStreams.totalCount / pageSize) || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(page + 1) * pageSize >= data.valueStreams.totalCount}
                    onClick={() => setPage(p => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

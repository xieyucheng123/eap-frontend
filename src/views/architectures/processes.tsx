import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const GET_PROCESSES = gql`
  query GetProcesses {
    businessProcesses {
      nodes {
        id
        name
        description
        sla
        cycleTime
        costPerTransaction
        status
      }
      paginationInfo { total }
    }
  }
`

export default function Processes() {
  const { data, loading, error } = useQuery(GET_PROCESSES)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">业务流程</h1>
        <Button><Plus className="h-4 w-4 mr-2" />新建流程</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>流程列表</CardTitle></CardHeader>
        <CardContent>
          {loading && <div className="text-center py-8 text-muted-foreground">加载中...</div>}
          {error && <div className="text-center py-8 text-destructive">加载失败</div>}
          {data && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>周期(天)</TableHead>
                  <TableHead>单次成本</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.businessProcesses.nodes.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.description}</TableCell>
                    <TableCell>{p.sla || '-'}</TableCell>
                    <TableCell>{p.cycleTime || '-'}</TableCell>
                    <TableCell>{p.costPerTransaction || '-'}</TableCell>
                    <TableCell><Badge variant="outline">{p.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

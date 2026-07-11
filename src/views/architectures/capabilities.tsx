import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const GET_CAPABILITIES = gql`
  query GetCapabilities {
    businessCapabilities {
      nodes {
        id
        name
        description
        level
        maturity
        businessValue
        status
      }
      totalCount
    }
  }
`

export default function Capabilities() {
  const { data, loading, error } = useQuery(GET_CAPABILITIES)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">业务能力</h1>
        <Button><Plus className="h-4 w-4 mr-2" />新建能力</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>能力列表</CardTitle></CardHeader>
        <CardContent>
          {loading && <div className="text-center py-8 text-muted-foreground">加载中...</div>}
          {error && <div className="text-center py-8 text-destructive">加载失败</div>}
          {data && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>层级</TableHead>
                  <TableHead>成熟度</TableHead>
                  <TableHead>业务价值</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.businessCapabilities.nodes.map((cap: any) => (
                  <TableRow key={cap.id}>
                    <TableCell className="font-medium">{cap.name}</TableCell>
                    <TableCell>{cap.level}</TableCell>
                    <TableCell>{cap.maturity}</TableCell>
                    <TableCell>{cap.businessValue}</TableCell>
                    <TableCell><Badge variant="outline">{cap.status}</Badge></TableCell>
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

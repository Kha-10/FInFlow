import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Summary({ transactions }) {
  const totalCashIn = transactions
    .filter(t => t.type === 'cash-in')
    .reduce((total, t) => total + t.totalAmount, 0)

  const totalCashOut = transactions
    .filter(t => t.type === 'cash-out')
    .reduce((total, t) => total + t.totalAmount, 0)
    console.log(transactions);

  const balance = totalCashIn - totalCashOut

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cash In</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalCashIn.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cash Out</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalCashOut.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  )
}
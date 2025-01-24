import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useContext } from "react";
import { UserSettingsContext } from "@/contexts/UserSettingsContext";

export default function Summary({ dayChartDatas, chartDatas }) {
  let { currency } = useContext(UserSettingsContext);
  let totalCashIn = 0;
  let totalCashOut = 0;

  if (dayChartDatas?.length > 0) {
    totalCashIn = dayChartDatas
      // .filter((t) => t.transactionType === "income")
      .reduce((total, t) => total + ((t.income && t.income) || 0), 0);

    totalCashOut = dayChartDatas
      // .filter((t) => t.transactionType === "outcome")
      .reduce((total, t) => total + ((t.outcome && t.outcome) || 0), 0);
  } else {
    totalCashIn = chartDatas?.reduce(
      (total, t) => total + ((t.income && t.income) || 0),
      0
    );

    totalCashOut = chartDatas?.reduce(
      (total, t) => total + ((t.outcome && t.outcome) || 0),
      0
    );
  }

  const balance = totalCashIn - totalCashOut;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-1 lg:md:grid-cols-3">
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalCashIn.toFixed(2)}</div>
        </CardContent>
      </Card> */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl text-green-500 font-bold mb-1">
                {formatCurrency(totalCashIn, currency)}
                {/* ${totalCashIn.toFixed(2)} */}
              </p>
              <p className="text-sm">Total Income</p>
            </div>
            <div className="rounded-full bg-primary-foreground p-3">
              <ArrowDownCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl text-red-500 font-bold mb-1">
                {/* ${totalCashOut.toFixed(2)} */}
                {formatCurrency(totalCashOut, currency)}
              </p>
              <p className="text-sm">Total Outcome</p>
            </div>
            <div className="rounded-full bg-primary-foreground p-3">
              <ArrowUpCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card
        className={`bg-white dark:bg-gray-800 ${
          balance == 0
            ? ""
            : balance < 0
            ? "border-red-500"
            : "border-green-500"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p
                className={`text-2xl font-bold ${
                  balance == 0
                    ? "text-primary"
                    : balance < 0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {/* ${balance.toFixed(2)} */}
                {formatCurrency(balance, currency)}
              </p>
              <p className="text-sm">Balance</p>
            </div>
            <div className="rounded-full bg-primary-foreground p-3">
              <Wallet className={`h-6 w-6 text-cyan-500`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

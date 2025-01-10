import React, { useState } from "react";
import ItemManagement from "@/components/Items/ItemManagement";
import CategoryManagement from "@/components/Categories/CategoryManagement";
import TransactionManagement from "@/components/Transactions/TransactionManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";

const AddToPurchases = () => {
  const [activeTab, setActiveTab] = useState("purchases");

  const navigate = useNavigate();

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value == "purchases") {
      navigate("/purchases", {
        replace: true,
      });
    } else {
      navigate("/purchases?sort=createdAt&sortDirection=desc", {
        replace: true,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900 text-foreground antialiased">
      {/* <Header /> */}
      <main className="flex-1 relative">
        <div className="container mx-auto space-y-6 p-4 pb-20">
          <Tabs
            value={activeTab}
            onValueChange={(value) => handleTabChange(value)}
            className="w-full"
          >
            <TabsList className="bg-white dark:bg-gray-800 grid h-10 items-center w-full grid-cols-3 rounded-lg">
              <TabsTrigger
                value="purchases"
                className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:bg-btn data-[state=active]:text-white"
              >
                Purchases
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:bg-btn data-[state=active]:text-white"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="items"
                className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:bg-btn data-[state=active]:text-white"
              >
                Items
              </TabsTrigger>
              {/* <TabsTrigger
                value="reports"
                className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:text-blue-500"
              >
                Reports
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="purchases">
              <TransactionManagement />
            </TabsContent>
            <TabsContent value="categories">
              <CategoryManagement />
            </TabsContent>
            <TabsContent value="items">
              <ItemManagement />
            </TabsContent>
            {/* <TabsContent value="reports">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Reports</h2>
                  <p>Report functionality to be implemented.</p>
                </div>
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default AddToPurchases;

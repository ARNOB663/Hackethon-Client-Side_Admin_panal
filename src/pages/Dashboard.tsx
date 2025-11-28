import { useEffect, useState } from 'react';
import { Users, Wheat, UserCheck, UserX, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { getFarmers, getCropBatches } from '@/lib/api';
import { Farmer, CropBatch } from '@/types';
import { toast } from 'sonner';

interface Stats {
  totalFarmers: number;
  activeFarmers: number;
  suspendedFarmers: number;
  totalCropBatches: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalFarmers: 0,
    activeFarmers: 0,
    suspendedFarmers: 0,
    totalCropBatches: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [farmersRes, cropsRes] = await Promise.all([
        getFarmers(),
        getCropBatches(),
      ]);

      const farmers: Farmer[] = farmersRes.data || [];
      const crops: CropBatch[] = cropsRes.data || [];

      setStats({
        totalFarmers: farmers.length,
        activeFarmers: farmers.filter((f) => !f.isSuspended).length,
        suspendedFarmers: farmers.filter((f) => f.isSuspended).length,
        totalCropBatches: crops.length,
      });
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Farmers',
      value: stats.totalFarmers,
      icon: Users,
      color: 'bg-primary',
    },
    {
      title: 'Active Farmers',
      value: stats.activeFarmers,
      icon: UserCheck,
      color: 'bg-primary',
    },
    {
      title: 'Suspended Farmers',
      value: stats.suspendedFarmers,
      icon: UserX,
      color: 'bg-destructive',
    },
    {
      title: 'Total Crop Batches',
      value: stats.totalCropBatches,
      icon: Wheat,
      color: 'bg-primary',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Overview of your farmer platform</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.title} className="border-2 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Welcome to Farmer Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Use the sidebar navigation to manage farmers and crop batches. You can view, suspend, 
              or delete farmers, and edit or delete crop batches as needed.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

import { useEffect, useState } from 'react';
import { Search, Eye, UserX, UserCheck, Trash2, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getFarmers, getFarmer, deleteFarmer, suspendFarmer, unsuspendFarmer, getCropBatchesByFarmer } from '@/lib/api';
import { Farmer, CropBatch } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [farmerCrops, setFarmerCrops] = useState<CropBatch[]>([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchFarmers();
  }, []);

  useEffect(() => {
    const filtered = farmers.filter(
      (f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFarmers(filtered);
  }, [searchQuery, farmers]);

  const fetchFarmers = async () => {
    try {
      const response = await getFarmers();
      setFarmers(response.data || []);
      setFilteredFarmers(response.data || []);
    } catch (error) {
      toast.error('Failed to load farmers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setIsViewOpen(true);
    try {
      const response = await getCropBatchesByFarmer(farmer._id);
      setFarmerCrops(response.data || []);
    } catch (error) {
      setFarmerCrops([]);
    }
  };

  const handleToggleSuspend = async (farmer: Farmer) => {
    setActionLoading(farmer._id);
    try {
      if (farmer.isSuspended) {
        await unsuspendFarmer(farmer._id);
        toast.success('Farmer unsuspended');
      } else {
        await suspendFarmer(farmer._id);
        toast.success('Farmer suspended');
      }
      fetchFarmers();
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(deleteId);
    try {
      await deleteFarmer(deleteId);
      toast.success('Farmer deleted');
      fetchFarmers();
    } catch (error) {
      toast.error('Failed to delete farmer');
    } finally {
      setActionLoading(null);
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Farmers</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage registered farmers</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="border-2 rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No farmers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFarmers.map((farmer) => (
                    <TableRow key={farmer._id}>
                      <TableCell className="font-medium">{farmer.name}</TableCell>
                      <TableCell>{farmer.email}</TableCell>
                      <TableCell>{farmer.phone}</TableCell>
                      <TableCell>{farmer.location?.district || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={farmer.isSuspended ? 'destructive' : 'default'}>
                          {farmer.isSuspended ? 'Suspended' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleView(farmer)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleSuspend(farmer)}
                            disabled={actionLoading === farmer._id}
                          >
                            {farmer.isSuspended ? (
                              <UserCheck className="w-4 h-4" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(farmer._id)}
                            disabled={actionLoading === farmer._id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* View Farmer Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">Farmer Details</DialogTitle>
            <DialogDescription>View complete farmer information</DialogDescription>
          </DialogHeader>
          {selectedFarmer && (
            <div className="space-y-6 px-1">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{selectedFarmer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium break-all">{selectedFarmer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium">{selectedFarmer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant={selectedFarmer.isSuspended ? 'destructive' : 'default'}>
                    {selectedFarmer.isSuspended ? 'Suspended' : 'Active'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">
                    {selectedFarmer.location?.upazila}, {selectedFarmer.location?.district},{' '}
                    {selectedFarmer.location?.division}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Joined</p>
                  <p className="font-medium">
                    {format(new Date(selectedFarmer.createdAt), 'PP')}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Crop Batches ({farmerCrops.length})</h4>
                {farmerCrops.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No crop batches found</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {farmerCrops.map((crop) => (
                      <div key={crop._id} className="p-3 border rounded-lg text-sm bg-muted/30">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{crop.cropType}</span>
                          <span className="font-semibold">{crop.estimatedWeightKg} kg</span>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          {crop.storageType} • {format(new Date(crop.harvestDate), 'PP')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2 border-t">
                <Button
                  variant={selectedFarmer.isSuspended ? 'default' : 'outline'}
                  onClick={() => {
                    handleToggleSuspend(selectedFarmer);
                    setIsViewOpen(false);
                  }}
                >
                  {selectedFarmer.isSuspended ? 'Unsuspend' : 'Suspend'} Farmer
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeleteId(selectedFarmer._id);
                    setIsViewOpen(false);
                  }}
                >
                  Delete Farmer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Farmer?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the farmer
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

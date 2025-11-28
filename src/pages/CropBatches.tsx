import { useEffect, useState } from 'react';
import { Search, Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCropBatches, updateCropBatch, deleteCropBatch } from '@/lib/api';
import { CropBatch } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function CropBatchesPage() {
  const [crops, setCrops] = useState<CropBatch[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<CropBatch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cropTypeFilter, setCropTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<CropBatch | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    cropType: '',
    estimatedWeightKg: 0,
    storageType: '',
    notes: '',
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    let filtered = crops;

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.farmerId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.cropType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (cropTypeFilter !== 'all') {
      filtered = filtered.filter((c) => c.cropType === cropTypeFilter);
    }

    setFilteredCrops(filtered);
  }, [searchQuery, cropTypeFilter, crops]);

  const fetchCrops = async () => {
    try {
      const response = await getCropBatches();
      setCrops(response.data || []);
      setFilteredCrops(response.data || []);
    } catch (error) {
      toast.error('Failed to load crop batches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (crop: CropBatch) => {
    setSelectedCrop(crop);
    setIsViewOpen(true);
  };

  const handleEdit = (crop: CropBatch) => {
    setSelectedCrop(crop);
    setEditForm({
      cropType: crop.cropType,
      estimatedWeightKg: crop.estimatedWeightKg,
      storageType: crop.storageType,
      notes: crop.notes || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedCrop) return;
    setActionLoading(true);
    try {
      await updateCropBatch(selectedCrop._id, editForm);
      toast.success('Crop batch updated');
      fetchCrops();
      setIsEditOpen(false);
    } catch (error) {
      toast.error('Failed to update crop batch');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await deleteCropBatch(deleteId);
      toast.success('Crop batch deleted');
      fetchCrops();
    } catch (error) {
      toast.error('Failed to delete crop batch');
    } finally {
      setActionLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Crop Batches</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage harvested crops</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={cropTypeFilter} onValueChange={setCropTypeFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Paddy">Paddy</SelectItem>
                <SelectItem value="Rice">Rice</SelectItem>
              </SelectContent>
            </Select>
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
                  <TableHead>Crop Type</TableHead>
                  <TableHead>Weight (kg)</TableHead>
                  <TableHead>Harvest Date</TableHead>
                  <TableHead>Storage Type</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCrops.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No crop batches found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCrops.map((crop) => (
                    <TableRow key={crop._id}>
                      <TableCell className="font-medium">{crop.cropType}</TableCell>
                      <TableCell>{crop.estimatedWeightKg.toLocaleString()}</TableCell>
                      <TableCell>{format(new Date(crop.harvestDate), 'PP')}</TableCell>
                      <TableCell>{crop.storageType}</TableCell>
                      <TableCell>{crop.farmerId?.name || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleView(crop)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(crop)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(crop._id)}
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

      {/* View Crop Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop Batch Details</DialogTitle>
            <DialogDescription>View crop batch information</DialogDescription>
          </DialogHeader>
          {selectedCrop && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Crop Type</p>
                  <p className="font-medium">{selectedCrop.cropType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-medium">{selectedCrop.estimatedWeightKg.toLocaleString()} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Harvest Date</p>
                  <p className="font-medium">{format(new Date(selectedCrop.harvestDate), 'PP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Storage Type</p>
                  <p className="font-medium">{selectedCrop.storageType}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Storage Location</p>
                  <p className="font-medium">
                    {selectedCrop.storageLocation?.district}, {selectedCrop.storageLocation?.division}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Farmer</p>
                  <p className="font-medium">{selectedCrop.farmerId?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCrop.farmerId?.email} • {selectedCrop.farmerId?.phone}
                  </p>
                </div>
                {selectedCrop.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{selectedCrop.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Crop Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Crop Batch</DialogTitle>
            <DialogDescription>Update crop batch information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Crop Type</Label>
              <Select
                value={editForm.cropType}
                onValueChange={(v) => setEditForm({ ...editForm, cropType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paddy">Paddy</SelectItem>
                  <SelectItem value="Rice">Rice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estimated Weight (kg)</Label>
              <Input
                type="number"
                value={editForm.estimatedWeightKg}
                onChange={(e) =>
                  setEditForm({ ...editForm, estimatedWeightKg: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Storage Type</Label>
              <Select
                value={editForm.storageType}
                onValueChange={(v) => setEditForm({ ...editForm, storageType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jute Bag Stack">Jute Bag Stack</SelectItem>
                  <SelectItem value="Silo">Silo</SelectItem>
                  <SelectItem value="Open Area">Open Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Optional notes..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Crop Batch?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the crop batch.
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

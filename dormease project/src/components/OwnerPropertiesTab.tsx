import React, { useState } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OwnerProperty } from '@/hooks/useOwnerDashboard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface OwnerPropertiesTabProps {
  properties: OwnerProperty[];
  addProperty: (property: Omit<OwnerProperty, 'id' | 'status'>) => void;
  updateProperty: (id: string, updates: Partial<OwnerProperty>) => void;
  deleteProperty: (id: string) => void;
}

const defaultProperty = {
  name: '',
  location: '',
  price: 0,
  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  description: '',
  facilities: [] as string[],
  nearby: [] as string[],
  address: '',
  ownerPhone: '',
  ownerEmail: ''
};

const MAX_PRICE = 15000;

const OwnerPropertiesTab: React.FC<OwnerPropertiesTabProps> = ({ 
  properties, 
  addProperty, 
  updateProperty, 
  deleteProperty 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({ ...defaultProperty });
  const [editingProperty, setEditingProperty] = useState<OwnerProperty | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string>('');

  const validatePrice = (price: number): boolean => {
    if (price <= 0) {
      setPriceError('Price must be greater than 0');
      return false;
    }
    if (price > MAX_PRICE) {
      setPriceError(`Price cannot exceed ₹${MAX_PRICE}`);
      return false;
    }
    setPriceError('');
    return true;
  };

  const handleAddProperty = () => {
    if (!validatePrice(newProperty.price)) {
      return;
    }

    // Convert facilities and nearby from string to array if they're strings
    const facilitiesArray = typeof newProperty.facilities === 'string' 
      ? (newProperty.facilities as unknown as string).split(',').map(item => item.trim()).filter(Boolean)
      : newProperty.facilities;
    
    const nearbyArray = typeof newProperty.nearby === 'string' 
      ? (newProperty.nearby as unknown as string).split(',').map(item => item.trim()).filter(Boolean)
      : newProperty.nearby;
    
    addProperty({
      ...newProperty,
      facilities: facilitiesArray,
      nearby: nearbyArray
    });
    setNewProperty({ ...defaultProperty });
    setIsAddDialogOpen(false);
  };

  const handleEditProperty = () => {
    if (!editingProperty) return;
    
    if (!validatePrice(editingProperty.price)) {
      return;
    }

    // Convert facilities and nearby from string to array if they're strings
    const facilitiesArray = typeof editingProperty.facilities === 'string' 
      ? (editingProperty.facilities as unknown as string).split(',').map(item => item.trim()).filter(Boolean)
      : editingProperty.facilities;
    
    const nearbyArray = typeof editingProperty.nearby === 'string' 
      ? (editingProperty.nearby as unknown as string).split(',').map(item => item.trim()).filter(Boolean)
      : editingProperty.nearby;
    
    updateProperty(editingProperty.id, {
      ...editingProperty,
      facilities: facilitiesArray,
      nearby: nearbyArray
    });
    setEditingProperty(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteProperty = () => {
    if (deletingPropertyId) {
      deleteProperty(deletingPropertyId);
      setDeletingPropertyId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (property: OwnerProperty) => {
    setEditingProperty({
      ...property,
      facilities: Array.isArray(property.facilities) 
        ? property.facilities 
        : (property.facilities as unknown as string).split(',').map(item => item.trim()),
      nearby: Array.isArray(property.nearby) 
        ? property.nearby 
        : (property.nearby as unknown as string).split(',').map(item => item.trim())
    });
    setIsEditDialogOpen(true);
    setPriceError('');
  };

  const openDeleteDialog = (id: string) => {
    setDeletingPropertyId(id);
    setIsDeleteDialogOpen(true);
  };

  // Handler for price changes with validation
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, isNewProperty: boolean) => {
    const value = Number(e.target.value);
    validatePrice(value);
    
    if (isNewProperty) {
      setNewProperty(prev => ({ ...prev, price: value }));
    } else if (editingProperty) {
      setEditingProperty(prev => prev ? { ...prev, price: value } : null);
    }
  };

  // Helper function to handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    isNewProperty: boolean,
    field: keyof typeof defaultProperty
  ) => {
    const value = e.target.value;
    
    if (isNewProperty) {
      setNewProperty(prev => ({ ...prev, [field]: value }));
    } else if (editingProperty) {
      setEditingProperty(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  // Helper function to handle facilities/nearby input changes
  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, isNewProperty: boolean, field: 'facilities' | 'nearby') => {
    const value = e.target.value;
    const valueArray = value.split(',').map(item => item.trim()).filter(Boolean);
    
    if (isNewProperty) {
      setNewProperty(prev => ({ ...prev, [field]: valueArray }));
    } else if (editingProperty) {
      setEditingProperty(prev => prev ? { ...prev, [field]: valueArray } : null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-founders mb-2">Properties</h1>
          <p className="text-muted-foreground">Manage your rental properties</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="button-ripple">
              <Plus size={16} className="mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="glassmorphic dark:glassmorphic-dark border border-white/20 sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>Add a new rental property</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newProperty.name}
                  onChange={(e) => handleInputChange(e, true, 'name')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input
                  id="location"
                  value={newProperty.location}
                  onChange={(e) => handleInputChange(e, true, 'location')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price/month</Label>
                <div className="col-span-3 relative">
                  <Input
                    id="price"
                    type="number"
                    value={newProperty.price}
                    onChange={(e) => handlePriceChange(e, true)}
                    max={MAX_PRICE}
                    className={`pl-6 ${priceError ? 'border-red-500' : ''}`}
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2">₹</span>
                  {priceError && <p className="text-xs text-red-500 mt-1">{priceError}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">Image URL</Label>
                <Input
                  id="image"
                  value={newProperty.image}
                  onChange={(e) => handleInputChange(e, true, 'image')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={newProperty.description}
                  onChange={(e) => handleInputChange(e, true, 'description')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input
                  id="address"
                  value={newProperty.address}
                  onChange={(e) => handleInputChange(e, true, 'address')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ownerPhone" className="text-right">Contact Phone</Label>
                <Input
                  id="ownerPhone"
                  value={newProperty.ownerPhone}
                  onChange={(e) => handleInputChange(e, true, 'ownerPhone')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ownerEmail" className="text-right">Contact Email</Label>
                <Input
                  id="ownerEmail"
                  value={newProperty.ownerEmail}
                  onChange={(e) => handleInputChange(e, true, 'ownerEmail')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="facilities" className="text-right">Facilities</Label>
                <Input
                  id="facilities"
                  value={Array.isArray(newProperty.facilities) ? newProperty.facilities.join(', ') : ''}
                  onChange={(e) => handleArrayInputChange(e, true, 'facilities')}
                  placeholder="Wi-Fi, Kitchen, AC (comma separated)"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nearby" className="text-right">Nearby</Label>
                <Input
                  id="nearby"
                  value={Array.isArray(newProperty.nearby) ? newProperty.nearby.join(', ') : ''}
                  onChange={(e) => handleArrayInputChange(e, true, 'nearby')}
                  placeholder="University, Bus Stop, Market (comma separated)"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProperty}>Add Property</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <div 
              key={property.id} 
              className="glassmorphic dark:glassmorphic-dark rounded-xl overflow-hidden border border-white/20 animate-fade-up"
              style={{animationDelay: `${0.1 + index * 0.1}s`}}
            >
              <div className="relative h-48">
                <img 
                  src={property.image} 
                  alt={property.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glassmorphic dark:glassmorphic-dark border border-white/20">
                      <DropdownMenuItem onClick={() => openEditDialog(property)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteDialog(property.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                    property.status === 'active' ? 'bg-green-500/30 text-green-200' : 
                    property.status === 'inactive' ? 'bg-gray-500/30 text-gray-200' : 
                    'bg-yellow-500/30 text-yellow-200'
                  }`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </div>
                  <h3 className="text-white font-semibold text-lg truncate">{property.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                  <p className="font-bold">₹{property.price}/mo</p>
                </div>
                <p className="text-sm mb-3 line-clamp-2">{property.description}</p>
                
                {property.facilities?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground mb-1">Facilities</p>
                    <div className="flex flex-wrap gap-1">
                      {property.facilities.slice(0, 3).map((facility, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-primary/10 rounded-full">{facility}</span>
                      ))}
                      {property.facilities.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">+{property.facilities.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
                
                {property.address && (
                  <p className="text-xs text-muted-foreground mt-2 truncate">
                    <span className="font-medium">Address:</span> {property.address}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glassmorphic dark:glassmorphic-dark rounded-xl p-6 border border-white/20 text-center py-12 animate-fade-up">
          <h3 className="text-xl font-semibold mb-2">No properties listed yet</h3>
          <p className="text-muted-foreground mb-6">Add your first property to start receiving bookings</p>
          <Button className="button-ripple" onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Your First Property
          </Button>
        </div>
      )}
      
      {/* Edit Property Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glassmorphic dark:glassmorphic-dark border border-white/20 sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>Update your property details</DialogDescription>
          </DialogHeader>
          {editingProperty && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editingProperty.name}
                  onChange={(e) => handleInputChange(e, false, 'name')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">Location</Label>
                <Input
                  id="edit-location"
                  value={editingProperty.location}
                  onChange={(e) => handleInputChange(e, false, 'location')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">Price/month</Label>
                <div className="col-span-3 relative">
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProperty.price}
                    onChange={(e) => handlePriceChange(e, false)}
                    max={MAX_PRICE}
                    className={`pl-6 ${priceError ? 'border-red-500' : ''}`}
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2">₹</span>
                  {priceError && <p className="text-xs text-red-500 mt-1">{priceError}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right">Image URL</Label>
                <Input
                  id="edit-image"
                  value={editingProperty.image}
                  onChange={(e) => handleInputChange(e, false, 'image')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProperty.description}
                  onChange={(e) => handleInputChange(e, false, 'description')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">Address</Label>
                <Input
                  id="edit-address"
                  value={editingProperty.address || ''}
                  onChange={(e) => handleInputChange(e, false, 'address')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-ownerPhone" className="text-right">Contact Phone</Label>
                <Input
                  id="edit-ownerPhone"
                  value={editingProperty.ownerPhone || ''}
                  onChange={(e) => handleInputChange(e, false, 'ownerPhone')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-ownerEmail" className="text-right">Contact Email</Label>
                <Input
                  id="edit-ownerEmail"
                  value={editingProperty.ownerEmail || ''}
                  onChange={(e) => handleInputChange(e, false, 'ownerEmail')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-facilities" className="text-right">Facilities</Label>
                <Input
                  id="edit-facilities"
                  value={Array.isArray(editingProperty.facilities) ? editingProperty.facilities.join(', ') : ''}
                  onChange={(e) => handleArrayInputChange(e, false, 'facilities')}
                  placeholder="Wi-Fi, Kitchen, AC (comma separated)"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nearby" className="text-right">Nearby</Label>
                <Input
                  id="edit-nearby"
                  value={Array.isArray(editingProperty.nearby) ? editingProperty.nearby.join(', ') : ''}
                  onChange={(e) => handleArrayInputChange(e, false, 'nearby')}
                  placeholder="University, Bus Stop, Market (comma separated)"
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProperty}>Update Property</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glassmorphic dark:glassmorphic-dark border border-white/20 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>This action cannot be undone</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this property? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProperty}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OwnerPropertiesTab;

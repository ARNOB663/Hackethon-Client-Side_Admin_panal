export interface Farmer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  preferredLanguage: 'bn' | 'en';
  location: {
    division: string;
    district: string;
    upazila: string;
  };
  role: string;
  isVerified: boolean;
  isLoggedIn: boolean;
  isSuspended: boolean;
  createdAt: string;
}

export interface CropBatch {
  _id: string;
  farmerId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  cropType: 'Paddy' | 'Rice';
  estimatedWeightKg: number;
  harvestDate: string;
  storageLocation: {
    division: string;
    district: string;
  };
  storageType: 'Jute Bag Stack' | 'Silo' | 'Open Area';
  notes?: string;
  createdAt: string;
}

export interface Admin {
  _id: string;
  email: string;
}

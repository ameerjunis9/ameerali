export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
}

export enum ServiceType {
  STANDARD = 'Ground',
  EXPRESS = 'Express',
  PRIORITY = 'Priority Overnight'
}

export interface PackageDetails {
  weight: number;
  weightUnit: 'lbs' | 'kg';
  dimensions: string;
  serviceType: ServiceType;
  trackingNumber: string;
  shipDate: string;
}

export interface LabelData {
  sender: Address;
  receiver: Address;
  package: PackageDetails;
}
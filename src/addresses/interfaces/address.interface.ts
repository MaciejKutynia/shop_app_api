export type AddressType = 'billing' | 'shipping' | null;

export type CreateAddressInterface = {
  address: [string, string, string];
  city: string;
  zip_code: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  vat_id?: string;
  type: AddressType;
};

export type UpdateAddressInterface = Partial<CreateAddressInterface>;

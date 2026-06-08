export type StockMovementType = 'RECEIPT' | 'SHIPMENT' | 'ADJUSTMENT' | 'TRANSFER'

export type InventoryWarehouse = {
  id: string
  name: string
  code: string
  description: string | null
  address: string | null
  isDefault: boolean
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type InventoryStockLevel = {
  id: string
  warehouseId: string
  warehouseName: string
  warehouseCode: string
  variantId: string
  sku: string
  variantName: string | null
  productId: string
  productName: string
  quantityOnHand: number
  quantityReserved: number
  quantityAvailable: number
  lowStockThreshold: number | null
  isLowStock: boolean
  updatedAt: string
}

export type InventoryMovement = {
  id: string
  warehouseId: string
  warehouseName: string
  variantId: string
  sku: string
  variantName: string | null
  productName: string
  type: StockMovementType
  quantityChange: number
  quantityBefore: number
  quantityAfter: number
  note: string | null
  performedById: string | null
  performedByName: string | null
  targetWarehouseId: string | null
  targetWarehouseName: string | null
  createdAt: string
}

export type VariantLookup = {
  id: string
  sku: string
  name: string | null
  productId: string
  productName: string
}

export type CreateWarehousePayload = {
  name: string
  code: string
  description?: string
  address?: string
  isDefault?: boolean
  isActive?: boolean
  sortOrder?: number
}

export type UpdateWarehousePayload = Partial<CreateWarehousePayload>

export type CreateStockMovementPayload = {
  warehouseId: string
  variantId: string
  type: StockMovementType
  quantity: number
  note?: string
  targetWarehouseId?: string
}

export type ListStockParams = {
  page?: number
  limit?: number
  search?: string
  warehouseId?: string
  lowStock?: string
}

export type ListMovementsParams = {
  page?: number
  limit?: number
  warehouseId?: string
  variantId?: string
}

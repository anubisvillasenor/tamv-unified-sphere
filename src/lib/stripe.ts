// TAMV Stripe Configuration - Products & Prices mapping

export const MEMBERSHIP_TIERS = {
  creador: {
    name: "Membresía Creador",
    price_id: "price_1Szl7r2c9MT9LcDv4JEYV5zI",
    product_id: "prod_TxgUzsPjNGdnkh",
    price: 9.99,
    features: ["5 DreamSpaces", "Analytics básico", "Publicar contenido", "-5% comisión"],
  },
  vip: {
    name: "Membresía VIP",
    price_id: "price_1Szl812c9MT9LcDvkBpErIzl",
    product_id: "prod_TxgVMy3rBpnrfv",
    price: 49.99,
    features: ["50 DreamSpaces", "Soporte prioritario", "Eventos exclusivos", "-15% comisión"],
  },
  elite: {
    name: "Membresía Elite",
    price_id: "price_1Szl822c9MT9LcDvFThKAgoM",
    product_id: "prod_TxgV4ZwsTQNFbO",
    price: 99.99,
    features: ["DreamSpaces ilimitados", "Isabella Archivista", "Acceso anticipado", "-20% comisión"],
  },
  celestial: {
    name: "Membresía Celestial",
    price_id: "price_1Szl842c9MT9LcDvNpSKLCAz",
    product_id: "prod_TxgVIYJ7GhbGpj",
    price: 299.99,
    features: ["Nodo guardián", "Curaduría", "Derechos simbólicos", "-25% comisión"],
  },
} as const;

export const COURSES = {
  master360: {
    name: "Master 360 Elite",
    price_id: "price_1Sr6c02c9MT9LcDvZWnFxhN0",
    product_id: "prod_Tok67BvzdqQJoj",
    price: 97.00,
    mode: "payment" as const,
  },
} as const;

export const CREDIT_PACKS = {
  pack1000: {
    name: "1000 TAMV Credits",
    price_id: "price_1Sxknl2c9MT9LcDvEQMJEPMS",
    product_id: "prod_Tvc18n4WLdd7Vj",
    price: 9.99,
  },
  pack3000: {
    name: "3000 TAMV Credits",
    price_id: "price_1Sxknm2c9MT9LcDvnTbCpe4B",
    product_id: "prod_Tvc1V4IdwP4laK",
    price: 24.99,
  },
} as const;

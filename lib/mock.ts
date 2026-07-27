export type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  icono: string;
  color: string;
  activa: boolean;
  totalProductos: number;
};

export type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  principioActivo: string;
  laboratorio: string;
  categoriaId: string;
  precio: number;
  precioOferta: number | null;
  stock: number;
  unidad: string;
  requiereReceta: boolean;
  imagen: string;
  codigo: string;
  activo: boolean;
  rating: number;
  totalReseñas: number;
  tags: string[];
};

export type Usuario = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: "admin" | "cliente" | "farmaceutico";
  estado: "activo" | "inactivo" | "suspendido";
  fechaRegistro: string;
  ultimoAcceso: string;
  avatar: string;
  direccion: {
    calle: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
    pais: string;
  };
  totalPedidos: number;
  totalGastado: number;
};

export type LineaPedido = {
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
};

export type Pedido = {
  id: string;
  numeroPedido: string;
  usuarioId: string;
  nombreUsuario: string;
  emailUsuario: string;
  estado: "pendiente" | "confirmado" | "preparando" | "enviado" | "entregado" | "cancelado";
  metodoPago: "tarjeta" | "transferencia" | "contrareembolso" | "bizum";
  estadoPago: "pendiente" | "pagado" | "reembolsado";
  lineas: LineaPedido[];
  subtotal: number;
  descuento: number;
  gastoEnvio: number;
  total: number;
  fechaPedido: string;
  fechaActualizacion: string;
  direccionEnvio: {
    calle: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
    pais: string;
  };
  notas: string;
  codigoSeguimiento: string | null;
};

export const categorias: Categoria[] = [
  {
    id: "cat-001",
    nombre: "Medicamentos",
    slug: "medicamentos",
    descripcion: "Fármacos con y sin receta médica para el tratamiento de enfermedades",
    icono: "💊",
    color: "blue",
    activa: true,
    totalProductos: 142,
  },
  {
    id: "cat-002",
    nombre: "Vitaminas y Suplementos",
    slug: "vitaminas-suplementos",
    descripcion: "Vitaminas, minerales y suplementos nutricionales para el bienestar diario",
    icono: "🌿",
    color: "green",
    activa: true,
    totalProductos: 89,
  },
  {
    id: "cat-003",
    nombre: "Dermatología",
    slug: "dermatologia",
    descripcion: "Cremas, lociones y tratamientos para el cuidado de la piel",
    icono: "🧴",
    color: "pink",
    activa: true,
    totalProductos: 67,
  },
  {
    id: "cat-004",
    nombre: "Pediatría",
    slug: "pediatria",
    descripcion: "Productos especialmente formulados para bebés y niños",
    icono: "👶",
    color: "yellow",
    activa: true,
    totalProductos: 54,
  },
  {
    id: "cat-005",
    nombre: "Óptica",
    slug: "optica",
    descripcion: "Soluciones oculares, gotas y accesorios para la visión",
    icono: "👁️",
    color: "indigo",
    activa: true,
    totalProductos: 33,
  },
  {
    id: "cat-006",
    nombre: "Higiene y Cuidado Personal",
    slug: "higiene-cuidado-personal",
    descripcion: "Productos de higiene bucal, corporal y cuidado personal",
    icono: "🪥",
    color: "teal",
    activa: true,
    totalProductos: 78,
  },
];

export const productos: Producto[] = [
  {
    id: "prod-001",
    nombre: "Paracetamol 1g Forte",
    descripcion: "Analgésico y antipirético indicado para el tratamiento del dolor leve a moderado y la fiebre. Efecto rápido en menos de 30 minutos.",
    principioActivo: "Paracetamol",
    laboratorio: "Sandoz",
    categoriaId: "cat-001",
    precio: 4.95,
    precioOferta: 3.49,
    stock: 248,
    unidad: "Caja 20 comprimidos",
    requiereReceta: false,
    imagen: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    codigo: "CN-654321",
    activo: true,
    rating: 4.8,
    totalReseñas: 312,
    tags: ["analgésico", "antipirético", "fiebre", "dolor"],
  },
  {
    id: "prod-002",
    nombre: "Ibuprofeno 600mg Efervescente",
    descripcion: "Antiinflamatorio no esteroideo (AINE) para el tratamiento del dolor, inflamación y fiebre. Formulación efervescente de absorción rápida.",
    principioActivo: "Ibuprofeno",
    laboratorio: "Bayer",
    categoriaId: "cat-001",
    precio: 6.80,
    precioOferta: null,
    stock: 185,
    unidad: "Caja 16 comprimidos efervescentes",
    requiereReceta: false,
    imagen: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop",
    codigo: "CN-789012",
    activo: true,
    rating: 4.6,
    totalReseñas: 208,
    tags: ["antiinflamatorio", "dolor", "fiebre", "AINE"],
  },
  {
    id: "prod-003",
    nombre: "Vitamina D3 + K2 2000UI",
    descripcion: "Combinación sinérgica de Vitamina D3 y K2 para la salud ósea, inmunitaria y cardiovascular. Fórmula de alta biodisponibilidad en cápsulas vegetales.",
    principioActivo: "Colecalciferol + Menaquinona-7",
    laboratorio: "Solgar",
    categoriaId: "cat-002",
    precio: 18.90,
    precioOferta: 15.99,
    stock: 92,
    unidad: "Bote 60 cápsulas",
    requiereReceta: false,
    imagen: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=300&fit=crop",
    codigo: "CN-112233",
    activo: true,
    rating: 4.9,
    totalReseñas: 547,
    tags: ["vitamina D", "vitamina K2", "huesos", "inmunidad"],
  },
  {
    id: "prod-004",
    nombre: "Hidratante Facial Hyalu-Procollagen SPF30",
    descripcion: "Crema facial intensamente hidratante con ácido hialurónico de triple peso molecular, procolágeno y protección solar SPF30. Para pieles secas y maduras.",
    principioActivo: "Ácido Hialurónico 1.5% + Procolágeno",
    laboratorio: "La Roche-Posay",
    categoriaId: "cat-003",
    precio: 24.50,
    precioOferta: 21.90,
    stock: 64,
    unidad: "Tarro 50ml",
    requiereReceta: false,
    imagen: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
    codigo: "CN-445566",
    activo: true,
    rating: 4.7,
    totalReseñas: 189,
    tags: ["hidratante", "hialurónico", "SPF30", "antiedad"],
  },
  {
    id: "prod-005",
    nombre: "Jarabe Pediátrico Tos Seca Niños",
    descripcion: "Jarabe antitusivo para niños a partir de 2 años con extracto de hiedra y miel de tomillo. Sin azúcar, sin gluten, sabor miel natural.",
    principioActivo: "Extracto seco de hiedra 35mg/5ml",
    laboratorio: "Cinfa",
    categoriaId: "cat-004",
    precio: 9.25,
    precioOferta: null,
    stock: 127,
    unidad: "Frasco 120ml con dosificador",
    requiereReceta: false,
    imagen: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=300&fit=crop",
    codigo: "CN-334455",
    activo: true,
    rating: 4.5,
    totalReseñas: 94,
    tags: ["tos", "niños", "pediátrico", "sin azúcar"],
  },
  {
    id: "prod-006",
    nombre: "Solución Micelar Ojos Sensibles",
    descripcion: "Solución oftálmica estéril con micelas purificantes para el aclaramiento y limpieza de lentes de contacto blandas. Compatible con uso diario.",
    principioActivo: "Solución isotónica + Poloxamer 407",
    laboratorio: "Alcon",
    categoriaId: "cat-005",
    precio: 13.60,
    precioOferta: 11.99,
    stock: 43,
    unidad: "Frasco 360ml",
    requiereReceta: false,
    imagen: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
    codigo: "CN-667788",
    activo: true,
    rating: 4.4,
    totalReseñas: 76,
    tags: ["lentes contacto", "ojos", "solución limpiadora"],
  },
  {
    id: "prod-007",
    nombre: "Omega-3 EPA+DHA 1000mg Premium",
    descripcion: "Ácidos grasos omega-3 de alta concentración obtenidos de aceite de pescado salvaje. Con certificación IFOS 5 estrellas y libre de metales pesados.",
    principioActivo: "EPA 600mg + DHA 400mg",
    laboratorio: "Nordic Naturals",
    categoriaId: "cat-002",
    precio: 29.99,
    precioOferta: null,
    stock: 71,
    unidad: "Bote 90 cápsulas blandas",
    requiereReceta: false,
    imagen: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop",
    codigo: "CN-998877",
    activo: true,
    rating: 4.9,
    totalReseñas: 423,
    tags: ["omega-3", "EPA", "DHA", "cardiovascular", "cerebro"],
  },
  {
    id: "prod-008",
    nombre: "Colutorio Clorhexidina 0.12% Gingivitis",
    descripcion: "Enjuague bucal antiséptico con clorhexidina al 0.12% para el tratamiento y prevención de la gingivitis. Acción antibacteriana prolongada 12 horas.",
    principioActivo: "Digluconato de Clorhexidina 0.12%",
    laboratorio: "Dentaid",
    categoriaId: "cat-006",
    precio: 7.40,
    precioOferta: 5.99,
    stock: 156,
    unidad: "Frasco 500ml",
    requiereReceta: false,
    imagen: "https://images.unsplash.com/photo-1559756780-a2a6ec7ddb3e?w=400&h=300&fit=crop",
    codigo: "CN-556677",
    activo: true,
    rating: 4.6,
    totalReseñas: 231,
    tags: ["colutorio", "gingivitis", "antiséptico", "bucal"],
  },
];

export const usuarios: Usuario[] = [
  {
    id: "usr-001",
    nombre: "Ana",
    apellido: "García Fernández",
    email: "ana.garcia@email.com",
    telefono: "+34 612 345 678",
    rol: "admin",
    estado: "activo",
    fechaRegistro: "2023-01-15T09:00:00Z",
    ultimoAcceso: "2026-07-27T08:32:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
    direccion: {
      calle: "Calle Mayor 45, 2º B",
      ciudad: "Madrid",
      provincia: "Madrid",
      codigoPostal: "28013",
      pais: "España",
    },
    totalPedidos: 0,
    totalGastado: 0,
  },
  {
    id: "usr-002",
    nombre: "Carlos",
    apellido: "Martínez López",
    email: "carlos.martinez@gmail.com",
    telefono: "+34 634 567 890",
    rol: "cliente",
    estado: "activo",
    fechaRegistro: "2024-03-22T11:15:00Z",
    ultimoAcceso: "2026-07-25T17:45:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
    direccion: {
      calle: "Avenida de la Constitución 12, 1º A",
      ciudad: "Sevilla",
      provincia: "Sevilla",
      codigoPostal: "41001",
      pais: "España",
    },
    totalPedidos: 8,
    totalGastado: 342.65,
  },
  {
    id: "usr-003",
    nombre: "Laura",
    apellido: "Sánchez Ruiz",
    email: "laura.sanchez@outlook.com",
    telefono: "+34 651 234 567",
    rol: "cliente",
    estado: "activo",
    fechaRegistro: "2024-06-10T14:30:00Z",
    ultimoAcceso: "2026-07-26T20:10:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=laura",
    direccion: {
      calle: "Passeig de Gràcia 78, 4º C",
      ciudad: "Barcelona",
      provincia: "Barcelona",
      codigoPostal: "08008",
      pais: "España",
    },
    totalPedidos: 15,
    totalGastado: 789.30,
  },
  {
    id: "usr-004",
    nombre: "Miguel",
    apellido: "Torres Vega",
    email: "miguel.torres@empresa.es",
    telefono: "+34 678 901 234",
    rol: "farmaceutico",
    estado: "activo",
    fechaRegistro: "2023-09-05T08:00:00Z",
    ultimoAcceso: "2026-07-27T07:55:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=miguel",
    direccion: {
      calle: "Gran Vía 23, 3º D",
      ciudad: "Bilbao",
      provincia: "Vizcaya",
      codigoPostal: "48001",
      pais: "España",
    },
    totalPedidos: 0,
    totalGastado: 0,
  },
  {
    id: "usr-005",
    nombre: "Sofía",
    apellido: "Jiménez Castro",
    email: "sofia.jimenez@gmail.com",
    telefono: "+34 690 123 456",
    rol: "cliente",
    estado: "activo",
    fechaRegistro: "2025-01-18T16:20:00Z",
    ultimoAcceso: "2026-07-24T12:35:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia",
    direccion: {
      calle: "Calle Larios 5, Ático",
      ciudad: "Málaga",
      provincia: "Málaga",
      codigoPostal: "29005",
      pais: "España",
    },
    totalPedidos: 4,
    totalGastado: 156.80,
  },
  {
    id: "usr-006",
    nombre: "Pablo",
    apellido: "Romero Gil",
    email: "pablo.romero@hotmail.com",
    telefono: "+34 620 987 654",
    rol: "cliente",
    estado: "inactivo",
    fechaRegistro: "2024-11-02T10:45:00Z",
    ultimoAcceso: "2026-05-15T09:20:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pablo",
    direccion: {
      calle: "Plaza del Pilar 3, 2º B",
      ciudad: "Zaragoza",
      provincia: "Zaragoza",
      codigoPostal: "50003",
      pais: "España",
    },
    totalPedidos: 2,
    totalGastado: 47.90,
  },
];

export const pedidos: Pedido[] = [
  {
    id: "ped-001",
    numeroPedido: "FST-2026-00089",
    usuarioId: "usr-003",
    nombreUsuario: "Laura Sánchez Ruiz",
    emailUsuario: "laura.sanchez@outlook.com",
    estado: "entregado",
    metodoPago: "tarjeta",
    estadoPago: "pagado",
    lineas: [
      {
        productoId: "prod-003",
        nombreProducto: "Vitamina D3 + K2 2000UI",
        cantidad: 2,
        precioUnitario: 15.99,
        subtotal: 31.98,
      },
      {
        productoId: "prod-007",
        nombreProducto: "Omega-3 EPA+DHA 1000mg Premium",
        cantidad: 1,
        precioUnitario: 29.99,
        subtotal: 29.99,
      },
    ],
    subtotal: 61.97,
    descuento: 6.20,
    gastoEnvio: 0,
    total: 55.77,
    fechaPedido: "2026-07-10T11:23:00Z",
    fechaActualizacion: "2026-07-13T15:45:00Z",
    direccionEnvio: {
      calle: "Passeig de Gràcia 78, 4º C",
      ciudad: "Barcelona",
      provincia: "Barcelona",
      codigoPostal: "08008",
      pais: "España",
    },
    notas: "Dejar en buzón si no hay nadie en casa.",
    codigoSeguimiento: "ES924731289001",
  },
  {
    id: "ped-002",
    numeroPedido: "FST-2026-00090",
    usuarioId: "usr-002",
    nombreUsuario: "Carlos Martínez López",
    emailUsuario: "carlos.martinez@gmail.com",
    estado: "enviado",
    metodoPago: "bizum",
    estadoPago: "pagado",
    lineas: [
      {
        productoId: "prod-001",
        nombreProducto: "Paracetamol 1g Forte",
        cantidad: 3,
        precioUnitario: 3.49,
        subtotal: 10.47,
      },
      {
        productoId: "prod-002",
        nombreProducto: "Ibuprofeno 600mg Efervescente",
        cantidad: 2,
        precioUnitario: 6.80,
        subtotal: 13.60,
      },
      {
        productoId: "prod-008",
        nombreProducto: "Colutorio Clorhexidina 0.12% Gingivitis",
        cantidad: 1,
        precioUnitario: 5.99,
        subtotal: 5.99,
      },
    ],
    subtotal: 30.06,
    descuento: 0,
    gastoEnvio: 3.99,
    total: 34.05,
    fechaPedido: "2026-07-20T09:15:00Z",
    fechaActualizacion: "2026-07-22T08:30:00Z",
    direccionEnvio: {
      calle: "Avenida de la Constitución 12, 1º A",
      ciudad: "Sevilla",
      provincia: "Sevilla",
      codigoPostal: "41001",
      pais: "España",
    },
    notas: "",
    codigoSeguimiento: "ES924731290002",
  },
  {
    id: "ped-003",
    numeroPedido: "FST-2026-00091",
    usuarioId: "usr-005",
    nombreUsuario: "Sofía Jiménez Castro",
    emailUsuario: "sofia.jimenez@gmail.com",
    estado: "preparando",
    metodoPago: "tarjeta",
    estadoPago: "pagado",
    lineas: [
      {
        productoId: "prod-004",
        nombreProducto: "Hidratante Facial Hyalu-Procollagen SPF30",
        cantidad: 1,
        precioUnitario: 21.90,
        subtotal: 21.90,
      },
      {
        productoId: "prod-005",
        nombreProducto: "Jarabe Pediátrico Tos Seca Niños",
        cantidad: 2,
        precioUnitario: 9.25,
        subtotal: 18.50,
      },
    ],
    subtotal: 40.40,
    descuento: 4.04,
    gastoEnvio: 0,
    total: 36.36,
    fechaPedido: "2026-07-25T16:48:00Z",
    fechaActualizacion: "2026-07-26T10:00:00Z",
    direccionEnvio: {
      calle: "Calle Larios 5, Ático",
      ciudad: "Málaga",
      provincia: "Málaga",
      codigoPostal: "29005",
      pais: "España",
    },
    notas: "Llamar antes de entregar al 690123456.",
    codigoSeguimiento: null,
  },
  {
    id: "ped-004",
    numeroPedido: "FST-2026-00092",
    usuarioId: "usr-003",
    nombreUsuario: "Laura Sánchez Ruiz",
    emailUsuario: "laura.sanchez@outlook.com",
    estado: "confirmado",
    metodoPago: "transferencia",
    estadoPago: "pagado",
    lineas: [
      {
        productoId: "prod-007",
        nombreProducto: "Omega-3 EPA+DHA 1000mg Premium",
        cantidad: 2,
        precioUnitario: 29.99,
        subtotal: 59.98,
      },
      {
        productoId: "prod-003",
        nombreProducto: "Vitamina D3 + K2 2000UI",
        cantidad: 1,
        precioUnitario: 15.99,
        subtotal: 15.99,
      },
      {
        productoId: "prod-006",
        nombreProducto: "Solución Micelar Ojos Sensibles",
        cantidad: 1,
        precioUnitario: 11.99,
        subtotal: 11.99,
      },
    ],
    subtotal: 87.96,
    descuento: 8.80,
    gastoEnvio: 0,
    total: 79.16,
    fechaPedido: "2026-07-26T13:22:00Z",
    fechaActualizacion: "2026-07-26T14:05:00Z",
    direccionEnvio: {
      calle: "Passeig de Gràcia 78, 4º C",
      ciudad: "Barcelona",
      provincia: "Barcelona",
      codigoPostal: "08008",
      pais: "España",
    },
    notas: "",
    codigoSeguimiento: null,
  },
  {
    id: "ped-005",
    numeroPedido: "FST-2026-00093",
    usuarioId: "usr-006",
    nombreUsuario: "Pablo Romero Gil",
    emailUsuario: "pablo.romero@hotmail.com",
    estado: "cancelado",
    metodoPago: "contrareembolso",
    estadoPago: "reembolsado",
    lineas: [
      {
        productoId: "prod-001",
        nombreProducto: "Paracetamol 1g Forte",
        cantidad: 4,
        precioUnitario: 3.49,
        subtotal: 13.96,
      },
    ],
    subtotal: 13.96,
    descuento: 0,
    gastoEnvio: 3.99,
    total: 17.95,
    fechaPedido: "2026-07-15T18:00:00Z",
    fechaActualizacion: "2026-07-16T09:30:00Z",
    direccionEnvio: {
      calle: "Plaza del Pilar 3, 2º B",
      ciudad: "Zaragoza",
      provincia: "Zaragoza",
      codigoPostal: "50003",
      pais: "España",
    },
    notas: "Cliente canceló por duplicidad de pedido.",
    codigoSeguimiento: null,
  },
  {
    id: "ped-006",
    numeroPedido: "FST-2026-00094",
    usuarioId: "usr-002",
    nombreUsuario: "Carlos Martínez López",
    emailUsuario: "carlos.martinez@gmail.com",
    estado: "pendiente",
    metodoPago: "tarjeta",
    estadoPago: "pendiente",
    lineas: [
      {
        productoId: "prod-004",
        nombreProducto: "Hidratante Facial Hyalu-Procollagen SPF30",
        cantidad: 2,
        precioUnitario: 21.90,
        subtotal: 43.80,
      },
      {
        productoId: "prod-008",
        nombreProducto: "Colutorio Clorhexidina 0.12% Gingivitis",
        cantidad: 2,
        precioUnitario: 5.99,
        subtotal: 11.98,
      },
    ],
    subtotal: 55.78,
    descuento: 0,
    gastoEnvio: 3.99,
    total: 59.77,
    fechaPedido: "2026-07-27T07:44:00Z",
    fechaActualizacion: "2026-07-27T07:44:00Z",
    direccionEnvio: {
      calle: "Avenida de la Constitución 12, 1º A",
      ciudad: "Sevilla",
      provincia: "Sevilla",
      codigoPostal: "41001",
      pais: "España",
    },
    notas: "",
    codigoSeguimiento: null,
  },
];
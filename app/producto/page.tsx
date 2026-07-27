"use client";
export const dynamic = "force-dynamic";
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { productos as productosMock } from '@/lib/mock'

type Producto = {
  id: number
  nombre: string
  descripcion: string
  principioActivo: string
  laboratorio: string
  categoriaId: number
  precio: number
  precioOferta: number | null
  stock: number
  unidad: string
  requiereReceta: boolean
  imagen: string
  codigo: string
  activo: boolean
  rating: number
  totalReseñas: number
  tags: string[]
}

const FORMULARIO_VACIO: Omit<Producto, 'id'> = {
  nombre: '',
  descripcion: '',
  principioActivo: '',
  laboratorio: '',
  categoriaId: 1,
  precio: 0,
  precioOferta: null,
  stock: 0,
  unidad: 'caja',
  requiereReceta: false,
  imagen: '',
  codigo: '',
  activo: true,
  rating: 0,
  totalReseñas: 0,
  tags: [],
}

const UNIDADES = ['caja', 'frasco', 'ampolla', 'sobre', 'tubo', 'blíster', 'unidad', 'gotero']

export default function ProductoPage() {
  const [productos, setProductos] = useState<Producto[]>(productosMock as Producto[])
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activos' | 'inactivos'>('todos')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [idEdicion, setIdEdicion] = useState<number | null>(null)
  const [form, setForm] = useState<Omit<Producto, 'id'>>(FORMULARIO_VACIO)
  const [tagsInput, setTagsInput] = useState('')
  const [confirmarEliminar, setConfirmarEliminar] = useState<number | null>(null)
  const [errores, setErrores] = useState<Record<string, string>>({})

  const productosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase()
    return (productos ?? []).filter((p) => {
      const coincide =
        (p.nombre ?? "").toLowerCase().includes(q) ||
        (p.codigo ?? "").toLowerCase().includes(q) ||
        (p.laboratorio ?? "").toLowerCase().includes(q) ||
        (p.principioActivo ?? "").toLowerCase().includes(q)
      const estado =
        filtroEstado === 'todos' ? true : filtroEstado === 'activos' ? p.activo : !p.activo
      return coincide && estado
    })
  }, [productos, busqueda, filtroEstado])

  const totalActivos = (productos ?? []).filter((p) => p.activo).length
  const totalInactivos = (productos ?? []).filter((p) => !p.activo).length
  const stockBajo = (productos ?? []).filter((p) => p.stock > 0 && p.stock < 10).length
  const sinStock = (productos ?? []).filter((p) => p.stock === 0).length

  const abrirCrear = () => {
    setModoEdicion(false)
    setIdEdicion(null)
    setForm(FORMULARIO_VACIO)
    setTagsInput('')
    setErrores({})
    setModalAbierto(true)
  }

  const abrirEditar = (p: Producto) => {
    setModoEdicion(true)
    setIdEdicion(p.id)
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      principioActivo: p.principioActivo,
      laboratorio: p.laboratorio,
      categoriaId: p.categoriaId,
      precio: p.precio,
      precioOferta: p.precioOferta,
      stock: p.stock,
      unidad: p.unidad,
      requiereReceta: p.requiereReceta,
      imagen: p.imagen,
      codigo: p.codigo,
      activo: p.activo,
      rating: p.rating,
      totalReseñas: p.totalReseñas,
      tags: p.tags,
    })
    setTagsInput((p.tags ?? []).join(', '))
    setErrores({})
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setIdEdicion(null)
  }

  const validar = (): boolean => {
    const e: Record<string, string> = {}
    if (!(form.nombre ?? "").trim()) e.nombre = 'El nombre es obligatorio'
    if (!(form.codigo ?? "").trim()) e.codigo = 'El código es obligatorio'
    if (!(form.laboratorio ?? "").trim()) e.laboratorio = 'El laboratorio es obligatorio'
    if (form.precio <= 0) e.precio = 'El precio debe ser mayor a 0'
    if (form.stock < 0) e.stock = 'El stock no puede ser negativo'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const guardar = () => {
    if (!validar()) return
    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (modoEdicion && idEdicion !== null) {
      setProductos((prev) =>
        (prev ?? []).map((p) => (p.id === idEdicion ? { ...form, tags: tagsArray, id: p.id } : p))
      )
    } else {
      const nuevoId = productos?.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1
      setProductos((prev) => [...prev, { ...form, tags: tagsArray, id: nuevoId }])
    }
    cerrarModal()
  }

  const eliminar = (id: number) => {
    setProductos((prev) => (prev ?? []).filter((p) => p.id !== id))
    setConfirmarEliminar(null)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else if (['precio', 'stock', 'rating', 'totalReseñas', 'categoriaId'].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: value === '' ? 0 : Number(value) }))
    } else if (name === 'precioOferta') {
      setForm((prev) => ({ ...prev, precioOferta: value === '' ? null : Number(value) }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }))
  }

  const productoAEliminar = (productos ?? []).find((p) => p.id === confirmarEliminar)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white text-base font-black">F</span>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-gray-900">Farmacia SaludTotal</p>
                <p className="text-xs text-gray-400">Panel de administración</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: '/', label: 'Dashboard' },
                { href: '/producto', label: 'Productos', active: true },
                { href: '/pedido', label: 'Pedidos' },
                { href: '/usuario', label: 'Usuarios' },
                { href: '/categoria', label: 'Categorías' },
              ].map(({ href, label, active }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Inicio
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">Gestión de Productos</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos farmacéuticos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona el catálogo completo de medicamentos y productos
            </p>
          </div>
          <button
            onClick={abrirCrear}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo producto
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: 'Total productos',
              value: productos?.length,
              icon: '📦',
              color: 'bg-blue-50 text-blue-700',
              border: 'border-blue-100',
            },
            {
              label: 'Activos',
              value: totalActivos,
              icon: '✅',
              color: 'bg-emerald-50 text-emerald-700',
              border: 'border-emerald-100',
            },
            {
              label: 'Stock bajo',
              value: stockBajo,
              icon: '⚠️',
              color: 'bg-amber-50 text-amber-700',
              border: 'border-amber-100',
            },
            {
              label: 'Sin stock',
              value: sinStock,
              icon: '🚫',
              color: 'bg-red-50 text-red-700',
              border: 'border-red-100',
            },
          ].map(({ label, value, icon, color, border }) => (
            <div
              key={label}
              className={`bg-white rounded-2xl border ${border} p-4 flex items-center gap-3 shadow-sm`}
            >
              <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                {icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre, código, laboratorio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {(['todos', 'activos', 'inactivos'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFiltroEstado(f)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                      filtroEstado === f
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    'Producto',
                    'Código',
                    'Laboratorio',
                    'Precio',
                    'Stock',
                    'Receta',
                    'Rating',
                    'Estado',
                    'Acciones',
                  ].map((col) => (
                    <th
                      key={col}
                      className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {productosFiltrados?.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-5xl">🔍</span>
                        <div>
                          <p className="font-semibold text-gray-700">Sin resultados</p>
                          <p className="text-xs text-gray-400 mt-1">
                            No hay productos que coincidan con tu búsqueda
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setBusqueda('')
                            setFiltroEstado('todos')
                          }}
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          Limpiar filtros
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (productosFiltrados ?? []).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {p.imagen ? (
                              <img
                                src={p.imagen}
                                alt={p.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            ) : (
                              <span className="text-base">💊</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 leading-tight truncate max-w-[180px]">
                              {p.nombre}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">
                              {p.principioActivo}
                            </p>
                            {p.tags?.length > 0 && (
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {p.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {p.tags?.length > 2 && (
                                  <span className="text-[10px] text-gray-400">
                                    +{p.tags?.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                          {p.codigo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                        {p.laboratorio}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {p.precioOferta != null && p.precioOferta > 0 ? (
                          <div>
                            <p className="font-bold text-emerald-700">
                              S/ {(p.precioOferta ?? 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              S/ {(p.precio ?? 0).toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-bold text-gray-900">S/ {(p.precio ?? 0).toFixed(2)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                            p.stock === 0
                              ? 'bg-red-100 text-red-700'
                              : p.stock < 10
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {p.stock === 0 && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {p.stock} {p.unidad}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.requiereReceta ? (
                          <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                            Sí
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400 text-sm">★</span>
                          <span className="text-xs font-bold text-gray-800">
                            {(p.rating ?? 0).toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-400">({p.totalReseñas})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            p.activo
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.activo ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}
                          />
                          {p.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => abrirEditar(p)}
                            title="Editar"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setConfirmarEliminar(p.id)}
                            title="Eliminar"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Mostrando{' '}
              <span className="font-semibold text-gray-700">{productosFiltrados?.length}</span> de{' '}
              <span className="font-semibold text-gray-700">{productos?.length}</span> productos
            </p>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString('es-PE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={cerrarModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {modoEdicion ? 'Editar producto' : 'Nuevo producto'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {modoEdicion
                    ? 'Modifica los campos y guarda los cambios'
                    : 'Completa el formulario para agregar el producto al catálogo'}
                </p>
              </div>
              <button
                onClick={cerrarModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
              <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-emerald-500 text-white rounded text-[10px] flex items-center justify-center font-bold">
                    1
                  </span>
                  Información básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Nombre del producto <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ej: Paracetamol 500mg Tabletas"
                      className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                        errores.nombre ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errores.nombre && (
                      <p className="text-xs text-red-500 mt-1">{errores.nombre}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Código <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="codigo"
                      value={form.codigo}
                      onChange={handleChange}
                      placeholder="Ej: PAR-500-TAB"
                      className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                        errores.codigo ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errores.codigo && (
                      <p className="text-xs text-red-500 mt-1">{errores.codigo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Laboratorio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="laboratorio"
                      value={form.laboratorio}
                      onChange={handleChange}
                      placeholder="Ej: Genfar, Bayer, Abbott"
                      className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                        errores.laboratorio ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errores.laboratorio && (
                      <p className="text-xs text-red-500 mt-1">{errores.laboratorio}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Principio activo
                    </label>
                    <input
                      type="text"
                      name="principioActivo"
                      value={form.principioActivo}
                      onChange={handleChange}
                      placeholder="Ej: Paracetamol"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Unidad de presentación
                    </label>
                    <select
                      name="unidad"
                      value={form.unidad}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                    >
                      {(UNIDADES ?? []).map((u) => (
                        <option key={u} value={u}>
                          {u.charAt(0).toUpperCase() + u.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Descripción detallada del producto, indicaciones, modo de uso..."
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      URL de imagen
                    </label>
                    <input
                      type="url"
                      name="imagen"
                      value={form.imagen}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-emerald-500 text-white rounded text-[10px] flex items-center justify-center font-bold">
                    2
                  </span>
                  Precios y stock
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Precio regular (S/) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                        S/
                      </span>
                      <input
                        type="number"
                        name="precio"
                        value={form.precio}
                        onChange={handleChange}
                        min={0}
                        step={0.01}
                        className={`w-full pl-8 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                          errores.precio ? 'border-red-400 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errores.precio && (
                      <p className="text-xs text-red-500 mt-1">{errores.precio}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Precio oferta (S/)
                      <span className="ml-1 text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                        S/
                      </span>
                      <input
                        type="number"
                        name="precioOferta"
                        value={form.precioOferta ?? ''}
                        onChange={handleChange}
                        min={0}
                        step={0.01}
                        placeholder="—"
                        className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Stock disponible <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      min={0}
                      className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                        errores.stock ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errores.stock && (
                      <p className="text-xs text-red-500 mt-1">{errores.stock}</p>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-emerald-500 text-white rounded text-[10px] flex items-center justify-center font-bold">
                    3
                  </span>
                  Clasificación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Categoría ID
                    </label>
                    <input
                      type="number"
                      name="categoriaId"
                      value={form.categoriaId}
                      onChange={handleChange}
                      min={1}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Tags
                      <span className="ml-1 text-gray-400 font-normal">(separados por coma)</span>
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Ej: analgésico, adultos, sin receta"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {tagsInput && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tagsInput
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-emerald-500 text-white rounded text-[10px] flex items-center justify-center font-bold">
                    4
                  </span>
                  Configuración
                </h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors group">
                    <input
                      type="checkbox"
                      name="requiereReceta"
                      checked={form.requiereReceta}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">
                        Requiere receta médica
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        El cliente deberá adjuntar una receta válida para comprar este medicamento
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors group">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={form.activo}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">
                        Producto activo
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        El producto será visible y disponible para compra en la tienda online
                      </p>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex-shrink-0">
              <p className="text-xs text-gray-400">
                <span className="text-red-500">*</span> Campos obligatorios
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cerrarModal}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardar}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modoEdicion ? 'Guardar cambios' : 'Crear producto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmarEliminar !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmarEliminar(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Eliminar producto</h3>
                <p className="text-xs text-gray-500 mt-0.5">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 mb-5">
              <p className="text-sm text-gray-700">
                Estás a punto de eliminar permanentemente{' '}
                <strong className="text-gray-900 font-bold">{productoAEliminar?.nombre}</strong>
                {productoAEliminar?.codigo && (
                  <span className="text-gray-500"> ({productoAEliminar.codigo})</span>
                )}
                .
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmarEliminar(null)}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminar(confirmarEliminar)}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
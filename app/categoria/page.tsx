"use client";
export const dynamic = "force-dynamic";
import { useState } from 'react'
import Link from 'next/link'
import { categorias as categoriasIniciales } from '@/lib/mock'

interface Categoria {
  id: number
  nombre: string
  slug: string
  descripcion: string
  icono: string
  color: string
  activa: boolean
  totalProductos: number
}

type FormData = Omit<Categoria, 'id'>

const FORM_VACIO: FormData = {
  nombre: '',
  slug: '',
  descripcion: '',
  icono: '💊',
  color: '#3B82F6',
  activa: true,
  totalProductos: 0,
}

function generarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasIniciales)
  const [form, setForm] = useState<FormData>(FORM_VACIO)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [confirmEliminar, setConfirmEliminar] = useState<number | null>(null)

  const categoriasFiltradas = (categorias ?? []).filter((c) => {
    const q = busqueda.toLowerCase()
    return (
      (c.nombre ?? "").toLowerCase().includes(q) ||
      (c.slug ?? "").toLowerCase().includes(q) ||
      (c.descripcion ?? "").toLowerCase().includes(q)
    )
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target
    const { name, value, type } = target
    if (type === 'checkbox') {
      const checked = (target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else if (name === 'nombre') {
      setForm((prev) => ({ ...prev, nombre: value, slug: generarSlug(value) }))
    } else if (name === 'totalProductos') {
      setForm((prev) => ({ ...prev, totalProductos: Math.max(0, Number(value)) }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editandoId !== null) {
      setCategorias((prev) =>
        (prev ?? []).map((c) => (c.id === editandoId ? { id: c.id, ...form } : c))
      )
    } else {
      const nueva: Categoria = { id: Date.now(), ...form }
      setCategorias((prev) => [nueva, ...prev])
    }
    cerrarModal()
  }

  function handleEditar(cat: Categoria) {
    setForm({
      nombre: cat.nombre,
      slug: cat.slug,
      descripcion: cat.descripcion,
      icono: cat.icono,
      color: cat.color,
      activa: cat.activa,
      totalProductos: cat.totalProductos,
    })
    setEditandoId(cat.id)
    setMostrarModal(true)
  }

  function handleNueva() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setMostrarModal(true)
  }

  function handleEliminar(id: number) {
    setCategorias((prev) => (prev ?? []).filter((c) => c.id !== id))
    setConfirmEliminar(null)
  }

  function cerrarModal() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setMostrarModal(false)
  }

  const totalActivas = (categorias ?? []).filter((c) => c.activa).length
  const totalInactivas = categorias?.length - totalActivas
  const totalProductos = (categorias ?? []).reduce((acc, c) => acc + c.totalProductos, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </Link>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              <h1 className="text-lg font-bold text-gray-800">Gestión de Categorías</h1>
              <span className="ml-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                Farmacia SaludTotal
              </span>
            </div>
          </div>
          <button
            onClick={handleNueva}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Categoría
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total categorías', valor: categorias?.length, color: 'text-gray-800', bg: 'bg-white', icono: '📂' },
            { label: 'Activas', valor: totalActivas, color: 'text-green-600', bg: 'bg-white', icono: '✅' },
            { label: 'Inactivas', valor: totalInactivas, color: 'text-red-500', bg: 'bg-white', icono: '🚫' },
            { label: 'Total productos', valor: totalProductos, color: 'text-blue-600', bg: 'bg-white', icono: '💊' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4`}
            >
              <div className="text-3xl">{stat.icono}</div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-0.5`}>{stat.valor}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-800 text-base">
              Listado de categorías
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({categoriasFiltradas?.length} de {categorias?.length})
              </span>
            </h2>
            <div className="relative w-full sm:w-72">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar categoría..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5 text-left">Categoría</th>
                  <th className="px-6 py-3.5 text-left">Slug</th>
                  <th className="px-6 py-3.5 text-left hidden md:table-cell">Descripción</th>
                  <th className="px-6 py-3.5 text-center">Productos</th>
                  <th className="px-6 py-3.5 text-center">Color</th>
                  <th className="px-6 py-3.5 text-center">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categoriasFiltradas?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <span className="text-5xl">🔍</span>
                        <p className="font-medium">No se encontraron categorías</p>
                        <p className="text-xs">Intenta con otro término de búsqueda</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (categoriasFiltradas ?? []).map((cat) => (
                    <tr key={cat.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm border"
                            style={{
                              backgroundColor: cat.color + '18',
                              borderColor: cat.color + '40',
                            }}
                          >
                            {cat.icono}
                          </div>
                          <span className="font-semibold text-gray-800">{cat.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-mono">
                          {cat.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-gray-500 line-clamp-1 max-w-xs block" title={cat.descripcion}>
                          {cat.descripcion}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold"
                          style={{ backgroundColor: cat.color + '20', color: cat.color }}
                        >
                          {cat.totalProductos}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-md shadow-inner border border-white/50"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-xs text-gray-400 font-mono hidden lg:inline">
                            {cat.color}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {cat.activa ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Activa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Inactiva
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditar(cat)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 transition-colors"
                          >
                            Editar
                          </button>
                          {confirmEliminar === cat.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEliminar(cat.id)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => setConfirmEliminar(null)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmEliminar(cat.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Mostrando <span className="font-semibold text-gray-600">{categoriasFiltradas?.length}</span> de{' '}
              <span className="font-semibold text-gray-600">{categorias?.length}</span> categorías
            </p>
            <p className="text-xs text-gray-400">Farmacia SaludTotal · Panel Administrativo</p>
          </div>
        </div>
      </main>

      {/* Modal Formulario */}
      {mostrarModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrarModal()
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-lg">🏷️</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-base">
                    {editandoId !== null ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {editandoId !== null ? 'Modifica los datos de la categoría' : 'Completa el formulario para crear'}
                  </p>
                </div>
              </div>
              <button
                onClick={cerrarModal}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  maxLength={60}
                  placeholder="Ej. Medicamentos de venta libre"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Slug <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs font-normal text-gray-400">(generado automáticamente)</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="px-3 py-2.5 text-gray-400 text-sm border-r border-gray-200">/categoria/</span>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    required
                    placeholder="medicamentos-venta-libre"
                    className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none font-mono text-gray-700"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  maxLength={200}
                  placeholder="Descripción breve de los productos que incluye esta categoría"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none transition"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{form.descripcion?.length}/200</p>
              </div>

              {/* Ícono y Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ícono (emoji)</label>
                  <input
                    name="icono"
                    value={form.icono}
                    onChange={handleChange}
                    maxLength={4}
                    placeholder="💊"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-2xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Color de categoría</label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50">
                    <input
                      type="color"
                      name="color"
                      value={form.color}
                      onChange={handleChange}
                      className="w-8 h-8 rounded-lg cursor-pointer border-none outline-none bg-transparent"
                    />
                    <span className="text-sm font-mono text-gray-600">{form.color}</span>
                  </div>
                </div>
              </div>

              {/* Total Productos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total de productos</label>
                <input
                  type="number"
                  name="totalProductos"
                  value={form.totalProductos}
                  onChange={handleChange}
                  min={0}
                  max={9999}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition"
                />
              </div>

              {/* Activa */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Categoría activa</p>
                  <p className="text-xs text-gray-400 mt-0.5">Visible para los usuarios en la tienda</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="activa"
                    checked={form.activa}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>

              {/* Preview */}
              {form.nombre && (
                <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Preview</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ backgroundColor: form.color + '22', border: `2px solid ${form.color}55` }}
                    >
                      {form.icono || '❓'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{form.nombre}</p>
                      <p className="text-xs text-gray-500 font-mono">/categoria/{form.slug}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: form.color + '20', color: form.color }}
                        >
                          {form.totalProductos} productos
                        </span>
                        {form.activa ? (
                          <span className="text-xs text-green-600 font-medium">● Activa</span>
                        ) : (
                          <span className="text-xs text-red-500 font-medium">● Inactiva</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-sm transition-all"
                >
                  {editandoId !== null ? '💾 Guardar cambios' : '✅ Crear categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
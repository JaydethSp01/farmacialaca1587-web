"use client";
export const dynamic = "force-dynamic";
import { Hero } from "@/components/ui/Hero";
import { POSBoard } from "@/components/ui/POSBoard";
import { useState } from 'react'
import Link from 'next/link'
import { productos, pedidos, usuarios, categorias } from '@/lib/mock'

const ESTADO_BADGE: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  procesando: 'bg-blue-100 text-blue-800 border border-blue-200',
  enviado: 'bg-purple-100 text-purple-800 border border-purple-200',
  entregado: 'bg-green-100 text-green-800 border border-green-200',
  cancelado: 'bg-red-100 text-red-800 border border-red-200',
}

const PAGO_BADGE: Record<string, string> = {
  pagado: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  pendiente: 'bg-amber-100 text-amber-800 border border-amber-200',
  fallido: 'bg-red-100 text-red-800 border border-red-200',
  reembolsado: 'bg-gray-100 text-gray-700 border border-gray-200',
}

const ROL_BADGE: Record<string, string> = {
  admin: 'bg-violet-100 text-violet-800',
  farmaceutico: 'bg-sky-100 text-sky-800',
  cliente: 'bg-gray-100 text-gray-700',
}

export default function DashboardPage() {
  const [tabActiva, setTabActiva] = useState<'pedidos' | 'productos'>('pedidos')

  const totalProductosActivos = (productos ?? []).filter((p) => p.activo).length
  const totalPedidos = pedidos?.length
  const totalUsuarios = usuarios?.length
  const ingresoTotal = (pedidos ?? []).reduce((acc, p) => acc + p.total, 0)
  const subtotalTotal = (pedidos ?? []).reduce((acc, p) => acc + p.subtotal, 0)
  const descuentoTotal = (pedidos ?? []).reduce((acc, p) => acc + p.descuento, 0)
  const envioTotal = (pedidos ?? []).reduce((acc, p) => acc + p.gastoEnvio, 0)
  const pedidosPendientes = (pedidos ?? []).filter(
    (p) => p.estado === 'pendiente' || p.estado === 'procesando'
  ).length
  const stockBajo = (productos ?? []).filter((p) => p.stock < 20 && p.activo).length
  const usuariosActivos = (usuarios ?? []).filter((u) => u.estado === 'activo').length
  const categoriasActivas = (categorias ?? []).filter((c) => c.activa).length

  const pedidosRecientes = [...pedidos]
    .sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime())
    .slice(0, 6)

  const topProductos = [...productos]
    .sort((a, b) => b.totalReseñas - a.totalReseñas)
    .slice(0, 6)

  const alertasStock = (productos ?? []).filter((p) => p.stock < 20 && p.activo).slice(0, 5)

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)

  const fmtFecha = (s: string) =>
    new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(s))

  return (
    <div className="min-h-screen bg-slate-50">
      <Hero title="Panel de Control" subtitle="Resumen de tu operación de un vistazo." />
      <div className="mt-2"><h2 className="mb-3 text-lg font-semibold text-slate-900">Vista rápida</h2><POSBoard /></div>
      {/* ── Navbar ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* ── Page Title ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Control</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <Link
            href="/pedidos/nuevo"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo pedido
          </Link>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card Ingresos */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +12.5%
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ingresos Totales</p>
            <p className="text-2xl font-bold text-slate-900">{fmt(ingresoTotal)}</p>
            <p className="text-xs text-slate-400 mt-1.5">
              {totalPedidos} pedidos completados
            </p>
          </div>

          {/* Card Pedidos */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +8.3%
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Pedidos</p>
            <p className="text-2xl font-bold text-slate-900">{totalPedidos}</p>
            <p className="text-xs text-slate-400 mt-1.5">
              <span className="text-amber-600 font-semibold">{pedidosPendientes}</span> pendientes de gestión
            </p>
          </div>

          {/* Card Productos */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              {stockBajo > 0 ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                  </svg>
                  {stockBajo} alertas
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                  OK
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Productos Activos</p>
            <p className="text-2xl font-bold text-slate-900">{totalProductosActivos}</p>
            <p className="text-xs text-slate-400 mt-1.5">
              {categoriasActivas} categorías activas
            </p>
          </div>

          {/* Card Usuarios */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +5.1%
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Usuarios</p>
            <p className="text-2xl font-bold text-slate-900">{totalUsuarios}</p>
            <p className="text-xs text-slate-400 mt-1.5">
              <span className="text-emerald-600 font-semibold">{usuariosActivos}</span> activos hoy
            </p>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: tabla principal */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Tab header */}
            <div className="flex items-center justify-between px-6 pt-5 border-b border-slate-100">
              <div className="flex gap-0.5">
                <button
                  onClick={() => setTabActiva('pedidos')}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
                    tabActiva === 'pedidos'
                      ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pedidos recientes
                </button>
                <button
                  onClick={() => setTabActiva('productos')}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
                    tabActiva === 'productos'
                      ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Top productos
                </button>
              </div>
              <Link
                href={tabActiva === 'pedidos' ? '/pedidos' : '/productos'}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold mb-2.5 flex items-center gap-1"
              >
                Ver todos
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Tabla pedidos */}
            {tabActiva === 'pedidos' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/70">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Pedido
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Pago
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(pedidosRecientes ?? []).map((pedido) => (
                      <tr key={pedido.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3.5">
                          <Link
                            href={`/pedidos/${pedido.id}`}
                            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 font-mono"
                          >
                            {pedido.numeroPedido}
                          </Link>
                        </td>
                        <td className="px-6 py-3.5">
                          <p className="text-sm font-medium text-slate-800 leading-none">
                            {pedido.nombreUsuario}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{pedido.emailUsuario}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                              ESTADO_BADGE[pedido.estado] ?? 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {pedido.estado}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                              PAGO_BADGE[pedido.estadoPago] ?? 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {pedido.estadoPago}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <span className="text-sm font-bold text-slate-900">{fmt(pedido.total)}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-sm text-slate-500">{fmtFecha(pedido.fechaPedido)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tabla productos */}
            {tabActiva === 'productos' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/70">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Laboratorio
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(topProductos ?? []).map((producto) => (
                      <tr key={producto.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3.5">
                          <Link
                            href={`/productos/${producto.id}`}
                            className="text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors leading-none"
                          >
                            {producto.nombre}
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5 font-mono">{producto.codigo}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-sm text-slate-600">{producto.laboratorio}</span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          {producto.precioOferta ? (
                            <div>
                              <p className="text-sm font-bold text-emerald-600">
                                {fmt(producto.precioOferta)}
                              </p>
                              <p className="text-xs text-slate-400 line-through">
                                {fmt(producto.precio)}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-slate-900">
                              {fmt(producto.precio)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <span
                            className={`text-sm font-semibold ${
                              producto.stock < 20 ? 'text-red-600' : 'text-slate-800'
                            }`}
                          >
                            {producto.stock}
                            <span className="text-xs font-normal text-slate-400 ml-1">
                              {producto.unidad}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <svg
                              className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-sm font-semibold text-slate-700">
                              {producto.rating}
                            </span>
                            <span className="text-xs text-slate-400">
                              ({producto.totalReseñas})
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Alertas de stock */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Alertas de Stock</h3>
                {stockBajo > 0 && (
                  <span className="text-xs font-semibold bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
                    {stockBajo} críticos
                  </span>
                )}
              </div>
              {alertasStock?.length === 0 ? (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium">Todo el stock en niveles óptimos</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {(alertasStock ?? []).map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{p.nombre}</p>
                        <p className="text-xs text-slate-400">{p.laboratorio}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs font-bold text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                        {p.stock} {p.unidad}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Categorías */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Categorías</h3>
                <Link
                  href="/categorias"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Ver todas
                </Link>
              </div>
              <div className="space-y-1.5">
                {categorias
                  .filter((c) => c.activa)
                  .slice(0, 6)
                  .map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categorias/${cat.slug}`}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                          style={{ backgroundColor: cat.color + '22' }}
                        >
                          {cat.icono}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{cat.nombre}</p>
                          <p className="text-xs text-slate-400">{cat.totalProductos} productos</p>
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Resumen Financiero */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-5 text-white shadow-lg shadow-emerald-200">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-sm font-bold text-emerald-50">Resumen Financiero</h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-emerald-200">Subtotal bruto</span>
                  <span className="text-sm font-semibold">{fmt(subtotalTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-emerald-200">Descuentos</span>
                  <span className="text-sm font-semibold text-red-300">−{fmt(descuentoTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-emerald-200">Gastos de envío</span>
                  <span className="text-sm font-semibold">+{fmt(envioTotal)}</span>
                </div>
                <div className="border-t border-emerald-500 pt-2.5 mt-1 flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Total neto</span>
                  <span className="text-xl font-extrabold text-white">{fmt(ingresoTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Usuarios Recientes ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Usuarios recientes</h3>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                {totalUsuarios}
              </span>
            </div>
            <Link
              href="/usuarios"
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              Ver todos
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Pedidos
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total gastado
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Último acceso
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(usuarios ?? []).map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {usuario.avatar ? (
                            <img
                              src={usuario.avatar}
                              alt={`${usuario.nombre} ${usuario.apellido}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-emerald-700 font-bold text-xs">
                              {usuario.nombre[0]}
                              {usuario.apellido[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/usuarios/${usuario.id}`}
                            className="text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors leading-none"
                          >
                            {usuario.nombre} {usuario.apellido}
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5">{usuario.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                          ROL_BADGE[usuario.rol] ?? 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            usuario.estado === 'activo' ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                        <span className="text-xs font-medium text-slate-600 capitalize">
                          {usuario.estado}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-slate-600">{usuario.telefono}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-sm font-bold text-slate-900">{usuario.totalPedidos}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-sm font-bold text-slate-900">
                        {fmt(usuario.totalGastado)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-slate-500">{fmtFecha(usuario.ultimoAcceso)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="text-xs text-slate-500">
              Farmacia SaludTotal © {new Date().getFullYear()} · Sistema de Gestión v1.0
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/soporte" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Soporte
            </Link>
            <Link href="/privacidad" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
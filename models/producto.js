module.exports = class Producto {
  constructor(
    nombre = "",
    cantidad = 0,
    costo_unitario = 0,
    costo_total = 0,
    id = 0
  ) {
    this.nombre_producto = nombre;
    this.cantidad_producto = cantidad;
    this.costo_unitario_producto = costo_unitario;
    this.costo_total_producto = costo_total;
    this.id_producto = id;
  }

  compraCantidad(cantidad) {
    this.cantidad_producto += cantidad;
  }

  compraTotal(total) {
    this.costo_total_producto += total;
  }

  compraUnitaria() {
    this.costo_unitario_producto = Number(
      (this.costo_total_producto / this.cantidad_producto).toFixed(2)
    );
  }

  ventaCantidad(cantidad) {
    this.cantidad_producto -= cantidad;
  }

  ventaUnitaria() {
    this.costo_unitario_producto = Number(
      (this.costo_total_producto / this.cantidad_producto).toFixed(2)
    );
  }

  ventaTotal(total) {
    this.costo_total_producto -= total;
  }

  set setId(id) {
    this.id_producto = id;
  }

  set setCantidad(cantidad) {
    this.cantidad_producto = cantidad;
  }

  set setCostoUnitario(costo_unitario) {
    this.costo_unitario_producto = costo_unitario;
  }

  set setCostoTotal(costo_total) {
    this.costo_total_producto = costo_total;
  }

  set setNombre(nombre) {
    this.nombre_producto = nombre;
  }

  get getId() {
    return this.id_producto;
  }

  get getCantidad() {
    return this.cantidad_producto;
  }

  get getCostoUnitario() {
    return this.costo_unitario_producto;
  }

  get getCostoTotal() {
    return this.costo_total_producto;
  }

  get getNombre() {
    return this.nombre_producto;
  }
};

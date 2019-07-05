module.exports = class Kardex {
  constructor(detalle, producto) {
    //this.fecha = `(SELECT CURDATE())`;
    //this.hora = `(SELECT SUBTIME(CURTIME(), "5:0:0"))`;
    this.id_detalle = detalle.id_detalle;
    this.id_producto = producto.id_producto;
    this.producto_cantidad = producto.cantidad_producto;
    this.producto_unitario = producto.costo_unitario_producto;
    this.producto_total = producto.costo_total_producto;
  }

  set setEntradaCantidad(cantidad) {
    this.entrada_cantidad = Number(cantidad);
  }

  set setEntradaUnitario(unitario) {
    this.entrada_unitario = Number(unitario);
  }

  set setEntradaTotal(total) {
    this.entrada_total = Number(total);
  }

  set setSalidaCantidad(cantidad) {
    this.salida_cantidad = Number(cantidad);
  }

  set setSalidaUnitario(unitario) {
    this.salida_unitario = Number(unitario);
  }

  set setSalidaTotal(total) {
    this.salida_total = Number(total);
  }
};

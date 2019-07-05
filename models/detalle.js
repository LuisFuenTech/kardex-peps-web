module.exports = class Detalle {
  constructor(id = "", nombre) {
    this.id_detalle = id;
    this.nombre_detalle = nombre;
  }

  set setId(id) {
    this.id_detalle = id;
  }

  set setNombre(nombre) {
    this.nombre_detalle = nombre;
  }

  get getId() {
    return this.id_detalle;
  }

  get getNombre() {
    return this.nombre_detalle;
  }
};

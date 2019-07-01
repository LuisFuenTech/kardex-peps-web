module.exports = class Detalle {
  constructor(id = "", nombre) {
    this.id = id;
    this.nombre = nombre;
  }

  set setId(id) {
    this.id = id;
  }

  set setNombre(nombre) {
    this.nombre = nombre;
  }

  get getId() {
    return this.id;
  }

  get getNombre() {
    return this.nombre;
  }
};

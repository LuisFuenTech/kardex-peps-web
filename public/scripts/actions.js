var socket = io();

try {
  document.getElementById("articulo").addEventListener("change", handleSelect);
} catch (error) {}

try {
  document
    .getElementById("articulo_peps")
    .addEventListener("change", handleSelectPeps);
} catch (error) {}

try {
  document
    .getElementById("cancelar-accion")
    .addEventListener("click", handleCancelarAccion);
} catch (error) {}

try {
  document
    .getElementById("cancelar-articulo")
    .addEventListener("click", handleCancelarArticulo);
} catch (error) {}

function handleCancelarAccion(event) {
  document.getElementById("costo_unitario").value = "";
  document.getElementById("costo_total").value = "";
  document.getElementById("cantidad").value = "";
}

function handleCancelarArticulo(event) {
  document.getElementById("costo_unitario").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("nombre").value = "";
}
// socket.on("server:costo", data => {
//   console.log("Costo:", data);
// });

// socket.on("server:msg", msg => {
//   console.log("Message:", msg);
// });

(function() {
  socket.on("server:products", products => {
    document.getElementById("product-table").innerHTML = products;
  });

  socket.on("server:kardex", ({ table, nombreArticulo }) => {
    try {
      const articulo = document.getElementById("articulo").value;
      articulo == nombreArticulo
        ? (document.getElementById("kardex-table").innerHTML = table)
        : null;
    } catch (error) {}
  });

  document.getElementById("year").innerHTML = new Date().getFullYear();

  const { href } = document.location;
  try {
    let [arr] = href.match(/kardex\/.*/g);
    const nombreArticulo = arr.split("/")[1] || "Artículo";
    showKardex(nombreArticulo);
  } catch (error) {}

  try {
    let [arr] = href.match(/peps\/peps\/.*/g);
    const nombreArticulo = arr.split("/")[2] || "Artículo";
    showPeps(nombreArticulo);
  } catch (error) {}
})();

function valorTotal() {
  const cantidad = Number(document.getElementById("cantidad").value);
  const costo_unitario = Number(
    document.getElementById("costo_unitario").value
  );
  const costo_total = document.getElementById("costo_total");

  //socket.emit("client:costo", { costo: costo_unitario, me: "Luis" });

  if (isNaN(cantidad) | isNaN(costo_unitario) | !cantidad | !costo_unitario) {
    costo_total.value = "";
  } else {
    costo_total.value = Number(
      Number(cantidad) * Number(costo_unitario)
    ).toFixed(2);
  }
}

async function handleAction() {
  const accion = document.getElementById("venta_check").checked;
  const articulo = document.getElementById("articulo");
  const costo_unitario = document.getElementById("costo_unitario");

  if (accion) {
    costo_unitario.setAttribute("readonly", "");

    if (articulo.selectedIndex > 0) {
      let { data } = await axios.get(`/get-product/${articulo.value}`);
      costo_unitario.value = data.costo_unitario_producto;
    }
  } else {
    costo_unitario.value = "";
    costo_unitario.removeAttribute("readonly");
  }
}

async function handleActionPeps() {
  const accion = document.getElementById("venta_check").checked;
  const articulo = document.getElementById("articulo_peps");
  const costo_unitario = document.getElementById("costo_unitario");

  if (accion) {
    costo_unitario.setAttribute("readonly", "");

    if (articulo.selectedIndex > 0) {
      let { data } = await axios.get(`/peps/get-product/${articulo.value}`);
      costo_unitario.value = data.costo_unitario_producto;
    }
  } else {
    costo_unitario.value = "";
    costo_unitario.removeAttribute("readonly");
  }
}

async function showKardex(nombreArticulo) {
  let { data } = await axios.get(`/show/${nombreArticulo}`);

  let table = "";

  data.forEach(item => {
    table += `
    <tr>
      <th>${item.fecha}</th>
      <td>${item.nombre_detalle}</td>
      <td>${Boolean(item.entrada_cantidad) ? item.entrada_cantidad : ""}</td>
      <td>${
        Boolean(item.entrada_unitario) ? "$" + item.entrada_unitario : ""
      }</td>
      <td>${Boolean(item.entrada_total) ? "$" + item.entrada_total : ""}</td>

      <td>${Boolean(item.salida_cantidad) ? item.salida_cantidad : ""}</td>
      <td>${
        Boolean(item.salida_unitario) ? "$" + item.salida_unitario : ""
      }</td>
      <td>${Boolean(item.salida_total) ? "$" + item.salida_total : ""}</td>

      <td>${Boolean(item.producto_cantidad) ? item.producto_cantidad : ""}</td>
      <td>${
        Boolean(item.producto_unitario) ? "$" + item.producto_unitario : ""
      }</td>
      <td>${Boolean(item.producto_total) ? "$" + item.producto_total : ""}</td>
    </tr>
    `;
  });

  try {
    document.getElementById("kardex-table").innerHTML = table;
    socket.emit("client:kardex", { table, nombreArticulo });
  } catch (error) {}
}

async function showPeps(nombreArticulo) {
  let { data } = await axios.get(`/peps/show/${nombreArticulo}`);

  let table = "";

  data.forEach(item => {
    table += `
    <tr>
      <th>${item.fecha}</th>
      <td>${item.nombre_detalle}</td>
      <td>${Boolean(item.entrada_cantidad) ? item.entrada_cantidad : ""}</td>
      <td>${
        Boolean(item.entrada_unitario) ? "$" + item.entrada_unitario : ""
      }</td>
      <td>${Boolean(item.entrada_total) ? "$" + item.entrada_total : ""}</td>

      <td>${Boolean(item.salida_cantidad) ? item.salida_cantidad : ""}</td>
      <td>${
        Boolean(item.salida_unitario) ? "$" + item.salida_unitario : ""
      }</td>
      <td>${Boolean(item.salida_total) ? "$" + item.salida_total : ""}</td>

      <td>${Boolean(item.producto_cantidad) ? item.producto_cantidad : "0"}</td>
      <td>${
        Boolean(item.producto_unitario) ? "$" + item.producto_unitario : "0"
      }</td>
      <td>${Boolean(item.producto_total) ? "$" + item.producto_total : "0"}</td>
      <td>${Boolean(item.saldo) ? "$" + item.saldo : "0"}</td>
    </tr>
    `;
  });

  try {
    document.getElementById("peps-table").innerHTML = table;
    socket.emit("client:kardex", { table, nombreArticulo });
  } catch (error) {}
}

(async function showProducts() {
  let { data } = await axios.get("/get-products");

  let table = "";

  data.forEach(item => {
    table += `
    <tr>
      <td>${Boolean(item.nombre_producto) ? item.nombre_producto : ""}</td>
      <td>${Boolean(item.cantidad_producto) ? item.cantidad_producto : ""}</td>
    </tr>
    `;
  });

  try {
    document.getElementById("product-table").innerHTML = table;
    socket.emit("client:products", table);
  } catch (error) {}
})();

async function showProductsPeps(nombreArticulo) {
  let { data } = await axios.get(`/peps/get-products/${nombreArticulo}`);

  let table = "";

  data.forEach(item => {
    table += `
    <tr>
      <td>${Boolean(item.nombre_producto) ? item.nombre_producto : ""}</td>
      <td>${Boolean(item.cantidad_producto) ? item.cantidad_producto : ""}</td>
    </tr>
    `;
  });

  try {
    document.getElementById("product-peps-table").innerHTML = table;
    //socket.emit("client:products", table);
  } catch (error) {}
}

function handleSelect(event) {
  const {
    target: { value: nombreArticulo }
  } = event;

  showKardex(nombreArticulo);
}

function handleSelectPeps(event) {
  const {
    target: { value: nombreArticulo }
  } = event;
  showProductsPeps(nombreArticulo);
  showPeps(nombreArticulo);
}

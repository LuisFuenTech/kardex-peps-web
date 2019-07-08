var socket = io();

(function() {
  socket.on("server:costo", data => {
    console.log("Costo:", data);
  });

  socket.on("server:msg", msg => {
    console.log("Message:", msg);
  });

  socket.on("server:kardex", table => {
    document.getElementById("kardex-table").innerHTML = table;
  });
})();

function valorTotal() {
  const cantidad = Number(document.getElementById("cantidad").value);
  const costo_unitario = Number(
    document.getElementById("costo_unitario").value
  );
  const costo_total = document.getElementById("costo_total");

  socket.emit("client:costo", { costo: costo_unitario, me: "Luis" });

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

async function showKardex() {
  const articulo = document.getElementById("articulo").value;
  let { data } = await axios.get(`/show/${articulo}`);

  console.log(data);

  let table = "";

  data.forEach(item => {
    table += `
    <tr>
      <th>${item.fecha}</th>
      <td>${item.nombre_detalle}</td>
      <td>${Boolean(item.entrada_cantidad) ? item.entrada_cantidad : ""}</td>
      <td>${Boolean(item.entrada_unitario) ? item.entrada_unitario : ""}</td>
      <td>${Boolean(item.entrada_total) ? item.entrada_total : ""}</td>

      <td>${Boolean(item.salida_cantidad) ? item.salida_cantidad : ""}</td>
      <td>${Boolean(item.salida_unitario) ? item.salida_unitario : ""}</td>
      <td>${Boolean(item.salida_total) ? item.salida_total : ""}</td>

      <td>${Boolean(item.producto_cantidad) ? item.producto_cantidad : ""}</td>
      <td>${Boolean(item.producto_unitario) ? item.producto_unitario : ""}</td>
      <td>${Boolean(item.producto_total) ? item.producto_total : ""}</td>
    </tr>
    `;
  });

  document.getElementById("kardex-table").innerHTML = table;
  //socket.emit("client:kardex", table);
}

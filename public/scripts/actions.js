function valorTotal() {
  const cantidad = Number(document.getElementsByName("cantidad")[0].value);
  const costo_unitario = Number(
    document.getElementsByName("costo_unitario")[0].value
  );
  const costo_total = document.getElementsByName("costo_total")[0];

  if (isNaN(cantidad) | isNaN(costo_unitario) | !cantidad | !costo_unitario) {
    costo_total.value = "";
  } else {
    costo_total.value = Number(
      Number(cantidad) * Number(costo_unitario)
    ).toFixed(2);
  }
}

async function handleAction() {
  const accion = document.getElementsByName("accion")[1].checked;
  const articulo = document.getElementsByName("articulo")[0];
  const costo_unitario = document.getElementsByName("costo_unitario")[0];

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
  const articulo = document.getElementsByName("articulo")[0].value;
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
}

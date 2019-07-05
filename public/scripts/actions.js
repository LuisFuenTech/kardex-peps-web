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

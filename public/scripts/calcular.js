function valorTotal() {
  console.log("Change");
  const cantidad = Number(document.getElementsByName("cantidad")[0].value);
  const costo_unitario = Number(
    document.getElementsByName("costo_unitario")[0].value
  );
  const costo_total = document.getElementsByName("costo_total")[0];

  if (isNaN(cantidad) | isNaN(costo_unitario) | !cantidad | !costo_unitario) {
    costo_total.value = "";
  } else {
    costo_total.value = Number(cantidad) * Number(costo_unitario);
  }
}

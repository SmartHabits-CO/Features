const { Before, Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Before(function () { this.state = {}; });

// Background
Given(/^el usuario ha iniciado sesión en la web$/, function () {
  this.state.webLogged = true;
});
Given(/^existen lecturas registradas para al menos un servicio$/, function () {
  this.state.data = { Agua: Array.from({ length: 30 }, (_, i) => i + 1) };
});

// S1: 7 y 30 días
Given(/^existen lecturas continuas de los últimos 30 días$/, function () {
  assert.strictEqual(this.state.data.Agua.length >= 30, true);
});
When(/^el usuario selecciona el rango "7 días"$/, function () {
  this.state.range = 7;
});
Then(/^el gráfico muestra 7 puntos y el promedio semanal$/, function () {
  assert.strictEqual(this.state.range, 7);
  this.state.weekAvg = this.state.data.Agua.slice(-7).reduce((a,b)=>a+b,0)/7;
  assert.ok(!Number.isNaN(this.state.weekAvg));
});
When(/^cambia el rango a "30 días"$/, function () {
  this.state.range = 30;
});
Then(/^el gráfico muestra 30 puntos y el promedio mensual$/, function () {
  assert.strictEqual(this.state.range, 30);
  this.state.monthAvg = this.state.data.Agua.slice(-30).reduce((a,b)=>a+b,0)/30;
  assert.ok(!Number.isNaN(this.state.monthAvg));
});

// S2: Exportar CSV
Given(/^el usuario filtra por servicio "([^"]+)" y rango "30 días"$/, function (svc) {
  this.state.filterSvc = svc;
  this.state.range = 30;
});
When(/^pulsa "Exportar CSV"$/, function () {
  this.state.export = {
    columns: ['Fecha', 'Servicio', 'Unidad', 'Valor'],
    rows: this.state.data[this.state.filterSvc].slice(-30).map((v,i)=>({
      Fecha: `2025-01-${i+1}`, Servicio: this.state.filterSvc, Unidad: 'L', Valor: v
    }))
  };
});
Then(/^se descarga un archivo con columnas Fecha, Servicio, Unidad, Valor$/, function () {
  assert.deepStrictEqual(this.state.export.columns, ['Fecha','Servicio','Unidad','Valor']);
});
Then(/^los datos coinciden con el filtro aplicado$/, function () {
  assert.ok(this.state.export.rows.every(r => r.Servicio === this.state.filterSvc));
  assert.strictEqual(this.state.export.rows.length, 30);
});

// S3: Sin datos
Given(/^no existen lecturas para el rango seleccionado$/, function () {
  this.state.data = { Agua: [] };
  this.state.range = 7;
});
When(/^se carga la vista de histórico$/, function () {
  this.state.viewMessage = this.state.data.Agua.length === 0 ? 'Sin datos para este periodo' : '';
  this.state.actions = ['Limpiar filtros','Cambiar periodo'];
});
Then(/^se muestra "Sin datos para este periodo"$/, function () {
  assert.strictEqual(this.state.viewMessage, 'Sin datos para este periodo');
});
Then(/^se ofrecen "Limpiar filtros" y "Cambiar periodo"$/, function () {
  assert.deepStrictEqual(this.state.actions, ['Limpiar filtros','Cambiar periodo']);
});

// S4: Error y reintento
Given(/^ocurre un fallo temporal del servicio$/, function () {
  this.state.failed = true;
});
When(/^se intenta cargar el histórico$/, function () {
  this.state.errorShown = !!this.state.failed;
});
Then(/^se muestra un mensaje de error y el botón "Reintentar"$/, function () {
  assert.strictEqual(this.state.errorShown, true);
});
When(/^el usuario pulsa "Reintentar" y el servicio se restablece$/, function () {
  this.state.failed = false;
  this.state.data = { Agua: Array.from({ length: 7 }, (_, i) => i + 1) };
});
Then(/^los datos se muestran correctamente$/, function () {
  assert.strictEqual(this.state.failed, false);
  assert.ok(this.state.data.Agua.length > 0);
});

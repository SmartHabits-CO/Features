const { Before, Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Before(function () { this.state = {}; });

// Background
Given(/^el usuario está en la pantalla del simulador$/, function () {
  this.state.screen = 'simulador';
});

// S1: Cálculo con meta
Given(/^el usuario define meta "(-?\d+)%" para luz$/, function (pct) {
  this.state.metaPct = Number(pct);
});
Given(/^selecciona "([^"]+)" y "([^"]+)"$/, function (a, b) {
  this.state.habits = [a, b];
});
When(/^pulsa "Calcular"$/, function () {
  if (!this.state.habits || this.state.habits.length === 0) {
    this.state.message = 'Selecciona al menos un hábito';
    this.state.calculated = false;
    return;
  }
  this.state.calculated = true;
  this.state.savingAmount = 25.5; // mock
  this.state.message = `Ahorro proyectado: S/ ${this.state.savingAmount} y ${this.state.metaPct}% kWh`;
});
Then(/^se muestra "Ahorro proyectado: S\/ .* y -10% kWh"$/, function () {
  assert.ok(this.state.message.includes('Ahorro proyectado: S/'));
  assert.ok(this.state.message.includes('-10% kWh'));
});
Then(/^se ofrece la acción "Agregar al plan"$/, function () {
  this.state.canAddToPlan = this.state.calculated;
  assert.strictEqual(this.state.canAddToPlan, true);
});

// S2: Parámetros incompletos
Given(/^el usuario no seleccionó ningún hábito$/, function () {
  this.state.habits = [];
});
Then(/^se muestra "Selecciona al menos un hábito"$/, function () {
  assert.strictEqual(this.state.message, 'Selecciona al menos un hábito');
});
Then(/^el cálculo no se ejecuta$/, function () {
  assert.strictEqual(this.state.calculated, false);
});

// S3: Rango de metas
Given(/^el usuario ingresa meta "(-?\d+)%"$/, function (pct) {
  this.state.inputMeta = Number(pct);
});
When(/^guarda la meta$/, function () {
  const m = this.state.inputMeta;
  this.state.metaMsg = (m <= -1 && m >= -50) ? 'Meta guardada' : 'Meta fuera de rango (-1 a -50)';
});
Then(/^el sistema muestra "([^"]+)"$/, function (msg) {
  assert.strictEqual(this.state.metaMsg, msg);
});


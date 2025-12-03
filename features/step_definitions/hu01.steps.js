// features/step_definitions/hu01.steps.js
const { Before, Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Before(function () {
  this.state = {};
});

// ---------- Background ----------
Given(/^la cuenta está activa$/, function () {
  this.state.accountActive = true;
});
Given(/^el usuario ha iniciado sesión en la app$/, function () {
  this.state.loggedIn = true;
});

// ---------- Escenario: Vínculo exitoso por QR ----------
Given(/^el medidor no está vinculado$/, function () {
  this.state.meterLinked = false;
});
Given(/^el usuario escanea un QR vá?lido del medidor$/, function () {
  this.state.qr = 'valid';
});
When(/^confirma el vínculo$/, function () {
  // Resolución de vínculo según contexto
  if (this.state.qr === 'valid' && !this.state.meterAlreadyLinked && !this.state.offline) {
    this.state.linked = true;
    this.state.message = 'Vinculado correctamente';
    this.state.updateDelaySec = 30; // simulado
  } else if (this.state.meterAlreadyLinked) {
    this.state.message = 'Medidor ya vinculado';
    this.state.blocked = true;
  } else {
    this.state.message = 'No se pudo vincular';
    this.state.options = ['Reintentar', 'Ver ayuda'];
  }
});
Then(/^el sistema muestra "([^"]+)"$/, function (msg) {
  assert.strictEqual(this.state.message, msg);
});
Then(/^el dashboard refleja lecturas en menos de (\d+) segundos$/, function (seg) {
  assert.ok(this.state.updateDelaySec <= Number(seg));
});

// ---------- Escenario: QR inválido / fuera de línea ----------
Given(/^el usuario escanea un QR invá?lido o el medidor está fuera de línea$/, function () {
  this.state.qr = 'invalid';
  this.state.offline = true;
});
When(/^intenta confirmar el vínculo$/, function () {
  // reutiliza la misma lógica
  if (this.state.qr === 'valid' && !this.state.offline) {
    this.state.message = 'Vinculado correctamente';
  } else {
    this.state.message = 'No se pudo vincular';
    this.state.options = ['Reintentar', 'Ver ayuda'];
  }
});
Then(/^se muestra "([^"]+)"$/, function (msg) {
  assert.strictEqual(this.state.message, msg);
});
Then(/^se ofrecen las opciones "([^"]+)" y "([^"]+)"$/, function (op1, op2) {
  assert.deepStrictEqual(this.state.options, [op1, op2]);
});

// ---------- Escenario: Medidor ya vinculado ----------
Given(/^el medidor ya está asociado a otra cuenta$/, function () {
  this.state.meterAlreadyLinked = true;
});
When(/^el usuario intenta vincularlo$/, function () {
  this.state.message = 'Medidor ya vinculado';
  this.state.blocked = true;
});
Then(/^la acción de confirmación queda bloqueada$/, function () {
  assert.strictEqual(this.state.blocked, true);
});

// ---------- Scenario Outline: nombre y ubicación ----------
Given(/^el usuario ingresa nombre "([^"]*)" y ubicación "([^"]*)"$/, function (nombre, ubicacion) {
  this.state.nombre = nombre;
  this.state.ubicacion = ubicacion;
});
When(/^guarda la configuración$/, function () {
  if (!this.state.nombre) this.state.result = 'Nombre requerido';
  else if (!this.state.ubicacion) this.state.result = 'Ubicación requerida';
  else this.state.result = 'Guardado correctamente';
});
Then(/^el sistema responde "([^"]+)"$/, function (resultado) {
  assert.strictEqual(this.state.result, resultado);
});


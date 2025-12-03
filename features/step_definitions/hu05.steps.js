const { Before, Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Before(function () { this.state = {}; });

// Background
Given(/^existe una cuenta registrada con correo válido$/, function () {
  this.state.account = { email: 'user@ecoliving.app', password: 'Correcta123' };
});

// S1: Login válido
Given(/^la contraseña ingresada es correcta$/, function () {
  this.state.inputPassword = 'Correcta123';
});
When(/^el usuario inicia sesión$/, function () {
  this.state.loginOK = this.state.inputPassword === this.state.account.password;
  this.state.firstLoadMs = this.state.loginOK ? 1500 : null; // mock 1.5s
});
Then(/^accede al dashboard$/, function () {
  assert.strictEqual(this.state.loginOK, true);
});
Then(/^la carga inicial se completa en menos de 2 segundos en red doméstica$/, function () {
  assert.ok(this.state.firstLoadMs < 2000);
});

// S2: Credenciales inválidas
Given(/^la contraseña ingresada es incorrecta$/, function () {
  this.state.inputPassword = 'mala';
});
When(/^el usuario intenta iniciar sesión tres veces$/, function () {
  this.state.attempts = 3;
  this.state.loginOK = false;
  this.state.loginMsg = 'Credenciales inválidas';
});
Then(/^se muestra "([^"]+)"$/, function (msg) {
  assert.strictEqual(this.state.loginMsg, msg);
});
Then(/^se ofrece "Recuperar contraseña"$/, function () {
  this.state.recoveryOffered = true;
  assert.strictEqual(this.state.recoveryOffered, true);
});

// S3: Recuperación de contraseña
Given(/^el usuario solicita recuperar contraseña$/, function () {
  this.state.recoveryRequested = true;
});
When(/^ingresa su correo registrado$/, function () {
  this.state.resetLinkSent = this.state.recoveryRequested;
});
Then(/^recibe un enlace de restablecimiento$/, function () {
  assert.strictEqual(this.state.resetLinkSent, true);
});
Then(/^al crear una nueva contraseña puede iniciar sesión exitosamente$/, function () {
  this.state.account.password = 'Nueva123';
  this.state.inputPassword = 'Nueva123';
  this.state.loginOK = this.state.inputPassword === this.state.account.password;
  assert.strictEqual(this.state.loginOK, true);
});

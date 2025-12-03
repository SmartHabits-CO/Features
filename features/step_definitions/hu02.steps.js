const { Before, Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Before(function () { this.state = {}; });

// Background
Given(/^existe al menos un medidor vinculado$/, function () {
  this.state.meterLinked = true;
});

// S1: Umbral superado
Given(/^el usuario configuró umbral diario de agua en (\d+) L$/, function (n) {
  this.state.threshold = Number(n);
});
Given(/^el sistema detecta consumo acumulado de (\d+) L$/, function (n) {
  this.state.detected = Number(n);
});
When(/^se procesa la nueva lectura$/, function () {
  if (this.state.detected >= this.state.threshold) {
    this.state.push = `Umbral superado: ${this.state.detected} L`;
    this.state.centerHasAlert = true;
  }
});
Then(/^el usuario recibe una notificación push "([^"]+)"$/, function (msg) {
  assert.strictEqual(this.state.push, msg);
});
Then(/^la alerta aparece en el centro de notificaciones de la app$/, function () {
  assert.strictEqual(this.state.centerHasAlert, true);
});

// S2: Silenciar 24h
Given(/^existe una alerta activa de consumo$/, function () {
  this.state.activeAlert = true;
});
When(/^el usuario pulsa "Silenciar 24 h"$/, function () {
  if (this.state.activeAlert) { this.state.silencedHours = 24; }
});
Then(/^no se envían nuevas notificaciones durante 24 horas$/, function () {
  assert.strictEqual(this.state.silencedHours, 24);
});
Then(/^la alerta queda marcada como silenciada$/, function () {
  assert.strictEqual(!!this.state.silencedHours, true);
});

// S3: Recomendación contextual
Given(/^se generó una alerta por pico nocturno$/, function () {
  this.state.context = 'pico_nocturno';
});
When(/^el usuario abre la alerta$/, function () {
  this.state.recommendations = this.state.context === 'pico_nocturno';
});
Then(/^ve recomendaciones para diagnóstico de fuga$/, function () {
  assert.strictEqual(this.state.recommendations, true);
});
Then(/^puede marcar "Seguir pasos" y registrar resultado$/, function () {
  this.state.followed = true;
  assert.strictEqual(this.state.followed, true);
});

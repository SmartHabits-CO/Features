
# archivo: hu02_alertas_consumo.feature
@mobile @hu02
Feature: Alertas por consumo anómalo
  Para detectar picos y fugas
  Como usuario de EcoLiving
  Quiero recibir y gestionar alertas por umbral

  Background:
    Given la cuenta está activa
    And existe al menos un medidor vinculado

  Scenario: Alerta por superación de umbral diario
    Given el usuario configuró umbral diario de agua en 250 L
    And el sistema detecta consumo acumulado de 260 L
    When se procesa la nueva lectura
    Then el usuario recibe una notificación push "Umbral superado: 260 L"
    And la alerta aparece en el centro de notificaciones de la app

  Scenario: Silenciar alertas por 24 horas
    Given existe una alerta activa de consumo
    When el usuario pulsa "Silenciar 24 h"
    Then no se envían nuevas notificaciones durante 24 horas
    And la alerta queda marcada como silenciada

  Scenario: Recomendación contextual tras alerta
    Given se generó una alerta por pico nocturno
    When el usuario abre la alerta
    Then ve recomendaciones para diagnóstico de fuga
    And puede marcar "Seguir pasos" y registrar resultado

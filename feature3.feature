
@mobile @hu03
Feature: Simulador de ahorro
  Para estimar beneficios de cambios de hábito
  Como usuario de EcoLiving
  Quiero calcular el ahorro proyectado con una meta mensual

  Background:
    Given la cuenta está activa
    And el usuario está en la pantalla del simulador

  Scenario: Cálculo de ahorro con meta mensual
    Given el usuario define meta "-10%" para luz
    And selecciona "Apagar stand-by nocturno" y "LED en sala"
    When pulsa "Calcular"
    Then se muestra "Ahorro proyectado: S/ <monto> y -10% kWh"
    And se ofrece la acción "Agregar al plan"

  Scenario: Parámetros incompletos
    Given el usuario no seleccionó ningún hábito
    When pulsa "Calcular"
    Then se muestra "Selecciona al menos un hábito"
    And el cálculo no se ejecuta

  Scenario Outline: Validación de rango de metas
    Given el usuario ingresa meta "<meta>%"
    When guarda la meta
    Then el sistema muestra "<mensaje>"
    Examples:
      | meta | mensaje                         |
      | -5   | Meta guardada                   |
      | -30  | Meta guardada                   |
      | -60  | Meta fuera de rango (-1 a -50)  |
      | 0    | Meta fuera de rango (-1 a -50)  |




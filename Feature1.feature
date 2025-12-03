# archivo: hu01_vincular_medidor.feature
@mobile @hu01
Feature: Vincular medidor IoT
  Para registrar lecturas automáticas
  Como usuario de EcoLiving
  Quiero vincular mi medidor mediante QR

  Background:
    Given la cuenta está activa
    And el usuario ha iniciado sesión en la app

  Scenario: Vínculo exitoso por QR
    Given el medidor no está vinculado
    And el usuario escanea un QR válido del medidor
    When confirma el vínculo
    Then el sistema muestra "Vinculado correctamente"
    And el dashboard refleja lecturas en menos de 60 segundos

  Scenario: QR inválido o medidor fuera de línea
    Given el usuario escanea un QR inválido o el medidor está fuera de línea
    When intenta confirmar el vínculo
    Then se muestra "No se pudo vincular"
    And se ofrecen las opciones "Reintentar" y "Ver ayuda"

  Scenario: Medidor ya vinculado a otra cuenta
    Given el medidor ya está asociado a otra cuenta
    When el usuario intenta vincularlo
    Then se muestra "Medidor ya vinculado"
    And la acción de confirmación queda bloqueada

  Scenario Outline: Validación de nombre y ubicación del medidor
    Given el usuario ingresa nombre "<nombre>" y ubicación "<ubicacion>"
    When guarda la configuración
    Then el sistema responde "<resultado>"
    Examples:
      | nombre    | ubicacion | resultado                |
      | Cocina    | Piso 2    | Guardado correctamente   |
      |           | Sala      | Nombre requerido         |
      | Tanque-Lg |           | Ubicación requerida      |



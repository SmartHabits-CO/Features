
# archivo: hu05_autenticacion.feature
@web @mobile @hu05
Feature: Autenticación básica
  Para proteger el acceso y datos
  Como usuario de EcoLiving
  Quiero iniciar sesión y recuperar mi contraseña

  Background:
    Given existe una cuenta registrada con correo válido

  Scenario: Inicio de sesión válido
    Given la contraseña ingresada es correcta
    When el usuario inicia sesión
    Then accede al dashboard
    And la carga inicial se completa en menos de 2 segundos en red doméstica

  Scenario: Credenciales inválidas con límite de intentos
    Given la contraseña ingresada es incorrecta
    When el usuario intenta iniciar sesión tres veces
    Then se muestra "Credenciales inválidas"
    And se ofrece "Recuperar contraseña"

  Scenario: Recuperación de contraseña
    Given el usuario solicita recuperar contraseña
    When ingresa su correo registrado
    Then recibe un enlace de restablecimiento
    And al crear una nueva contraseña puede iniciar sesión exitosamente


